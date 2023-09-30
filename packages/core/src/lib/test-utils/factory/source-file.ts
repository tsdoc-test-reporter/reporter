import { createSourceFile, ScriptTarget, SourceFile } from 'typescript';

/**
 * @internal
 * @hidden
 */
export const sourceFileFactory =
	(fileName: string): ((content: TemplateStringsArray) => SourceFile) =>
	(content: TemplateStringsArray): SourceFile => {
		const buffer = content.join('');
		const sourceFile: SourceFile = createSourceFile(
			fileName,
			buffer,
			ScriptTarget.Latest
		);
		return sourceFile;
	};
