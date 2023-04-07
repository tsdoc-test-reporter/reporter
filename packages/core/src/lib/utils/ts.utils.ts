import {
	CallExpression,
	CommentRange,
	getLeadingCommentRanges,
	Identifier,
	Node,
	PropertyAccessExpression,
	SyntaxKind,
} from 'typescript';

enum CharCodes {
	Asterisk = 0x2a,
	Slash = 0x2f,
}

export const isJSDocComment = (buffer: string) => (comment: CommentRange) =>
	buffer.charCodeAt(comment.pos + 1) === CharCodes.Asterisk &&
	buffer.charCodeAt(comment.pos + 2) === CharCodes.Asterisk &&
	buffer.charCodeAt(comment.pos + 3) !== CharCodes.Slash;

export const getJSDocCommentRanges = (
	buffer: string,
	node: Node
): CommentRange[] | undefined => {
	return getLeadingCommentRanges(buffer, node.pos)?.filter(
		isJSDocComment(buffer)
	);
};

export const isCallExpression = (node: Node): node is CallExpression => {
	return node.kind === SyntaxKind.CallExpression;
};

export const isPropertyAccessExpression = (
	node: Node
): node is PropertyAccessExpression => {
	return node.kind === SyntaxKind.PropertyAccessExpression;
};

export const isIdentifier = (node: Node): node is Identifier => {
	return node.kind === SyntaxKind.Identifier;
};

// TODO: Recurse this bad boy or whatever
export const getNodeName = (node: Node): string => {
	if (isCallExpression(node)) {
		if (isPropertyAccessExpression(node.expression)) {
			if (isPropertyAccessExpression(node.expression.expression)) {
				if (
					isIdentifier(node.expression.expression.expression) &&
					isIdentifier(node.expression.expression.name)
				) {
					return `${node.expression.expression.expression.escapedText}.${node.expression.expression.name.escapedText}.${node.expression.name.escapedText}`;
				}
			}
			if (
				isIdentifier(node.expression.expression) &&
				isIdentifier(node.expression.name)
			) {
				return `${node.expression.expression.escapedText}.${node.expression.name.escapedText}`;
			}
		}
		if (isIdentifier(node.expression)) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return node.expression.escapedText;
		}
	}
	return '';
};

export const isTestBlock = (
	node: Node,
	testBlockNames: string[]
): node is CallExpression => {
	return isCallExpression(node) && testBlockNames.includes(getNodeName(node));
};
