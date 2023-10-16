import { vi, afterEach, test, expect } from 'vitest';
import * as fs from 'node:fs';
import { UITestResult } from '@tsdoc-test-reporter/core';

import {
	globalConfigFactory,
	testContextFactory,
	aggregatedResultFactory,
} from '../test-utils/factory';

import { TSDocTestReporter } from "./index";

const testContext = new Set([testContextFactory()]);

const reporterGlobalConfig = globalConfigFactory();

const aggregatedResult = aggregatedResultFactory();

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

vi.mock('node:fs');

afterEach(() => {
	vi.resetAllMocks();
});

test('create html report', () => {
	const reporter = new TSDocTestReporter(reporterGlobalConfig, {});
	reporter.onRunComplete(testContext, aggregatedResult);
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'tsdoc-test-reporter-report.html',
		expect.stringContaining('<!doctype html>'),
		'utf-8',
	);
});

test('create json report', () => {
	const reporter = new TSDocTestReporter(reporterGlobalConfig, {
		outputFileType: "json",
	});
	reporter.onRunComplete(testContext, aggregatedResult);
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'tsdoc-test-reporter-report.json',
		expect.stringContaining('{"results"'),
		'utf-8',
	);
});

test('create json report with custom file name', () => {
	const reporter = new TSDocTestReporter(reporterGlobalConfig, {
		outputFileName: "custom-file-name",
		outputFileType: "json",
	});
	reporter.onRunComplete(testContext, aggregatedResult);
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'custom-file-name.json',
		expect.stringContaining('{"results"'),
		'utf-8',
	);
});

test('create json report with output as ui results', () => {
	const reporter = new TSDocTestReporter(reporterGlobalConfig, {
		outputFileType: 'json',
		outputJsonAs: 'ui',
	});
	reporter.onRunComplete(testContext, aggregatedResultFactory({
		testResults: [{
			testFilePath: "reporter.spec.ts",
			testResults: [{
				title: "test name",
				status: "passed",
				numPassingAsserts: 1,
			}],
			numPassingTests: 1,
		}]
	}))
	const expected: { results: UITestResult[] } = {
		results: [
			{
				title: 'reporter.spec.ts',
				meta: {
					passed: 1,
					failed: 0,
					skipped: 0,
					todo: 0,
				},
				assertions: [
					{
						title: 'test name',
						status: 'pass',
						tags: [
							{
								type: 'test',
								name: '@remarks',
								text: 'unit',
							},
							{
								type: 'test',
								name: '@remarks',
								text: 'acceptance',
							},
						],
					},
				],
			},
		],
	};
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		"tsdoc-test-reporter-report.json",
		expect.stringContaining(JSON.stringify(expected)),
		'utf-8',
	);
});
