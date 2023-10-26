import { TestResult } from '@jest/test-result';
import { TestBlockDocComment } from '@tsdoc-test-reporter/core';
import { TaggedTestResult } from '../types';

export const resultMapper = (
	result: TestResult,
	testDocBlockComments: TestBlockDocComment[],
): TaggedTestResult => ({
	...result,
	testResults: result.testResults.map((testResult) => ({
		...testResult,
		testBlockComments: testDocBlockComments.filter(
			(t) => t.title === testResult.title || testResult.ancestorTitles.includes(t.title),
		),
	})),
});
