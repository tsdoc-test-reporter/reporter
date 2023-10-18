import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';

import { getCompilerOptions } from './ts.utils';

vi.mock('node:fs');

vi.mock('typescript', async () => {
	const actual = await vi.importActual<object>('typescript');
	return {
		...actual,
		readConfigFile: () => ({
			config: {
				compilerOptions: {
					declaration: false,
					target: 'es2015',
					module: 'esnext',
					baseUrl: './src',
				},
			},
		}),
	};
});

beforeEach(() => {
	vi.resetAllMocks();
});

afterEach(() => {
	vi.resetAllMocks();
});

test('gets default compiler options', () => {
	vi.spyOn(fs, 'existsSync').mockReturnValue(false);
	const compilerOptions = getCompilerOptions();
	expect(compilerOptions).toEqual({
		target: 99,
	});
});

test('gets compiler options from tsConfig.json', () => {
	vi.spyOn(fs, 'existsSync').mockReturnValue(true);
	const consoleSpy = vi.spyOn(console, 'log');
	const compilerOptions = getCompilerOptions();
	expect(compilerOptions).toEqual({
		declaration: false,
		target: 'es2015',
		module: 'esnext',
		baseUrl: './src',
	});
	expect(consoleSpy).toHaveBeenCalledTimes(0);
});
