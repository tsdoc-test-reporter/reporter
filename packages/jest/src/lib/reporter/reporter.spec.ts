import { SourceFile } from 'typescript';

import { TsDocTestReporter } from '.';
import {
	globalConfigFactory,
	taggedAggregatedResultFactory,
	testContextFactory,
} from '../test-utils/factory';

const testContext = new Set([testContextFactory()]);

const reporterGlobalConfig = globalConfigFactory();

const aggregatedResult = taggedAggregatedResultFactory();

jest.mock('@tsdoc-test-reporter/core', () => {
	const actual = jest.requireActual('@tsdoc-test-reporter/core');
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

test.skip('creates html report output', () => {
	const reporter = new TsDocTestReporter(reporterGlobalConfig, {
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
