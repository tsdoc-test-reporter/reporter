import {
	aggregateMeta,
	aggregateTags,
	titleFormatter,
	getTagsFromTestBlockComments,
	type UIAssertion,
	type UIOptions,
	type UITestResult,
} from '@tsdoc-test-reporter/core';
import type { FailureDetails, TaggedTestResult } from '../types';
import type { AssertionResult } from '@jest/test-result';
import { UITestError } from 'packages/core/src/lib/types';

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
		const assertions: UIAssertion[] = result.testResults.map((assertion) => {
			const errors = assertion.failureDetails
				?.map((failureDetails) => {
					const details = failureDetails as FailureDetails | undefined;
					if (!details?.matcherResult.message) return undefined;
					const error: UITestError = {
						name: details?.matcherResult.message,
						message: details?.matcherResult.message,
					};
					return error;
				})
				.filter(Boolean) as UITestError[];
			return {
				title: assertion.title,
				ancestorTitles: options?.hideAncestorTitles ? undefined : assertion.ancestorTitles,
				status: jestStatusToUiStatus[assertion.status],
				tags: getTagsFromTestBlockComments(assertion.testBlockComments, options),
				errors: errors && errors.length > 0 ? errors : undefined,
			};
		});
		const aggregatedTags = options?.aggregateTagsToFileHeading
			? aggregateTags(assertions, options.aggregateTagsToFileHeading)
			: undefined;
		return {
			title: titleFormatter(result.testFilePath, options?.titleFormatter),
			meta: aggregateMeta(assertions),
			aggregatedTags,
			assertions,
		};
	};

export const toUITestResults = (results: TaggedTestResult[], options?: UIOptions) =>
	results.map(toUITestResult(options));
