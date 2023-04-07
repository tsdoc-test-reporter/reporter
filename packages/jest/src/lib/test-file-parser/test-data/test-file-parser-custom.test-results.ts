import {
	aggregatedResultFactory,
	assertionResultFactory,
	testResultFactory,
} from '../../test-utils/factory';
import { testFileParserCustomFileName } from './test-file-parser-custom.source-file';

const testFileParserCustomAssertionResult = assertionResultFactory({
	ancestorTitles: ['form validation'],
	fullName: 'should validate email',
	title: 'should validate email',
	numPassingAsserts: 1,
});

const testFileParserCustomTestResult = testResultFactory({
	testFilePath: testFileParserCustomFileName,
	testResults: [testFileParserCustomAssertionResult],
});

export const testFileParserCustomAggregatedResult = aggregatedResultFactory({
	testResults: [testFileParserCustomTestResult],
});
