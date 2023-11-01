import {
	DocNode,
	DocPlainText,
	DocNodeKind,
	DocParagraph,
	DocComment,
	DocBlock,
	ITSDocTagDefinitionParameters,
	TSDocConfiguration,
	TSDocTagDefinition,
	DocLinkTag,
} from '@microsoft/tsdoc';

import type { BlockTagName, ModifierTagName, TagType, TestBlockName } from '../types';
import { trim } from './string.utils';
import { allModifierTags, ancestorTagNames } from '../defaults';

export type DocCommentSection = Pick<
	DocComment,
	'remarksBlock' | 'privateRemarks' | 'deprecatedBlock' | 'seeBlocks'
>;

export const tagNameToTSDocBlock: Record<
	Extract<BlockTagName, '@privateRemarks' | '@remarks' | '@deprecated' | '@see'>,
	keyof DocCommentSection
> = {
	'@privateRemarks': 'privateRemarks',
	'@remarks': 'remarksBlock',
	'@deprecated': 'deprecatedBlock',
	'@see': 'seeBlocks',
};

export const getModifierTagType = (tagName: ModifierTagName): TagType => {
	return allModifierTags.includes(tagName) ? 'standard' : 'custom';
};

export const getBlockTagType = (tagName: BlockTagName): TagType => {
	return tagName in tagNameToTSDocBlock ? 'standard' : 'custom';
};

export const getTestType = (testBlockName: TestBlockName) => {
	return ancestorTagNames.includes(testBlockName) ? 'ancestor' : 'test';
};

export const isPlainText = (docNode: DocNode): docNode is DocPlainText => {
	return docNode.kind === DocNodeKind.PlainText;
};

export const isDocParagraph = (docNode: DocNode): docNode is DocParagraph => {
	return docNode.kind === DocNodeKind.Paragraph;
};

export const isDocLinkTag = (docNode: DocNode): docNode is DocLinkTag => {
	return docNode.kind === DocNodeKind.LinkTag;
};

export const isArrayOfDocBlocks = (
	docBlock: DocBlock | readonly DocBlock[],
): docBlock is readonly DocBlock[] => {
	return Array.isArray(docBlock);
};

export const getPlainTextContentFromNodes = (docNode: DocBlock, tagSeparator: string): string[] => {
	return (
		docNode.content.nodes
			.find(isDocParagraph)
			?.nodes.find(isPlainText)
			?.text.split(tagSeparator)
			.map(trim)
			.filter(Boolean) ?? []
	);
};

export const getIdentifiersFromLinkTags = (docNode: DocBlock): string[] => {
	const memberReferences = docNode.content.nodes.find(isDocParagraph)?.nodes.find(isDocLinkTag)
		?.codeDestination?.memberReferences;
	return (
		(memberReferences?.map((m) => m.memberIdentifier?.identifier).filter(Boolean) as string[]) ?? []
	);
};

export const docBlockToDocBlockTags = (
	docBlock: DocBlock | readonly DocBlock[],
	tagSeparator: string,
	lookupIdentifiers: (identifiers: string[]) => string | undefined,
): string[] => {
	const blocks = isArrayOfDocBlocks(docBlock) ? docBlock : [docBlock];
	return blocks.flatMap((block) => {
		const identifiers = getIdentifiersFromLinkTags(block);
		const referenceName = identifiers.length > 0 ? lookupIdentifiers(identifiers) : undefined;
		return referenceName ? referenceName : getPlainTextContentFromNodes(block, tagSeparator);
	});
};

export const getTsDocParserConfig = (
	customTags?: ITSDocTagDefinitionParameters[],
): TSDocConfiguration | undefined => {
	if (!customTags?.length) {
		return undefined;
	}
	const config = new TSDocConfiguration();
	for (const tag of customTags) {
		const definition = new TSDocTagDefinition({
			tagName: tag.tagName,
			syntaxKind: tag.syntaxKind,
			allowMultiple: tag.allowMultiple,
		});
		config.addTagDefinition(definition);
	}
	return config;
};
