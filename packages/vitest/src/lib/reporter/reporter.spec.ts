import { vi, afterEach, test, expect } from 'vitest';
import * as fs from 'node:fs';

import { TSDocTestReporter } from './index';
import { fileFactory } from '../../test-utils';
import { UITestResult } from '@tsdoc-test-reporter/core';

vi.mock('node:fs');

afterEach(() => {
	vi.resetAllMocks();
});

vi.mock('@tsdoc-test-reporter/core', async () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const actual = await vi.importActual<any>('@tsdoc-test-reporter/core');
	const sourceFile = actual.testFileFactory({
		fileName: 'reporter.spec.ts',
		options: [
			{
				testBlockName: 'test',
				testTitle: 'test name',
				tags: [
					{
						tagName: '@remarks',
						tagContent: 'unit,acceptance',
					},
				],
			},
		],
	});
	return {
		...actual,
		getSourceFilesMap: () => ({
			[sourceFile.fileName]: sourceFile,
		}),
	};
});

test('create html report', () => {
	const reporter = new TSDocTestReporter();
	reporter.onFinished([fileFactory({})]);
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'tsdoc-test-reporter-report.html',
		expect.stringContaining('<!doctype html>'),
		'utf-8',
	);
});

test('create json report', () => {
	const reporter = new TSDocTestReporter({
		outputFileType: 'json',
	});
	reporter.onFinished([fileFactory({})]);
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'tsdoc-test-reporter-report.json',
		expect.stringContaining('{"results"'),
		'utf-8',
	);
});

test('create json report with custom file name', () => {
	const reporter = new TSDocTestReporter({
		outputFileType: 'json',
		outputFileName: 'custom-file-name',
	});
	reporter.onFinished([fileFactory({})]);
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'custom-file-name.json',
		expect.stringContaining('{"results"'),
		'utf-8',
	);
});

test('create json report with output as ui results', () => {
	const reporter = new TSDocTestReporter({
		outputFileType: 'json',
		outputFileName: 'custom-file-name',
		outputJsonAs: 'ui',
	});
	reporter.onFinished([
		fileFactory({
			filepath: 'reporter.spec.ts',
			name: 'reporter.spec.ts',
			tasks: [
				{
					type: 'test',
					name: 'test name',
					result: {
						state: 'pass',
					},
				},
			],
		}),
	]);
	const expected: { results: UITestResult[] } = {
		results: [
			{
				title: 'reporter.spec.ts',
				filePath: 'reporter.spec.ts',
				meta: {
					failed: 0,
					passed: 1,
					skipped: 0,
					todo: 0,
				},
				assertions: [
					{
						title: 'test name',
						ancestorTitles: [],
						tags: [
							{
								type: 'test',
								name: '@remarks',
								text: '@remarks: unit',
							},
							{
								type: 'test',
								name: '@remarks',
								text: '@remarks: acceptance',
							},
						],
						status: 'pass',
					},
				],
			},
		],
	};
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'custom-file-name.json',
		expect.stringContaining(JSON.stringify(expected)),
		'utf-8',
	);
});
