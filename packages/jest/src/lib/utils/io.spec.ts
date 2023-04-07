import * as fs from 'node:fs';

import { getCompilerOptions, writeToFile } from './io.util';
import { expectedTsConfig } from './io.expected';

jest.mock('node:fs');

beforeEach(jest.resetModules);

afterEach(jest.resetAllMocks);

test('writes html file to simple file name', () => {
	writeToFile({
		buffer: 'buffer',
		outputFileType: 'html',
		outputFileName: 'output',
	});
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'output.html',
		'buffer',
		'utf-8'
	);
});

test('writes json file to simple file name', () => {
	writeToFile({
		buffer: 'buffer',
		outputFileType: 'json',
		outputFileName: 'output',
	});
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'output.json',
		'buffer',
		'utf-8'
	);
});

test('writes to nested folder', () => {
	writeToFile({
		buffer: 'buffer',
		outputFileType: 'json',
		outputFileName: 'reports/nested/output',
	});
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'reports/nested/output.json',
		'buffer',
		'utf-8'
	);
	expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
	expect(fs.mkdirSync).toHaveBeenCalledWith('reports/nested', {
		recursive: true,
	});
});

test('gets default compiler options', () => {
	const compilerOptions = getCompilerOptions();
	expect(compilerOptions).toEqual({
		target: 99,
	});
});

test('gets compiler options from tsConfig.json but unable to parse config', () => {
	jest.spyOn(fs, 'existsSync').mockReturnValue(true);
	const consoleSpy = jest.spyOn(console, "log");
	const compilerOptions = getCompilerOptions();
	expect(compilerOptions).toEqual({
		target: 99,
	});
	expect(consoleSpy).toHaveBeenCalledTimes(1);
	expect(consoleSpy).toHaveBeenCalledWith("\nUnable to parse TSConfig File. Using default values");
});

test('gets compiler options from tsConfig.json', () => {
	jest.spyOn(fs, 'existsSync').mockReturnValue(true);
	jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(expectedTsConfig);
	const consoleSpy = jest.spyOn(console, "log");
	const compilerOptions = getCompilerOptions();
	expect(compilerOptions).toEqual(JSON.parse(expectedTsConfig).compilerOptions);
	expect(consoleSpy).toHaveBeenCalledTimes(0);
});