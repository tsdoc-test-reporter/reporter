import { createSourceFile, ScriptTarget, SourceFile } from 'typescript';

/**
 * @internal
 * @hidden
 * Factory for generating a {@link SourceFile} to be used in tests
 * @example
 * const file = sourceFileFactory("fileName.ts")`
 * let var = 1;
 * `
 */
export const sourceFileFactory =
	(fileName: string): ((content: string) => SourceFile) =>
	(content: string): SourceFile => {
		const sourceFile: SourceFile = createSourceFile(fileName, content, ScriptTarget.Latest);
		return sourceFile;
	};
