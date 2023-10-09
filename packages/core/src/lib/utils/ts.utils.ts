import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
	CallExpression,
	CommentRange,
	getLeadingCommentRanges,
	isCallExpression,
	isIdentifier,
	isPropertyAccessExpression,
	Node,
	CompilerOptions,
	createProgram,
	readConfigFile,
	ScriptTarget,
	SourceFile,
	sys,
} from 'typescript';

export const defaultCompilerOptions: CompilerOptions = {
	target: ScriptTarget.Latest,
};

enum CharCodes {
	Asterisk = 0x2a,
	Slash = 0x2f,
}

export const isJSDocComment = (buffer: string) => (comment: CommentRange) =>
	buffer.charCodeAt(comment.pos + 1) === CharCodes.Asterisk &&
	buffer.charCodeAt(comment.pos + 2) === CharCodes.Asterisk &&
	buffer.charCodeAt(comment.pos + 3) !== CharCodes.Slash;

export const getJSDocCommentRanges = (buffer: string, node: Node): CommentRange[] | undefined => {
	return getLeadingCommentRanges(buffer, node.pos)?.filter(isJSDocComment(buffer));
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
			if (isIdentifier(node.expression.expression) && isIdentifier(node.expression.name)) {
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

export const isTestBlock = (node: Node, testBlockNames: string[]): node is CallExpression => {
	return isCallExpression(node) && testBlockNames.includes(getNodeName(node));
};

export const getSourceFileHelper = (
	fileNames: string[],
	compilerOptions: CompilerOptions = defaultCompilerOptions,
) => {
	const program = createProgram(fileNames, compilerOptions);
	return (fileName: string): SourceFile | undefined => program.getSourceFile(fileName);
};

export const getCompilerOptionsThatFollowExtends = (filename: string): CompilerOptions => {
	let compositeOptions = {};
	const config = readConfigFile(filename, sys.readFile).config;
	if (config.extends) {
		const path = require.resolve(config.extends);
		compositeOptions = getCompilerOptionsThatFollowExtends(path);
	}
	const options = {
		...compositeOptions,
		...config.compilerOptions,
	};
	if ('moduleResolution' in options) {
		delete options.moduleResolution;
	}
	return options;
};

export const getCompilerOptions = (customPath?: string): CompilerOptions => {
	const tsConfigPath = resolve(process.cwd(), customPath ?? 'tsconfig.json');
	if (!existsSync(tsConfigPath)) {
		return defaultCompilerOptions;
	}
	try {
		return getCompilerOptionsThatFollowExtends(tsConfigPath);
	} catch (error) {
		console.warn('\nUnable to parse TSConfig File. Using default values');
		return defaultCompilerOptions;
	}
};
