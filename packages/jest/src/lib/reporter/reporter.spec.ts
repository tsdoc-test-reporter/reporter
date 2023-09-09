import { SourceFile } from 'typescript';

import { reporterGlobalConfig } from './test-data/reporter.global-config';
import { reporterTestContext } from './test-data/reporter.test-context';
import { reporterHTMLAggregatedResult } from './test-data/reporter-html.test-results';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as typescriptHelpers from '../utils/typescript.util';

import { TsDocTaggedTestReporter } from '.';

const testContext = new Set([reporterTestContext]);

jest.mock('../utils/typescript.util', () => {
	const { reporterHTMLSourceFile, reporterHTMLSourceFileName } =
		jest.requireActual('./test-data/reporter-html.source-file');
	const files: Record<string, SourceFile> = {
		[reporterHTMLSourceFileName]: reporterHTMLSourceFile,
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
	reporter.onRunComplete(testContext, reporterHTMLAggregatedResult);
});
