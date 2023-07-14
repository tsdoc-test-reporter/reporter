import {
	CompilerOptions,
	createProgram,
	ScriptTarget,
	SourceFile,
} from 'typescript';

const defaultCompilerOptions: CompilerOptions = {
	target: ScriptTarget.Latest,
};

export const getSourceFileHelper = (
	fileNames: string[],
	compilerOptions: CompilerOptions = defaultCompilerOptions
) => {
	const program = createProgram(fileNames, compilerOptions);
	return (fileName: string): SourceFile | undefined =>
		program.getSourceFile(fileName);
};
