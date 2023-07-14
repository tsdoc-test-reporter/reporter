import * as fs from 'node:fs';

import { reporterGlobalConfig } from './test-data/reporter.global-config';
import { reporterTestContext } from './test-data/reporter.test-context';
import { reporterBasicAggregatedResult } from './test-data/reporter.test-results';
import { reporterExpectedJson } from './test-data/reporter.expected';

import { TsDocTaggedTestReporter } from '.';

jest.mock('node:fs');

afterEach(jest.resetAllMocks);

const testContext = new Set([reporterTestContext]);

test('creates json report output', () => {
	const reporter = new TsDocTaggedTestReporter(reporterGlobalConfig, {
		outputFileType: 'json',
		outputFileName: 'output',
	});
	reporter.onRunComplete(testContext, reporterBasicAggregatedResult);
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'output.json',
		expect.anything(),
		'utf-8'
	);
});

test('creates json report output from grouped result', () => {
	const reporter = new TsDocTaggedTestReporter(reporterGlobalConfig, {
		outputFileType: 'json',
		outputFileName: 'output',
		groupBySchema: {
			tagName: '@remarks',
		},
	});
	reporter.onRunComplete(testContext, reporterBasicAggregatedResult);
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'output.json',
		reporterExpectedJson,
		'utf-8'
	);
});

test('creates non recursive folder and json report output', () => {
	const reporter = new TsDocTaggedTestReporter(reporterGlobalConfig, {
		outputFileType: 'json',
		outputFileName: 'reports/output',
	});
	reporter.onRunComplete(testContext, reporterBasicAggregatedResult);
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'reports/output.json',
		expect.anything(),
		'utf-8'
	);
	expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
	expect(fs.mkdirSync).toHaveBeenCalledWith('reports', { recursive: false });
});

test('creates recursive folder and json report output', () => {
	const reporter = new TsDocTaggedTestReporter(reporterGlobalConfig, {
		outputFileType: 'json',
		outputFileName: 'reports/nested/output',
	});
	reporter.onRunComplete(testContext, reporterBasicAggregatedResult);
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'reports/nested/output.json',
		expect.anything(),
		'utf-8'
	);
	expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
	expect(fs.mkdirSync).toHaveBeenCalledWith('reports/nested', {
		recursive: true,
	});
});
