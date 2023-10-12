import { TestBlockDocComment } from '@tsdoc-test-reporter/core';
import { Suite, Task, Test } from 'vitest';
import { TaggedSuite, TaggedTask } from '../../types';

export const isSuite = (task: TaggedTask | Task): task is Suite | TaggedSuite =>
	task.type === 'suite';

export const isTest = (task: TaggedTask | Task): task is Test | TaggedTask => task.type === 'test';

export const attachTestBlockComments = (
	tasks: Task[] | undefined,
	testBlockDocComments: TestBlockDocComment[],
): TaggedTask[] | undefined => {
	if (!tasks) return undefined;
	return tasks.map((task) => {
		return {
			...task,
			tasks: isSuite(task) ? attachTestBlockComments(task.tasks, testBlockDocComments) : undefined,
			file: undefined,
			suite: undefined,
			testBlockComments: testBlockDocComments.filter((t) => t.title === task.name),
		};
	});
};
