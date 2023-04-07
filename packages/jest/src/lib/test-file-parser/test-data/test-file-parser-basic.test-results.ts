import { testFileParserBasicFileName } from './test-file-parser-basic.source-file';

import {
	aggregatedResultFactory,
	assertionResultFactory,
	testResultFactory,
} from '../../test-utils/factory';

const testFileParserBasicAssertionResult = assertionResultFactory({
	ancestorTitles: ['form validation'],
	fullName: 'should validate email',
	title: 'should validate email',
	numPassingAsserts: 1,
});

const testFileParserBasicTestResult = testResultFactory({
	testFilePath: testFileParserBasicFileName,
	testResults: [testFileParserBasicAssertionResult],
});

export const testFileParserBasicAggregatedResult = aggregatedResultFactory({
	testResults: [testFileParserBasicTestResult],
});
