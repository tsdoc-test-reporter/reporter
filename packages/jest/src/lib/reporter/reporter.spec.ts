import { SourceFile } from 'typescript';

import { TsDocTaggedTestReporter } from '.';
import {
	globalConfigFactory,
	taggedAggregatedResultFactory,
	testContextFactory,
} from '../test-utils/factory';

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

test.skip('creates html report output', () => {
	const reporter = new TsDocTaggedTestReporter(reporterGlobalConfig, {
		outputFileType: 'html',
		outputFileName: 'output',
		uiOptions: {
			hideAncestorTitles: true,
			hideAncestorTags: false,
			showTagNameOnBlockTags: false,
			removeAtSignOnTags: true,
		},
	});
	reporter.onRunComplete(testContext, aggregatedResult);
});
