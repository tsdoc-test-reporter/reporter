import { SourceFile } from 'typescript';
import * as fs from 'node:fs';

import { TsDocTaggedTestReporter } from '.';
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

test('creates html report output', () => {
	const reporter = new TsDocTaggedTestReporter(reporterGlobalConfig, {
		outputFileType: 'html',
		outputFileName: 'output',
	});
	reporter.onRunComplete(testContext, aggregatedResult);
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toBeCalledWith('output.html', expect.anything(), 'utf-8');
});
