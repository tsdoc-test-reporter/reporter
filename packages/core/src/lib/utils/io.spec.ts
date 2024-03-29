import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';

import { writeToFile } from './io.utils';

vi.mock('node:fs');

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
