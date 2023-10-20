import { DocComment, TextRange, TSDocParser } from '@microsoft/tsdoc';
import {
	type Node,
	type SourceFile,
	type CommentRange,
	type CallExpression,
	isStringLiteral,
	Expression,
} from 'typescript';

import { allModifierTags, ancestorTagNames, coreDefaults } from '../defaults';
import type {
	AllTagsName,
	CommentTagParserConfig,
	ICommentTagParser,
	ModifierTagName,
	TagKind,
	TagType,
	TestBlockDocComment,
	TestBlockName,
} from '../types';
import { unquoteString } from '../utils/string.utils';
import { getJSDocCommentRanges, getNodeName, isTestBlock } from '../utils/ts.utils';
import { docBlockToDocBlockTags, tagNameToTSDocBlock } from '../utils/tsdoc.utils';
import { BlockTagName } from '../types';

export class CommentTagParser<CustomTag extends string = AllTagsName>
	implements ICommentTagParser<CustomTag>
{
	private sourceFile: SourceFile;
	private sourceFileBuffer: string;
	private tsDocParser: TSDocParser;
	private testBlockTagNames: TestBlockName[];
	private tagSeparator: string;
	private applyTags: (AllTagsName | CustomTag)[];
	private getTestTitleFromExpression: (expression: Expression) => string;
	private _testBlockDocComments: TestBlockDocComment<CustomTag>[] = [];

	constructor({
		sourceFile,
		tsDocParser,
		applyTags = coreDefaults.applyTags as (AllTagsName | CustomTag)[],
		testBlockTagNames = coreDefaults.testBlockTagNames,
		tagSeparator = coreDefaults.tagSeparator,
		getTestTitleFromExpression,
	}: CommentTagParserConfig<CustomTag>) {
		this.tsDocParser = tsDocParser;
		this.sourceFile = sourceFile;
		this.testBlockTagNames = testBlockTagNames;
		this.tagSeparator = tagSeparator;
		this.applyTags = applyTags;
		this.sourceFileBuffer = sourceFile.getFullText();
		this.findTestBlockDocComments(this.sourceFile);
		this.getTestTitleFromExpression = getTestTitleFromExpression;
	}

	public get testBlockDocComments(): TestBlockDocComment<CustomTag>[] {
		return this._testBlockDocComments;
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

	private getBlockTags(
		docComment: DocComment,
		testBlockName: TestBlockName,
		testTitle: string,
	): TestBlockDocComment<CustomTag>['testBlockTags'] {
		const tags: TestBlockDocComment<CustomTag>['testBlockTags'] = {};
		for (const tagName of this.applyTags) {
			const kind: TagKind = docComment.modifierTagSet.hasTagName(tagName) ? 'modifier' : 'block';
			if (kind === 'modifier') {
				const modifierTag = docComment.modifierTagSet.nodes.find(
					(node) => node.tagName === tagName,
				);
				if (modifierTag) {
					tags[tagName] = {
						type: allModifierTags.includes(tagName as ModifierTagName) ? 'standard' : 'custom',
						kind,
						name: tagName,
						testBlockName,
						testTitle,
					};
				}
			} else {
				const type: TagType = tagName in tagNameToTSDocBlock ? 'standard' : 'custom';
				const docBlock =
					type === 'standard'
						? docComment[tagNameToTSDocBlock[tagName as BlockTagName]]
						: docComment.customBlocks.find((block) => block.blockTag.tagName === tagName);
				if (docBlock) {
					tags[tagName] = {
						type,
						tags: docBlockToDocBlockTags(docBlock, this.tagSeparator),
						kind,
						name: tagName,
						testBlockName,
						testTitle,
					};
				}
			}
		}
		return tags;
	}

	private commentRangeToTestBlockDocComment(
		node: CallExpression,
	): (comment: CommentRange) => TestBlockDocComment<CustomTag> {
		return (comment: CommentRange): TestBlockDocComment<CustomTag> => {
			const nodeName = getNodeName(node.expression) as TestBlockName;
			const title = this.getTestTitle(node);
			return {
				testFilePath: this.sourceFile.fileName,
				title,
				type: ancestorTagNames.includes(nodeName) ? 'ancestor' : 'test',
				testBlockName: nodeName,
				testBlockTags: this.getBlockTags(this.parseTsDocCommentRange(comment), nodeName, title),
				commentStartPosition: comment.pos,
				commentEndPosition: comment.end,
			};
		};
	}

	private findTestBlockDocComments(node: Node): void {
		if (isTestBlock(node, this.testBlockTagNames)) {
			const testTags = getJSDocCommentRanges(this.sourceFileBuffer, node)?.map(
				this.commentRangeToTestBlockDocComment(node),
			);
			if (testTags) {
				this._testBlockDocComments = [...this.testBlockDocComments, ...testTags];
			}
		}
		return node.forEachChild((child) => this.findTestBlockDocComments(child));
	}
}
