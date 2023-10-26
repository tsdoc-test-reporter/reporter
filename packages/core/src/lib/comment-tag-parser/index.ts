import { DocComment, Standardization, TextRange, TSDocParser } from '@microsoft/tsdoc';
import {
	type Node,
	type SourceFile,
	type CommentRange,
	type CallExpression,
	isStringLiteral,
	JSDoc,
	isExpressionStatement,
	isCallExpression,
	TypeChecker,
} from 'typescript';

import { baseTestBlockNames, coreDefaults, jsDocTagsMap } from '../defaults';
import type {
	AllTagsName,
	CommentTagParserConfig,
	ICommentTagParser,
	ModifierTagName,
	TestBlockDocComment,
	TestBlockName,
} from '../types';
import { unquoteString } from '../utils/string.utils';
import {
	getJSDocCommentRanges,
	getJSDocContent,
	getJSDocs,
	getTestBlockBaseName,
	getTestBlockName,
	getTestTitleFromExpression,
	hasJSDoc,
	lookupMemberReferences,
} from '../utils/ts.utils';
import {
	docBlockToDocBlockTags,
	getBlockTagType,
	getModifierTagType,
	getTestType,
	tagNameToTSDocBlock,
} from '../utils/tsdoc.utils';
import { BlockTagName } from '../types';

/**
 * Parser for extracting JSDoc and TSDoc tags from comments.
 * Will extract all valid JSDoc tags and TSDoc tags that is able
 * to parse. If a tag exists in both standard and TSDoc extends it:
 * the TSDoc tag will be used.
 */
export class CommentTagParser<CustomTags extends string = AllTagsName>
	implements ICommentTagParser<CustomTags>
{
	private sourceFile: SourceFile;
	private sourceFileBuffer: string;
	private tsDocParser: TSDocParser;
	private tagSeparator: string;
	private excludeTags?: (AllTagsName | CustomTags)[];
	private testBlockTagNames?: TestBlockName[];
	private getTypeChecker: () => TypeChecker;
	private _testBlockDocComments: TestBlockDocComment<CustomTags>[] = [];
	private customTags: CustomTags[];

	constructor({
		sourceFile,
		tsDocParser,
		excludeTags,
		tagSeparator = coreDefaults.tagSeparator,
		testBlockTagNames,
		getTypeChecker,
	}: CommentTagParserConfig<CustomTags>) {
		this.tsDocParser = tsDocParser;
		this.sourceFile = sourceFile;
		this.tagSeparator = tagSeparator;
		this.excludeTags = excludeTags;
		this.testBlockTagNames = testBlockTagNames;
		this.sourceFileBuffer = sourceFile.getFullText();
		this.getTypeChecker = getTypeChecker;
		this.customTags = tsDocParser.configuration.tagDefinitions
			.filter((tagDefinition) => tagDefinition.standardization === Standardization.None)
			.map((tagDefinition) => tagDefinition.tagName) as CustomTags[];
		this.findTestBlockDocComments(this.sourceFile);
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
		return getTestTitleFromExpression(firstArgument, this.getTypeChecker());
	}

	private parseTsDocCommentRange({ pos, end }: CommentRange): DocComment {
		return this.tsDocParser.parseRange(TextRange.fromStringRange(this.sourceFileBuffer, pos, end))
			.docComment;
	}

	private getJSDocComments(
		title: string,
		testBlockName: TestBlockName,
		jsDocs: JSDoc[],
	): TestBlockDocComment<CustomTags>['testBlockTags'] {
		const tags: TestBlockDocComment<CustomTags>['testBlockTags'] = {};
		jsDocs
			.flatMap((jsDoc) => jsDoc.tags ?? [])
			.forEach((tag) => {
				const tagName = `@${tag.tagName.text}` as AllTagsName | CustomTags;
				if (this.apply(tagName, testBlockName) && tagName in jsDocTagsMap) {
					tags[tagName] = {
						name: tagName,
						testTitle: title,
						testFilePath: this.sourceFile.fileName,
						testBlockName,
						type: 'standard',
						kind: 'block',
						jsDoc: true,
						tags: getJSDocContent(tag, this.tagSeparator),
					};
				}
			});
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
					testFilePath: this.sourceFile.fileName,
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
					const content = docBlockToDocBlockTags(
						docBlock,
						this.tagSeparator,
						lookupMemberReferences(this.sourceFile, this.getTypeChecker),
					);
					if (content.length) {
						tags[name] = {
							type,
							tags: content,
							kind: 'block',
							name: name,
							testBlockName,
							testTitle,
							testFilePath: this.sourceFile.fileName,
						};
					}
				}
			},
		);
		return tags;
	}

	private commentRangeToTestBlockDocComment(node: CallExpression, title: string, jsDocs?: JSDoc[]) {
		return (comment: CommentRange): TestBlockDocComment<CustomTags> => {
			const testBlockName = getTestBlockName(node.expression);
			return {
				testFilePath: this.sourceFile.fileName,
				title,
				type: getTestType(testBlockName),
				testBlockName,
				testBlockTags: {
					...(jsDocs ? this.getJSDocComments(title, testBlockName, jsDocs) : {}),
					...this.getTagsFromDocComment(this.parseTsDocCommentRange(comment), testBlockName, title),
				} as TestBlockDocComment<CustomTags>['testBlockTags'],
				commentStartPosition: comment.pos,
				commentEndPosition: comment.end,
			};
		};
	}

	private findTestBlockDocComments(node: Node): void {
		if (isExpressionStatement(node) && isCallExpression(node.expression) && hasJSDoc(node)) {
			const baseTestBlockName = getTestBlockBaseName(node.expression);
			if (baseTestBlockName && baseTestBlockName in baseTestBlockNames) {
				const jsDocs = getJSDocs(node);
				if (jsDocs && jsDocs.length > 0) {
					const expressionToParse = isCallExpression(node.expression.expression)
						? node.expression.expression
						: node.expression;
					const testTitle = this.getTestTitle(node.expression);
					const testTags = getJSDocCommentRanges(this.sourceFileBuffer, node)?.map(
						this.commentRangeToTestBlockDocComment(expressionToParse, testTitle, jsDocs),
					);
					if (testTags) {
						this._testBlockDocComments = [...this.testBlockDocComments, ...testTags];
					}
				}
			}
		}
		return node.forEachChild((child) => this.findTestBlockDocComments(child));
	}
}
