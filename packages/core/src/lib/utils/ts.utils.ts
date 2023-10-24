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
	Declaration,
	isImportDeclaration,
	isNamedImports,
	Type,
} from 'typescript';
import { unquoteString } from './string.utils';
import { DocMemberReference } from '@microsoft/tsdoc';

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

export const getMemberNameFromDeclaration = (
	declaration: Declaration | undefined,
	name: string,
) => {
	if (declaration && isEnumDeclaration(declaration)) {
		const member = declaration.members.find((member) => {
			return isIdentifier(member.name) ? member.name.escapedText === name : false;
		});
		if (!member?.initializer) return '';
		return unquoteString(member.initializer.getText());
	}
	return '';
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
		const name = title.name.escapedText as string;
		const declaration = type.getSymbol()?.valueDeclaration;
		return getMemberNameFromDeclaration(declaration, name);
	}
	return '';
};

export const findDeclarationsOfNamedImportedVariables = (
	node: Node,
	typechecker: TypeChecker,
): Type[] => {
	const types: Type[] = [];
	node.forEachChild((importDeclaration) => {
		if (isImportDeclaration(importDeclaration)) {
			importDeclaration.importClause?.forEachChild((namedImport) => {
				if (isNamedImports(namedImport)) {
					namedImport.forEachChild((imp) => {
						types.push(typechecker.getTypeAtLocation(imp));
					});
				}
			});
		}
	});
	return types;
};

export const lookupValueFromType = (type: Type, name?: string): string | undefined => {
	if (type.isStringLiteral()) {
		return type.value;
	}
	if (!name) return undefined;
	return getMemberNameFromDeclaration(type.getSymbol()?.valueDeclaration, name);
};

export const lookupValueFromSourceFile = (
	node: Node,
	name: string | undefined,
	typeChecker: () => TypeChecker,
): string | undefined => {
	const types = findDeclarationsOfNamedImportedVariables(node, typeChecker());
	return types.map((type) => lookupValueFromType(type, name)).find(Boolean);
};

export const lookupMemberReferences =
	(node: Node, typeChecker: () => TypeChecker) =>
	(memberReferences: readonly DocMemberReference[]): string | undefined => {
		if (memberReferences.length === 1) {
			const identifier = memberReferences[0].memberIdentifier?.identifier;
			if (!identifier) return undefined;
			return lookupValueFromSourceFile(node, undefined, typeChecker);
		}
		if (memberReferences.length === 2) {
			const identifier = memberReferences[0].memberIdentifier?.identifier;
			const name = memberReferences[1].memberIdentifier?.identifier;
			if (!identifier && !name) return undefined;
			return lookupValueFromSourceFile(node, name, typeChecker);
		}
		return undefined;
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
