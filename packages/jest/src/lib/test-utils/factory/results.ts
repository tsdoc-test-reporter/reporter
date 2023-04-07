import type {
	AggregatedResult,
	AssertionResult,
	TestResult,
} from '@jest/test-result';
import { TestDataFactory } from '@tsdoc-test-reporter/core';

export const assertionResultFactory: TestDataFactory<AssertionResult> = (
	overrides = {}
) => ({
	ancestorTitles: [],
	duration: null,
	failureDetails: [],
	failureMessages: [],
	fullName: 'test title',
	invocations: undefined,
	location: undefined,
	numPassingAsserts: 0,
	retryReasons: undefined,
	status: 'passed',
	title: 'test title',
	testBlockComments: undefined,
	ancestorTestBlockComments: undefined,
	...overrides,
});

export const testResultFactory: TestDataFactory<TestResult> = (
	overrides = {}
) => ({
	leaks: false,
	numFailingTests: 0,
	numPassingTests: 0,
	numPendingTests: 0,
	numTodoTests: 0,
	openHandles: [],
	perfStats: {
		end: 0,
		runtime: 0,
		slow: false,
		start: 0,
	},
	skipped: false,
	snapshot: {
		added: 0,
		fileDeleted: false,
		matched: 0,
		unchecked: 0,
		uncheckedKeys: [],
		unmatched: 0,
		updated: 0,
	},
	testFilePath: 'default-file-path.ts',
	...overrides,
	testResults:
		overrides.testResults?.map((t) => assertionResultFactory(t)) ?? [],
});

export const aggregatedResultFactory: TestDataFactory<AggregatedResult> = (
	overrides = {}
) => ({
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
	startTime: 0,
	success: true,
	wasInterrupted: false,
	runExecError: undefined,
	...overrides,
	testResults: overrides.testResults?.map((t) => testResultFactory(t)) ?? [],
});
