import * as fs from 'node:fs';

import { writeToFile } from './io.utils';
import { getCompilerOptions } from './ts.utils';

jest.mock('node:fs');

jest.mock('@tsdoc-test-reporter/core', () => {
	return {
		...jest.requireActual('@tsdoc-test-reporter/core'),
		getCompilerOptionsThatFollowExtends: () => ({
			declaration: false,
			target: 'es2015',
			module: 'esnext',
			baseUrl: './src',
		}),
	};
});

beforeEach(jest.resetModules);

afterEach(jest.resetAllMocks);

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
	jest.spyOn(fs, 'existsSync').mockReturnValue(false);
	const compilerOptions = getCompilerOptions();
	expect(compilerOptions).toEqual({
		target: 99,
	});
});

test.skip('gets compiler options from tsConfig.json', () => {
	jest.spyOn(fs, 'existsSync').mockReturnValue(true);
	const consoleSpy = jest.spyOn(console, 'log');
	const compilerOptions = getCompilerOptions();
	expect(compilerOptions).toEqual({
		declaration: false,
		target: 'es2015',
		module: 'esnext',
		baseUrl: './src',
	});
	expect(consoleSpy).toHaveBeenCalledTimes(0);
});
