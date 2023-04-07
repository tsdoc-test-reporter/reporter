import { SourceFile } from 'typescript';
import * as fs from 'node:fs';

import { reporterGlobalConfig } from './test-data/reporter.global-config';
import { reporterTestContext } from './test-data/reporter.test-context';
import { reporterBasicAggregatedResult } from './test-data/reporter.test-results';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as typescriptHelpers from '../utils/typescript.util';

import { TsDocTaggedTestReporter } from '.';

jest.mock('node:fs');

afterEach(jest.resetAllMocks);

const testContext = new Set([reporterTestContext]);

jest.mock('../utils/typescript.util', () => {
	const { reporterBasicSourceFile, reporterBasicSourceFileName } =
		jest.requireActual('./test-data/reporter.source-file');
	const files: Record<string, SourceFile> = {
		[reporterBasicSourceFileName]: reporterBasicSourceFile,
	};
	return {
		getSourceFileHelper: () => (fileName: string) => {
			return files[fileName];
		},
	};
});

test('creates html report output', () => {
	const reporter = new TsDocTaggedTestReporter(reporterGlobalConfig, {
		outputFileType: 'html',
		outputFileName: 'output',
		groupBySchema: {
			tagName: '@remarks',
		},
	});
	reporter.onRunComplete(testContext, reporterBasicAggregatedResult);
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toBeCalledWith(
		'output.html',
		expect.anything(),
		'utf-8'
	);
});
