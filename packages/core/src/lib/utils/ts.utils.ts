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
	JSDoc,
	JSDocTag,
	SourceFile,
	isVariableStatement,
	isTypeAliasDeclaration,
	isInterfaceDeclaration,
	isObjectLiteralExpression,
	isStringLiteral,
	isPropertyAssignment,
	isImportSpecifier,
	isLiteralTypeNode,
	isPropertySignature,
	isTypeLiteralNode,
	NodeArray,
	TypeElement,
	EnumMember,
	isBigIntLiteral,
} from 'typescript';
import { TestBlockName } from '../types';

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

export const hasJSDoc = (node: Node) =>
	Boolean('jsDoc' in node && node.jsDoc && Array.isArray(node.jsDoc));

export const getJSDocs = (node: Node): JSDoc[] | undefined => {
	if (hasJSDoc(node)) {
		return (node as unknown as { jsDoc: JSDoc[] }).jsDoc;
	}
	return undefined;
};

export const getJSDocContent = (tag: JSDocTag, tagSeparator: string) =>
	Array.isArray(tag.comment)
		? tag.comment
				.map((c) => c.text)
				.join('')
				?.split(tagSeparator)
		: (tag.comment as string)?.split(tagSeparator);

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

export const getTestBlockName = (expression: Expression): TestBlockName =>
	getNodeName(expression) as TestBlockName;

export const getTestBlockBaseName = (expression: CallExpression): TestBlockName | undefined => {
	if (isIdentifier(expression.expression)) {
		return expression.expression.escapedText as TestBlockName;
	}
	if (
		isPropertyAccessExpression(expression.expression) &&
		isIdentifier(expression.expression.expression)
	) {
		return expression.expression.expression.escapedText as TestBlockName;
	}
	if (
		isPropertyAccessExpression(expression.expression) &&
		isPropertyAccessExpression(expression.expression.expression) &&
		isIdentifier(expression.expression.expression.expression)
	) {
		return expression.expression.expression.expression.escapedText as TestBlockName;
	}
	if (
		isPropertyAccessExpression(expression.expression) &&
		isPropertyAccessExpression(expression.expression.expression) &&
		isPropertyAccessExpression(expression.expression.expression.expression) &&
		isIdentifier(expression.expression.expression.expression.expression)
	) {
		return expression.expression.expression.expression.expression.escapedText as TestBlockName;
	}
	if (
		isCallExpression(expression.expression) &&
		isPropertyAccessExpression(expression.expression.expression) &&
		isIdentifier(expression.expression.expression.expression)
	) {
		return expression.expression.expression.expression.escapedText as TestBlockName;
	}
	if (
		isCallExpression(expression.expression) &&
		isPropertyAccessExpression(expression.expression.expression) &&
		isPropertyAccessExpression(expression.expression.expression.expression) &&
		isIdentifier(expression.expression.expression.expression.expression)
	) {
		return expression.expression.expression.expression.expression.escapedText as TestBlockName;
	}
	return undefined;
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

export const getMemberNameFromDeclaration = (
	declaration: Declaration | undefined,
	name: string,
) => {
	if (!declaration) return '';
	if (isEnumDeclaration(declaration)) {
		const member = declaration.members.find((member) => {
			return isIdentifier(member.name) ? member.name.escapedText === name : false;
		});
		if (!member?.initializer) return '';
		return isIdentifier(member.initializer) ||
			isBigIntLiteral(member.initializer) ||
			isStringLiteral(member.initializer)
			? member.initializer.text
			: '';
	}
	if (isObjectLiteralExpression(declaration)) {
		const property = declaration.properties.find(
			(member) =>
				member &&
				isPropertyAssignment(member) &&
				isIdentifier(member.name) &&
				member.name.text === name,
		);
		return property && isPropertyAssignment(property) && isStringLiteral(property.initializer)
			? property.initializer.text
			: '';
	}
	return '';
};

export const lookupValueFromType = (type: Type, name?: string): string | undefined => {
	if (type.isStringLiteral()) {
		return type.value;
	}
	if (!name) return undefined;
	return getMemberNameFromDeclaration(type.getSymbol()?.valueDeclaration, name);
};

export const findMemberByName = (
	members: NodeArray<TypeElement | EnumMember>,
	memberName: string,
) => {
	const member = members.find((m) => m.name && isIdentifier(m.name) && m.name.text === memberName);
	return member &&
		isPropertySignature(member) &&
		member.type &&
		isLiteralTypeNode(member.type) &&
		isStringLiteral(member.type.literal)
		? member.type.literal.text
		: '';
};

export const lookupValuesFromStatementsInSourceFile = (
	sourceFile: SourceFile,
	typechecker: TypeChecker,
	name: string,
	members?: string[],
): string => {
	let resolvedName = '';
	sourceFile.statements.forEach((statement) => {
		if (isImportDeclaration(statement)) {
			statement.importClause?.forEachChild((importClauseImport) => {
				if (isNamedImports(importClauseImport)) {
					importClauseImport.forEachChild((imp) => {
						if (isImportSpecifier(imp)) {
							if (imp.name.text === name) {
								resolvedName =
									lookupValueFromType(
										typechecker.getTypeAtLocation(imp),
										members ? members[0] : undefined,
									) ?? '';
							}
						}
					});
				}
			});
		}
		if (isVariableStatement(statement)) {
			const declaration = statement.declarationList.declarations[0];
			if (isIdentifier(declaration.name) && declaration.name.escapedText === name) {
				if (
					members &&
					declaration.initializer &&
					isObjectLiteralExpression(declaration.initializer)
				) {
					const property = declaration.initializer.properties.find(
						(p) => p.name && isIdentifier(p.name) && p.name.escapedText === members[0],
					);
					if (property && isPropertyAssignment(property) && isStringLiteral(property.initializer)) {
						resolvedName = property.initializer.text;
					}
				} else if (declaration.initializer && isIdentifier(declaration.initializer)) {
					resolvedName = declaration.initializer.text;
				}
			}
		}
		if (isEnumDeclaration(statement) && members) {
			if (statement.name.escapedText === name) {
				resolvedName = findMemberByName(statement.members, members[0]);
			}
		}
		if (isTypeAliasDeclaration(statement)) {
			if (statement.name.escapedText === name) {
				if (isLiteralTypeNode(statement.type)) {
					if (isStringLiteral(statement.type.literal)) {
						resolvedName = statement.type.literal.text;
					}
				}
				if (isTypeLiteralNode(statement.type) && members) {
					resolvedName = findMemberByName(statement.type.members, members[0]);
				}
			}
		}
		if (isInterfaceDeclaration(statement) && members) {
			if (statement.name.escapedText === name) {
				resolvedName = findMemberByName(statement.members, members[0]);
			}
		}
	});
	return resolvedName;
};

export const lookupIdentifiers =
	(node: SourceFile, typeChecker: () => TypeChecker) =>
	(identifiers: string[]): string | undefined => {
		if (identifiers.length > 0) {
			const [name, ...members] = identifiers;
			if (!name) return undefined;
			return lookupValuesFromStatementsInSourceFile(
				node,
				typeChecker(),
				name,
				members && members.length ? members : undefined,
			);
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
		const path = resolve(config.extends);
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
