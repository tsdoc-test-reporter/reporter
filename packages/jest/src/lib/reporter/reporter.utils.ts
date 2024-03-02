import { TestResult } from '@jest/test-result';
import { TestBlockDocComment } from '@tsdoc-test-reporter/core';
import { LogEntry, TaggedTestResult } from '../types';

export const resultMapper = (
	result: TestResult,
	testDocBlockComments: TestBlockDocComment[],
	logEntries?: Record<string, LogEntry[]>
): TaggedTestResult => {
	const logs = logEntries ? logEntries[result.testFilePath] : result.console;
		return ({
			...result,
			console: (logs?.length ?? 0) > 0 ? logs : undefined,
			testResults: result.testResults.map((testResult) => ({
				...testResult,
				testBlockComments: testDocBlockComments.filter(
					(t) => t.title === testResult.title || testResult.ancestorTitles.includes(t.title)
				),
			})),
		});
	};
