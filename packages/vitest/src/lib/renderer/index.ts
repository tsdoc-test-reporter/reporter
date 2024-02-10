import {
	getTagsFromTestBlockComments,
	aggregateMeta,
	aggregateTags,
	type UIAssertion,
	type UIOptions,
	type UITag,
	type UITestResult,
	type ToUITestResults,
	type ToUITestError,
	type ToUILog,
	type UILog,
} from '@tsdoc-test-reporter/core';
import type { TaggedFile, TaggedSuite, TaggedTask } from '../../types';
import { isSuite } from '../utils/vitest.utils';
import type { ErrorWithDiff, UserConsoleLog } from 'vitest';

const logTypeLookup: Record<UserConsoleLog['type'], UILog['type']> = {
	stdout: 'log',
	stderr: 'error',
};

const toUITestError: ToUITestError<ErrorWithDiff> = (error) => ({
	name: error.name,
	message: error.message,
	expected: error.expected,
	actual: error.actual,
	diff: error.showDiff ? error.diff : undefined,
});

const toUILog: ToUILog<UserConsoleLog> = (log) => ({
	content: log.content,
	type: logTypeLookup[log.type],
});

export const aggregateAssertions = (
	tasks: (TaggedTask | TaggedSuite)[],
	ancestorTitles: string[],
	ancestorTags: UITag[],
	options?: UIOptions,
): UIAssertion[] => {
	return tasks.flatMap((task) => {
		if (isSuite(task) && task.tasks) {
			return aggregateAssertions(
				task.tasks,
				options?.hideAncestorTitles ? [] : ancestorTitles.concat([task.name]),
				options?.hideAncestorTags
					? []
					: ancestorTags.concat(getTagsFromTestBlockComments(task.testBlockComments, options)),
				options,
			);
		}
		const status = task.result?.state ?? task.mode ?? 'run';
		const errors = task.result?.errors?.map(toUITestError);
		const logs = task.logs?.map(toUILog);
		return [
			{
				title: task.name,
				ancestorTitles: options?.hideAncestorTitles ? [] : ancestorTitles,
				tags: getTagsFromTestBlockComments(task.testBlockComments, options).concat(ancestorTags),
				status,
				errors: (errors?.length ?? 0) > 0 ? errors : undefined,
				logs,
			},
		];
	});
};

export const toUITestResult =
	(options?: UIOptions) =>
	(file: TaggedFile): UITestResult => {
		const assertions = file.tasks ? aggregateAssertions(file.tasks, [], [], options) : [];
		const aggregatedTags = options?.aggregateTagsToFileHeading
			? aggregateTags(assertions, options.aggregateTagsToFileHeading)
			: undefined;
		return {
			title: options?.titleFormatter ? options.titleFormatter(file.filepath) : file.filepath,
			filePath: file.filepath,
			meta: aggregateMeta(assertions),
			aggregatedTags,
			assertions,
		};
	};

export const toUITestResults: ToUITestResults<TaggedFile> = (files, options) =>
	files.map(toUITestResult(options));
