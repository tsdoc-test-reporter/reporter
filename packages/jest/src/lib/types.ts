import type { AggregatedResult, AssertionResult, TestResult } from '@jest/test-result';
import type { WithTestDocBlockComments } from '@tsdoc-test-reporter/core';

/**
 * @see {@link AssertionResult} from Jest with TestDockBlockComments
 * from the parser
 */
export type TaggedAssertionResult<CustomTags extends string = string> = WithTestDocBlockComments<
	AssertionResult,
	CustomTags
>;

export type TaggedTestResult<CustomTags extends string = string> = Omit<
	TestResult,
	'testResults'
> & {
	testResults: TaggedAssertionResult<CustomTags>[];
};

export type TaggedAggregatedResult<CustomTags extends string = string> = Omit<
	AggregatedResult,
	'testResults'
> & {
	testResults: TaggedTestResult<CustomTags>[];
};
