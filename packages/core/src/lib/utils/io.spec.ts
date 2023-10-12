import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';

import { writeToFile } from './io.utils';
import { getCompilerOptions } from './ts.utils';

vi.mock('node:fs');

vi.mock('@tsdoc-test-reporter/core', async () => {
	return {
		...vi.importActual('@tsdoc-test-reporter/core'),
		getCompilerOptionsThatFollowExtends: () => ({
			declaration: false,
			target: 'es2015',
			module: 'esnext',
			baseUrl: './src',
		}),
	};
});

beforeEach(() => {
	vi.resetAllMocks();
});

afterEach(() => {
	vi.resetAllMocks();
});

test('writes html file to simple file name', () => {
	writeToFile({
		buffer: 'buffer',
		outputFileType: 'html',
		outputFileName: 'output',
	});
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith('output.html', 'buffer', 'utf-8');
});

test('writes json file to simple file name', () => {
	writeToFile({
		buffer: 'buffer',
		outputFileType: 'json',
		outputFileName: 'output',
	});
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith('output.json', 'buffer', 'utf-8');
});

test('writes to nested folder', () => {
	writeToFile({
		buffer: 'buffer',
		outputFileType: 'json',
		outputFileName: 'reports/nested/output',
	});
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith('reports/nested/output.json', 'buffer', 'utf-8');
	expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
	expect(fs.mkdirSync).toHaveBeenCalledWith('reports/nested', {
		recursive: true,
	});
});

test('gets default compiler options', () => {
	vi.spyOn(fs, 'existsSync').mockReturnValue(false);
	const compilerOptions = getCompilerOptions();
	expect(compilerOptions).toEqual({
		target: 99,
	});
});

test.skip('gets compiler options from tsConfig.json', () => {
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
