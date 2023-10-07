import {
	DocNode,
	DocPlainText,
	DocNodeKind,
	DocParagraph,
	DocComment,
	DocBlock,
} from '@microsoft/tsdoc';

import type { BlockTagName } from '../types';
import { trim } from './format.utils';

type DocCommentSections = Pick<DocComment, 'remarksBlock' | 'privateRemarks' | 'deprecatedBlock'>;

export const tagNameToTSDocBlock: Record<BlockTagName, keyof DocCommentSections> = {
	'@privateRemarks': 'privateRemarks',
	'@remarks': 'remarksBlock',
	'@deprecated': 'deprecatedBlock',
};

export const isPlainText = (docNode: DocNode): docNode is DocPlainText => {
	return docNode.kind === DocNodeKind.PlainText;
};

export const isDocParagraph = (docNode: DocNode): docNode is DocParagraph => {
	return docNode.kind === DocNodeKind.Paragraph;
};

export const docBlockToDocBlockTags = (docBlock: DocBlock, tagSeparator: string): string[] => {
	return (
		docBlock.content.nodes
			.find(isDocParagraph)
			?.nodes.find(isPlainText)
			?.text.split(tagSeparator)
			.map(trim) ?? []
	);
};
