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
	sys,
	Expression,
	TypeChecker,
	isEnumDeclaration,
	Program,
} from 'typescript';
import { unquoteString } from './string.utils';

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

export const getNodeName = (expression: Expression, prefix = ''): string => {
	if (isIdentifier(expression)) {
		return prefix + expression.escapedText;
	}
	if (isPropertyAccessExpression(expression)) {
		return getNodeName(expression.name, getNodeName(expression.expression, prefix) + '.');
	}
	return '';
};

export const isTestBlock = (node: Node, testBlockNames: string[]): node is CallExpression => {
	return isCallExpression(node) && testBlockNames.includes(getNodeName(node.expression));
};

export const getTestTitleFromExpression = (title: Expression, typeChecker: TypeChecker): string => {
	if (isIdentifier(title)) {
		const type = typeChecker.getTypeAtLocation(title);
		if (type.isStringLiteral()) {
			return type.value;
		}
	}
	if (isPropertyAccessExpression(title)) {
		const type = typeChecker.getTypeAtLocation(title.expression);
		const name = title.name.escapedText;
		const declaration = type.getSymbol()?.valueDeclaration;
		if (declaration && isEnumDeclaration(declaration)) {
			const member = declaration.members.find((member) => {
				return isIdentifier(member.name) ? member.name.escapedText === name : false;
			});
			if (!member?.initializer) return '';
			return unquoteString(member.initializer.getText());
		}
	}
	return '';
};

export const programFactory = <TestResult extends object, Key extends keyof TestResult>(
	results: TestResult[],
	filepath: Key,
	compilerOptions: CompilerOptions,
) => {
	const fileNames = results.map((result) => result[filepath] as string);
	return createProgram(fileNames, compilerOptions);
};

export const getSourceFilesMap = <TestResult extends object, Key extends keyof TestResult>(
	results: TestResult[],
	filepath: Key,
	program: Program,
) => {
	return Object.fromEntries(
		results.map((result) => [result[filepath], program.getSourceFile(result[filepath] as string)]),
	);
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
