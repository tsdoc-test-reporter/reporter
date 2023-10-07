import * as fs from 'node:fs';
import type { SourceFile } from 'typescript';

import { TsDocTestReporter } from './index';
import {
	testContextFactory,
	globalConfigFactory,
	taggedAggregatedResultFactory,
} from '../test-utils/factory';

jest.mock('node:fs');

afterEach(jest.resetAllMocks);

const testContext = new Set([testContextFactory()]);

const reporterGlobalConfig = globalConfigFactory();

const aggregatedResult = taggedAggregatedResultFactory();

jest.mock('../utils/typescript.util', () => {
	const { testFileFactory } = jest.requireActual('@tsdoc-test-reporter/core');
	const sourceFile = testFileFactory({
		fileName: 'reporter.ts',
		options: [],
	});
	const files: Record<string, SourceFile> = {
		[sourceFile.fileName]: sourceFile,
	};
	return {
		getSourceFileHelper: () => (fileName: string) => {
			return files[fileName];
		},
	};
});

test('creates json report output', () => {
	const reporter = new TsDocTestReporter(reporterGlobalConfig, {
		outputFileType: 'json',
		outputFileName: 'output',
	});
	reporter.onRunComplete(testContext, aggregatedResult);
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith('output.json', expect.anything(), 'utf-8');
});

test('creates non recursive folder and json report output', () => {
	const reporter = new TsDocTestReporter(reporterGlobalConfig, {
		outputFileType: 'json',
		outputFileName: 'reports/output',
	});
	reporter.onRunComplete(testContext, aggregatedResult);
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith('reports/output.json', expect.anything(), 'utf-8');
	expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
	expect(fs.mkdirSync).toHaveBeenCalledWith('reports', { recursive: false });
});

test('creates recursive folder and json report output', () => {
	const reporter = new TsDocTestReporter(reporterGlobalConfig, {
		outputFileType: 'json',
		outputFileName: 'reports/nested/output',
	});
	reporter.onRunComplete(testContext, aggregatedResult);
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
