import {
	taggedAggregatedResultFactory,
	taggedAssertionResultFactory,
	taggedTestResultFactory,
} from '../../test-utils/factory';
import { reporterHTMLSourceFileName } from './reporter-html.source-file';

const testResults = [
	taggedAssertionResultFactory({
		ancestorTitles: ['form validation'],
		fullName: 'should validate email',
		title: 'should validate email',
		numPassingAsserts: 1,
	}),
	taggedAssertionResultFactory({
		ancestorTitles: ['form validation', 'error handling'],
		fullName: 'should show invalid email error',
		title: 'should show invalid email error',
		numPassingAsserts: 0,
		status: "failed",
		failureDetails: [
			{
				matcherResult: {
					actual: 'true',
					expected: 'false',
					message:
						'\u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).\u001b[22mnot\u001b[2m.\u001b[22mtoEqual\u001b[2m(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m) // deep equality',
					name: 'toEqual',
					pass: false,
				},
			},
		],
	}),
];

const reporterHTMLTestResult = taggedTestResultFactory({
	testFilePath: reporterHTMLSourceFileName,
	numFailingTests: 2,
	numPassingTests: 1,
	numPendingTests: 1,
	numTodoTests: 1,
	testResults,
});

export const reporterHTMLAggregatedResult = taggedAggregatedResultFactory({
	testResults: [reporterHTMLTestResult],
});
