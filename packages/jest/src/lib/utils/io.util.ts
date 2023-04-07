import { CompilerOptions, ScriptTarget } from 'typescript';

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { posix, resolve, sep } from 'node:path';

export type WriteToFileConfig = {
	buffer: string;
	outputFileName: string;
	outputFileType: 'json' | 'html';
};

export const writeToFile = ({
	buffer,
	outputFileType,
	outputFileName,
}: WriteToFileConfig): void => {
	const pathElements = outputFileName.split(posix.sep);
	const fileName = pathElements.slice(-1);
	try {
		if (pathElements.length > 1) {
			const filePath = pathElements.slice(0, -1);
			const recursive = filePath.length > 1;
			const pathExists = existsSync(filePath.join(sep));
			if (!pathExists) {
				mkdirSync(filePath.join(sep), { recursive });
			}
			writeFileSync(
				`${pathElements
					.slice(0, -1)
					.join(sep)}${sep}${fileName}.${outputFileType}`,
				buffer,
				'utf-8'
			);
		} else {
			writeFileSync(`${fileName}.${outputFileType}`, buffer, 'utf-8');
		}
	} catch (error: unknown) {
		console.error(error);
	}
};

export const getCompilerOptions = (customPath?: string): CompilerOptions => {
	const defaultOptions: CompilerOptions = {
		target: ScriptTarget.Latest,
	};
	const tsConfigPath = resolve(process.cwd(), customPath ?? 'tsconfig.json');
	if (!existsSync(tsConfigPath)) {
		return defaultOptions;
	}
	try {
		const tsConfig = JSON.parse(readFileSync(tsConfigPath, 'utf-8'));
		return tsConfig.compilerOptions;
	} catch (error) {
		console.log('\nUnable to parse TSConfig File. Using default values');
		return defaultOptions;
	}
};
