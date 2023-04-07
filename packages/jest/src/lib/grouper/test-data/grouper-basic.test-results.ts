import {
	taggedAggregatedResultFactory,
	taggedAssertionResultFactory,
	taggedTestResultFactory,
} from '../../test-utils/factory';
import { grouperBasicSourceFileName } from './grouper-basic.source-file';

const testResults = [
	taggedAssertionResultFactory({
		ancestorTitles: ['form validation'],
		fullName: 'should validate email',
		title: 'should validate email',
		numPassingAsserts: 1,
	}),
	taggedAssertionResultFactory({
		ancestorTitles: ['feature title'],
		fullName: 'should show invalid email error',
		title: 'should show invalid email error',
		numPassingAsserts: 1,
	}),
	taggedAssertionResultFactory({
		ancestorTitles: ['other tests'],
		fullName: 'should validate',
		title: 'should validate',
		numPassingAsserts: 1,
	}),
];

const grouperBasicTestResult = taggedTestResultFactory({
	testFilePath: grouperBasicSourceFileName,
	numFailingTests: 2,
	numPassingTests: 1,
	numPendingTests: 0,
	numTodoTests: 0,
	testResults,
});

export const grouperBasicAggregatedResult = taggedAggregatedResultFactory({
	testResults: [grouperBasicTestResult],
});
