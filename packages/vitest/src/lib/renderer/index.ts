import {
	type UIAssertion,
	type UIOptions,
	type UITag,
	type UITestResult,
	getTagsFromTestBlockComments,
	aggregateMeta,
	aggregateTags,
	titleFormatter,
} from '@tsdoc-test-reporter/core';
import type { TaggedFile, TaggedSuite, TaggedTask } from '../../types';
import { isSuite } from '../utils/vitest.utils';

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
		return [
			{
				title: task.name,
				ancestorTitles,
				tags: getTagsFromTestBlockComments(task.testBlockComments, options).concat(ancestorTags),
				status: task.result?.state ?? task.mode ?? 'run',
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
			title: titleFormatter(file.filepath, options?.titleFormatter),
			meta: aggregateMeta(assertions),
			aggregatedTags,
			assertions,
		};
	};

export const toUITestResults = (files: TaggedFile[], options?: UIOptions): UITestResult[] =>
	files.map(toUITestResult(options));
