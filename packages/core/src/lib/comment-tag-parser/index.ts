import { DocComment, Standardization, TextRange, TSDocParser } from '@microsoft/tsdoc';
import {
	type Node,
	type SourceFile,
	type CommentRange,
	type CallExpression,
	isStringLiteral,
	Expression,
	JSDoc,
	isExpressionStatement,
	isCallExpression,
} from 'typescript';

import { allTsDocTags, coreDefaults } from '../defaults';
import type {
	AllTagsName,
	CommentTagParserConfig,
	ICommentTagParser,
	ModifierTagName,
	TestBlockDocComment,
	TestBlockName,
} from '../types';
import { unquoteString } from '../utils/string.utils';
import { getJSDocCommentRanges, getNodeName } from '../utils/ts.utils';
import {
	docBlockToDocBlockTags,
	getBlockTagType,
	getModifierTagType,
	getTestType,
	tagNameToTSDocBlock,
} from '../utils/tsdoc.utils';
import { BlockTagName } from '../types';

export class CommentTagParser<CustomTags extends string = AllTagsName>
	implements ICommentTagParser<CustomTags>
{
	private sourceFile: SourceFile;
	private sourceFileBuffer: string;
	private tsDocParser: TSDocParser;
	private tagSeparator: string;
	private excludeTags?: (AllTagsName | CustomTags)[];
	private testBlockTagNames?: TestBlockName[];
	private getTestTitleFromExpression: (expression: Expression) => string;
	private _testBlockDocComments: TestBlockDocComment<CustomTags>[] = [];
	private customTags: CustomTags[];

	constructor({
		sourceFile,
		tsDocParser,
		excludeTags,
		tagSeparator = coreDefaults.tagSeparator,
		testBlockTagNames,
		getTestTitleFromExpression,
	}: CommentTagParserConfig<CustomTags>) {
		this.tsDocParser = tsDocParser;
		this.sourceFile = sourceFile;
		this.tagSeparator = tagSeparator;
		this.excludeTags = excludeTags;
		this.testBlockTagNames = testBlockTagNames;
		this.sourceFileBuffer = sourceFile.getFullText();
		this.customTags = tsDocParser.configuration.tagDefinitions
			.filter((tagDefinition) => tagDefinition.standardization === Standardization.None)
			.map((tagDefinition) => tagDefinition.tagName) as CustomTags[];
		this.findTestBlockDocComments(this.sourceFile);
		this.getTestTitleFromExpression = getTestTitleFromExpression;
	}

	public get testBlockDocComments(): TestBlockDocComment<CustomTags>[] {
		return this._testBlockDocComments;
	}

	private apply(tagName: AllTagsName | CustomTags, testBlockTagName: TestBlockName): boolean {
		const applyTag = this.excludeTags ? !this.excludeTags.includes(tagName) : true;
		const applyBlockName = this.testBlockTagNames
			? this.testBlockTagNames.includes(testBlockTagName)
			: true;
		return applyTag && applyBlockName;
	}

	private getTestTitle(node: CallExpression): string {
		const firstArgument = node.arguments[0];
		if (isStringLiteral(firstArgument)) {
			return unquoteString(firstArgument.getText(this.sourceFile));
		}
		return this.getTestTitleFromExpression(firstArgument);
	}

	private parseTsDocCommentRange({ pos, end }: CommentRange): DocComment {
		return this.tsDocParser.parseRange(TextRange.fromStringRange(this.sourceFileBuffer, pos, end))
			.docComment;
	}

	private getJSDocComments(node: Node): TestBlockDocComment<CustomTags>['testBlockTags'] {
		const tags: TestBlockDocComment<CustomTags>['testBlockTags'] = {};
		if ('jsDoc' in node && node.jsDoc && Array.isArray(node.jsDoc)) {
			const jsDoc = node.jsDoc[0] as JSDoc;
			jsDoc.tags?.forEach((tag) => {
				const tagName = `@${tag.tagName.text}` as AllTagsName | CustomTags;
				const testBlockName =
					isExpressionStatement(node) && isCallExpression(node.expression)
						? (getNodeName(node.expression.expression) as TestBlockName)
						: 'test';
				if (this.apply(tagName, testBlockName)) {
					tags[tagName] = {
						name: tagName,
						testTitle:
							isExpressionStatement(node) && isCallExpression(node.expression)
								? this.getTestTitle(node.expression)
								: '',
						testBlockName,
						type: 'standard',
						kind: 'block',
						jsDoc: !allTsDocTags.includes(tagName as BlockTagName),
						tags: Array.isArray(tag.comment)
							? (tag.comment?.[0].text as string)?.split(this.tagSeparator)
							: (tag.comment as string)?.split(this.tagSeparator),
					};
				}
			});
		}
		return tags;
	}

	private getCustomTags() {
		return Object.fromEntries(this.customTags.map((tag) => [tag, tag]));
	}

	private getTagsFromDocComment(
		docComment: DocComment,
		testBlockName: TestBlockName,
		testTitle: string,
	): TestBlockDocComment<CustomTags>['testBlockTags'] {
		const tags: TestBlockDocComment<CustomTags>['testBlockTags'] = {};
		docComment.modifierTagSet.nodes.forEach((modifier) => {
			const tagName = modifier.tagName as ModifierTagName;
			if (this.apply(tagName, testBlockName)) {
				tags[tagName] = {
					type: getModifierTagType(tagName),
					kind: 'modifier',
					name: tagName,
					testBlockName,
					testTitle,
				};
			}
		});
		Object.entries({ ...tagNameToTSDocBlock, ...this.getCustomTags() }).forEach(
			([tagName, tagBlock]) => {
				const name = tagName as BlockTagName;
				const type = getBlockTagType(name);
				const docBlock =
					type === 'standard'
						? docComment[tagBlock]
						: docComment.customBlocks.find((block) => block.blockTag.tagName === name);
				if (docBlock && this.apply(name, testBlockName)) {
					tags[name] = {
						type,
						tags: docBlockToDocBlockTags(docBlock, this.tagSeparator),
						kind: 'block',
						name: name,
						testBlockName,
						testTitle,
					};
				}
			},
		);
		return tags;
	}

	private commentRangeToTestBlockDocComment(
		node: CallExpression,
		jsDocComments?: TestBlockDocComment<CustomTags>['testBlockTags'],
	): (comment: CommentRange) => TestBlockDocComment<CustomTags> {
		return (comment: CommentRange): TestBlockDocComment<CustomTags> => {
			const testBlockName = getNodeName(node.expression) as TestBlockName;
			const title = this.getTestTitle(node);
			return {
				testFilePath: this.sourceFile.fileName,
				title,
				type: getTestType(testBlockName),
				testBlockName,
				testBlockTags: {
					...jsDocComments,
					...this.getTagsFromDocComment(this.parseTsDocCommentRange(comment), testBlockName, title),
				} as TestBlockDocComment<CustomTags>['testBlockTags'],
				commentStartPosition: comment.pos,
				commentEndPosition: comment.end,
			};
		};
	}

	private findTestBlockDocComments(node: Node): void {
		if (isExpressionStatement(node) && isCallExpression(node.expression)) {
			const jsDocComments = this.getJSDocComments(node);
			const testTags = getJSDocCommentRanges(this.sourceFileBuffer, node)?.map(
				this.commentRangeToTestBlockDocComment(node.expression, jsDocComments),
			);
			if (testTags) {
				this._testBlockDocComments = [...this.testBlockDocComments, ...testTags];
			}
		}
		return node.forEachChild((child) => this.findTestBlockDocComments(child));
	}
}
