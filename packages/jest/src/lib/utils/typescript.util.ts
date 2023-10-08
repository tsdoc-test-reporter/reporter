import {
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
	}
	if("moduleResolution" in options) {
		delete options.moduleResolution;
	}
	return options;
};
