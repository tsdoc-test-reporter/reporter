import { reporterBasicSourceFileName } from './reporter.source-file';

import {
	taggedAggregatedResultFactory,
	taggedAssertionResultFactory,
	taggedTestResultFactory,
} from '../../test-utils/factory';

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
	taggedAssertionResultFactory({
		ancestorTitles: ['other tests'],
		fullName: 'should validate another thing',
		title: 'should validate another thing',
		numPassingAsserts: 1,
		status: 'failed',
		failureDetails: [
			{
				matcherResult: {
					actual: 'undefined',
					expected: 'swish_number_required',
					message:
						'\u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).\u001b[22mnot\u001b[2m.\u001b[22mtoEqual\u001b[2m(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m) // deep equality\u001b[22m\n\nExpected: not \u001b[32m"swish_number_required"\u001b[39m\n',
					name: 'toEqual',
					pass: true,
				},
			},
		],
	}),
	taggedAssertionResultFactory({
		ancestorTitles: ['other tests'],
		fullName: 'should validate a third thing',
		title: 'should validate a third thing',
		numPassingAsserts: 1,
		status: 'skipped',
	}),
];

const reporterBasicTestResult = taggedTestResultFactory({
	testFilePath: reporterBasicSourceFileName,
	numFailingTests: 2,
	numPassingTests: 1,
	numPendingTests: 1,
	numTodoTests: 1,
	testResults,
});

export const reporterBasicAggregatedResult = taggedAggregatedResultFactory({
	testResults: [reporterBasicTestResult],
});
