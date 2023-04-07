import {
	DocNode,
	DocPlainText,
	DocNodeKind,
	DocParagraph,
	DocComment,
	DocBlock,
} from '@microsoft/tsdoc';

import { BlockTagNames } from '../types';

type DocCommentSections = Pick<DocComment, 'remarksBlock' | 'privateRemarks'>;

export const tagNameToTSDocBlock: Record<
	BlockTagNames,
	keyof DocCommentSections
> = {
	'@privateRemarks': 'privateRemarks',
	'@remarks': 'remarksBlock',
};

export const isPlainText = (docNode: DocNode): docNode is DocPlainText => {
	return docNode.kind === DocNodeKind.PlainText;
};

export const isDocParagraph = (docNode: DocNode): docNode is DocParagraph => {
	return docNode.kind === DocNodeKind.Paragraph;
};

export const docBlockToDocBlockTags = (
	docBlock: DocBlock,
	tagSeparator: string
): string[] => {
	return (
		docBlock.content.nodes
			.find(isDocParagraph)
			?.nodes.find(isPlainText)
			?.text.split(tagSeparator)
			.map((s) => s.trim()) ?? []
	);
};
