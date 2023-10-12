import { test, expect, vi, afterEach } from 'vitest';
import * as fs from 'node:fs';
import { SourceFile } from 'typescript';

import { TsDocTestReporter } from '.';
import {
	testContextFactory,
	globalConfigFactory,
	taggedAggregatedResultFactory,
} from '../test-utils/factory';

vi.mock('node:fs');

afterEach(() => {
	vi.resetAllMocks();
});

const testContext = new Set([testContextFactory()]);

const reporterGlobalConfig = globalConfigFactory();

const aggregatedResult = taggedAggregatedResultFactory();

vi.mock('@tsdoc-test-reporter/core', async () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const actual = await vi.importActual<any>('@tsdoc-test-reporter/core');
	const sourceFile = actual.testFileFactory({
		fileName: 'reporter.ts',
		options: [],
	});
	const files: Record<string, SourceFile> = {
		[sourceFile.fileName]: sourceFile,
	};
	return {
		...actual,
		getSourceFileHelper: () => (fileName: string) => {
			return files[fileName];
		},
	};
});

test('creates html report output', () => {
	const reporter = new TsDocTestReporter(reporterGlobalConfig, {
		outputFileType: 'html',
		outputFileName: 'output',
	});
	reporter.onRunComplete(testContext, aggregatedResult);
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toBeCalledWith('output.html', expect.anything(), 'utf-8');
});
