import type { AggregatedResult, AssertionResult, TestResult } from '@jest/test-result';
import type { TestDataFactory } from '@tsdoc-test-reporter/core';
import type { FailureDetails } from '../../types';

export const failureDetailsFactory: TestDataFactory<FailureDetails> = (overrides = {}) => {
	return ({
		name: overrides.name,
		matcherResult: overrides.matcherResult ? {
			message: overrides.matcherResult?.message,
			pass: overrides.matcherResult?.pass ?? true,
		} : undefined,
	});
};

export const assertionResultFactory: TestDataFactory<AssertionResult> = (overrides = {}) => ({
	duration: null,
	fullName: 'test',
	invocations: undefined,
	numPassingAsserts: 0,
	status: 'passed',
	title: 'test',
	...overrides,
	location: undefined,
	failureDetails: overrides.failureDetails?.map(failureDetailsFactory) ?? [],
	failureMessages: overrides.failureMessages ?? [],
	ancestorTitles: overrides.ancestorTitles ?? [],
	retryReasons: (overrides.retryReasons as string[]) ?? [],
});

export const testResultFactory: TestDataFactory<TestResult> = (overrides = {}) => ({
	testFilePath: 'file-path.ts',
	numFailingTests: 0,
	numPassingTests: 0,
	numPendingTests: 0,
	numTodoTests: 0,
	skipped: false,
	leaks: false,
	...overrides,
	openHandles: [],
	snapshot: {
		added: 0,
		fileDeleted: false,
		matched: 0,
		unchecked: 0,
		uncheckedKeys: [],
		unmatched: 0,
		updated: 0,
	},
	perfStats: {
		end: 0,
		runtime: 0,
		slow: false,
		start: 0,
	},
	console: [],
	coverage: undefined,
	displayName: {
		name: 'name',
		color: 'cyan',
	},
	testExecError: undefined,
	v8Coverage: undefined,
	testResults: overrides.testResults?.map(assertionResultFactory) ?? [],
});

export const aggregatedResultFactory: TestDataFactory<AggregatedResult> = (overrides = {}) => ({
	numFailedTests: 0,
	numFailedTestSuites: 0,
	numPassedTests: 0,
	numPassedTestSuites: 0,
	numPendingTests: 0,
	numTodoTests: 0,
	numPendingTestSuites: 0,
	numRuntimeErrorTestSuites: 0,
	numTotalTests: 0,
	numTotalTestSuites: 0,
	startTime: 0,
	success: true,
	wasInterrupted: false,
	...overrides,
	openHandles: [],
	snapshot: {
		added: 0,
		didUpdate: false,
		failure: false,
		filesAdded: 0,
		filesRemoved: 0,
		filesRemovedList: [],
		filesUnmatched: 0,
		filesUpdated: 0,
		matched: 0,
		total: 0,
		unchecked: 0,
		uncheckedKeysByFile: [],
		unmatched: 0,
		updated: 0,
	},
	runExecError: undefined,
	coverageMap: undefined,
	testResults: overrides.testResults?.map(testResultFactory) ?? [],
});
