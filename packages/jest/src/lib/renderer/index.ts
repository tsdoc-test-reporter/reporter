import {
	aggregateMeta,
	aggregateTags,
	getTagsFromTestBlockComments,
	type UIAssertion,
	type UIOptions,
	type UITestResult,
	type UITestError,
	type ToUITestResults,
	type ToUILog,
} from '@tsdoc-test-reporter/core';
import type { FailureDetails, LogEntry, TaggedAssertionResult, TaggedTestResult } from '../types';
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

export const toUIErrors = (assertion: TaggedAssertionResult): UITestError[] => {
	return assertion.failureDetails
		?.map((failureDetails, index) => {
			const details = failureDetails as FailureDetails | undefined;
			if (!details?.matcherResult?.message && details?.name) {
				return {
					name: details.name,
					message: assertion.failureMessages[index],
				};
			}
			return {
				name: details?.matcherResult?.message ?? '',
				message: details?.matcherResult?.message ?? '',
			};
		})
		.filter(Boolean) as UITestError[];
};

const toUILog: ToUILog<LogEntry> = (log) => ({
	content: log.message,
	type: log.type,
	origin: log.origin,
});

export const toUITestResult =
	(options: UIOptions | undefined) =>
	(result: TaggedTestResult): UITestResult => {
		const assertions: UIAssertion[] = result.testResults.map((assertion) => {
			const errors = toUIErrors(assertion);
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
		const logs = result.console?.map(toUILog);
		return {
			title: options?.titleFormatter
				? options.titleFormatter(result.testFilePath)
				: result.testFilePath,
			filePath: result.testFilePath,
			meta: { ...aggregateMeta(assertions), hasLogs: logs && logs.length > 0 ? true : undefined },
			aggregatedTags,
			assertions,
			logs,
		};
	};

export const toUITestResults: ToUITestResults<TaggedTestResult> = (results, options) =>
	results.map(toUITestResult(options));
