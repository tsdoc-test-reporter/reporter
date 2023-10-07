import { CompilerOptions } from 'typescript';

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { posix, resolve, sep } from 'node:path';
import { defaultCompilerOptions, getCompilerOptionsThatFollowExtends } from './typescript.util';

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
				`${pathElements.slice(0, -1).join(sep)}${sep}${fileName}.${outputFileType}`,
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
