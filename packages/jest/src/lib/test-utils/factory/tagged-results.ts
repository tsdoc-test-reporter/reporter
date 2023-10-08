import { TestDataFactory, testDocBlockCommentFactory } from '@tsdoc-test-reporter/core';

import { aggregatedResultFactory, assertionResultFactory, testResultFactory } from './results';

import type { TaggedAggregatedResult, TaggedAssertionResult, TaggedTestResult } from '../../types';

export const taggedAssertionResultFactory: TestDataFactory<TaggedAssertionResult> = (
	overrides = {},
) => ({
	...assertionResultFactory(overrides),
	ancestorTestBlockComments: overrides.ancestorTestBlockComments?.map(testDocBlockCommentFactory),
	testBlockComments: overrides.testBlockComments?.map(testDocBlockCommentFactory),
});

export const taggedTestResultFactory: TestDataFactory<TaggedTestResult> = (overrides = {}) => {
	return {
		...testResultFactory(overrides),
		testResults: overrides.testResults?.map(taggedAssertionResultFactory) ?? [],
	};
};

export const taggedAggregatedResultFactory: TestDataFactory<TaggedAggregatedResult> = (
	overrides = {},
) => {
	return {
		...aggregatedResultFactory(overrides),
		testResults: overrides.testResults?.map(taggedTestResultFactory) ?? [],
	};
};
