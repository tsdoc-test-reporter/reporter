import {
	aggregateTags,
	formatTitle,
	getTagsFromTestBlockComments,
	type UIAssertion,
	type UIOptions,
	type UITestResult,
} from '@tsdoc-test-reporter/core';
import type { TaggedTestResult } from '../types';
import type { AssertionResult } from '@jest/test-result';

const jestStatusToUiStatus: Record<AssertionResult['status'], UIAssertion['status']> = {
	passed: 'pass',
	failed: 'fail',
	skipped: 'skip',
	pending: 'skip',
	todo: 'todo',
	disabled: 'skip',
	focused: 'only',
};

export const toUITestResult =
	(options?: UIOptions) =>
	(result: TaggedTestResult): UITestResult => {
		const assertions: UIAssertion[] = result.testResults.map((assertion) => ({
			title: assertion.title,
			status: jestStatusToUiStatus[assertion.status],
			tags: getTagsFromTestBlockComments(assertion.testBlockComments, options),
		}));
		return {
			title: formatTitle(result.testFilePath, options?.formatTitle),
			meta: {
				passed: result.numPassingTests,
				failed: result.numFailingTests,
				skipped: result.numPendingTests,
				todo: result.numTodoTests,
			},
			aggregatedTags: aggregateTags(assertions),
			assertions,
		};
	};

export const toUITestResults = (results: TaggedTestResult[], options?: UIOptions) =>
	results.map(toUITestResult(options));
