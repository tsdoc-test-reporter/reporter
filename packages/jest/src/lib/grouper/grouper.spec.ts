import { TSDocParser } from '@microsoft/tsdoc';

import {
	grouperBasicSourceFile,
	grouperBasicSourceFileName,
} from './test-data/grouper-basic.source-file';
import { grouperBasicAggregatedResult } from './test-data/grouper-basic.test-results';

import { parseTestFiles } from '../test-file-parser';

import { groupTests } from './index';

test('basic', () => {
	const tsDocParser = new TSDocParser();
	const taggedTestResults = parseTestFiles({
		testResults: grouperBasicAggregatedResult.testResults,
		tsDocParser,
		sourceFilesMap: {
			[grouperBasicSourceFileName]: grouperBasicSourceFile,
		},
	});
	const groupedTests = groupTests({
		testResult: {
			...grouperBasicAggregatedResult,
			testResults: taggedTestResults,
		},
		schema: {
			tagName: '@remarks',
		},
	});
	expect(groupedTests.size).toEqual(3);
	expect(Array.from(groupedTests.keys())).toEqual([
		'feature/XXXX',
		'grouper-basic.source-file.ts',
		'unit tests',
	]);
});
