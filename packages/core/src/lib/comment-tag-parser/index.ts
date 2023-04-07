import { DocBlock, DocComment, TextRange, TSDocParser } from '@microsoft/tsdoc';
import type {
	Node,
	SourceFile,
	CommentRange,
	CallExpression,
} from 'typescript';

import { coreDefaults } from '../defaults';
import type {
	BlockTagNames,
	CommentTagParserConfig,
	ICommentTagParser,
	TestBlockDocComment,
	TestBlockNames,
} from '../types';
import { unquoteString } from '../utils/format.utils';
import {
	getJSDocCommentRanges,
	getNodeName,
	isTestBlock,
} from '../utils/ts.utils';
import {
	docBlockToDocBlockTags,
	tagNameToTSDocBlock,
} from '../utils/tsdoc.utils';

export class CommentTagParser<CustomTag extends string>
	implements ICommentTagParser<CustomTag>
{
	private sourceFile: SourceFile;
	private sourceFileBuffer: string;
	private tsDocParser: TSDocParser;
	private testBlockTagNames: string[];
	private tagSeparator: string;
	private applyTags: (BlockTagNames | CustomTag)[];
	private _testBlockDocComments: TestBlockDocComment<CustomTag>[] = [];

	constructor({
		sourceFile,
		tsDocParser,
		applyTags = coreDefaults.applyTags as (BlockTagNames | CustomTag)[],
		testBlockTagNames = coreDefaults.testBlockTagNames,
		tagSeparator = coreDefaults.tagSeparator,
	}: CommentTagParserConfig<CustomTag>) {
		this.tsDocParser = tsDocParser;
		this.sourceFile = sourceFile;
		this.testBlockTagNames = testBlockTagNames;
		this.tagSeparator = tagSeparator;
		this.applyTags = applyTags;
		this.sourceFileBuffer = sourceFile.getFullText();
		this.findTestBlockDocComments(this.sourceFile);
	}

	public get testBlockDocComments(): TestBlockDocComment<CustomTag>[] {
		return this._testBlockDocComments;
	}

	private getTestTitle(node: CallExpression): string {
		const firstArgument = node.arguments[0];
		return unquoteString(firstArgument.getText(this.sourceFile));
	}

	private parseTsDocCommentRange({ pos, end }: CommentRange): DocComment {
		return this.tsDocParser.parseRange(
			TextRange.fromStringRange(this.sourceFileBuffer, pos, end)
		).docComment;
	}

	private getGetBlockTags(
		docComment: DocComment,
		testBlockType: TestBlockNames,
		testTitle: string
	): TestBlockDocComment<CustomTag>['testBlockTags'] {
		const tags: TestBlockDocComment<CustomTag>['testBlockTags'] = {};
		for (const tagName of this.applyTags) {
			let docBlock: DocBlock | undefined = undefined;
			if (tagName in tagNameToTSDocBlock) {
				const blockName = tagNameToTSDocBlock[tagName as BlockTagNames];
				docBlock = docComment[blockName];
			} else {
				docBlock = docComment.customBlocks.find(
					(customBlock) => customBlock.blockTag.tagName === tagName
				);
			}
			if (docBlock) {
				const docBlockTags = docBlockToDocBlockTags(
					docBlock,
					this.tagSeparator
				);
				tags[tagName] = {
					type: 'standard',
					tags: docBlockTags,
					tagName,
					testBlockType,
					testTitle,
				};
			}
		}
		return tags;
	}

	private commentRangeToTestBlockDocComment(
		node: CallExpression
	): (comment: CommentRange) => TestBlockDocComment<CustomTag> {
		return (comment: CommentRange): TestBlockDocComment<CustomTag> => {
			const nodeName = getNodeName(node) as 'describe' | 'test';
			const title = this.getTestTitle(node);
			return {
				testFilePath: this.sourceFile.fileName,
				title,
				testBlockType: nodeName,
				testBlockTags: this.getGetBlockTags(
					this.parseTsDocCommentRange(comment),
					nodeName,
					title
				),
				commentStartPosition: comment.pos,
				commentEndPosition: comment.end,
			};
		};
	}

	private findTestBlockDocComments(node: Node): void {
		if (isTestBlock(node, this.testBlockTagNames)) {
			const testTags = getJSDocCommentRanges(this.sourceFileBuffer, node)?.map(
				this.commentRangeToTestBlockDocComment(node)
			);
			if (testTags) {
				this._testBlockDocComments = [
					...this.testBlockDocComments,
					...testTags,
				];
			}
		}
		return node.forEachChild((child) => this.findTestBlockDocComments(child));
	}
}
