import {
	DocComment,
	TextRange,
	TSDocParser,
} from '@microsoft/tsdoc';
import type {
	Node,
	SourceFile,
	CommentRange,
	CallExpression,
} from 'typescript';

import { allModifierTags, coreDefaults } from '../defaults';
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
import { BlockTagName } from '../types';

export class CommentTagParser<CustomTag extends string>
	implements ICommentTagParser<CustomTag>
{
	private sourceFile: SourceFile;
	private sourceFileBuffer: string;
	private tsDocParser: TSDocParser;
	private testBlockTagNames: string[];
	private tagSeparator: string;
	private applyTags: (AllTagsName | CustomTag)[];
	private _testBlockDocComments: TestBlockDocComment<CustomTag>[] = [];

	constructor({
		sourceFile,
		tsDocParser,
		applyTags = coreDefaults.applyTags as (AllTagsName | CustomTag)[],
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

	private getBlockTags(
		docComment: DocComment,
		testBlockType: TestBlockName,
		testTitle: string
	): TestBlockDocComment<CustomTag>['testBlockTags'] {
		const tags: TestBlockDocComment<CustomTag>['testBlockTags'] = {};
		for (const tagName of this.applyTags) {
			const kind: TagKind = docComment.modifierTagSet.hasTagName(tagName) ? "modifier" : "block";
			if (kind === "modifier") {
				const modifierTag = docComment.modifierTagSet.nodes.find(node => node.tagName === tagName);
				if (modifierTag) {
					tags[tagName] = {
						type: allModifierTags.includes(tagName as ModifierTagName) ? "standard" : "custom",
						kind,
						name: tagName,
						testBlockType,
						testTitle,
					}
				}
			} else {
				const type: TagType = tagName in tagNameToTSDocBlock ? "standard" : "custom";
				const docBlock = type === "standard"
					? docComment[tagNameToTSDocBlock[tagName as BlockTagName]]
					: docComment.customBlocks.find(block => block.blockTag.tagName === tagName);
				if (docBlock) {
					tags[tagName] = {
						type,
						tags: docBlockToDocBlockTags(
							docBlock,
							this.tagSeparator
						),
						kind,
						name: tagName,
						testBlockType,
						testTitle,
					};
				}
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
				testBlockTags: this.getBlockTags(
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
