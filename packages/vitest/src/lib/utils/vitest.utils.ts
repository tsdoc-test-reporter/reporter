import { TestBlockDocComment } from '@tsdoc-test-reporter/core';
import { Suite, Task, Test } from 'vitest';
import { TaggedTask } from '../../types';

export const isSuite = (task: Task): task is Suite => task.type === 'suite';

export const isTest = (task: Task): task is Test => task.type === 'test';

export const attachTestBlockComments = (
	tasks: Task[] | undefined,
	testBlockDocComments: TestBlockDocComment[],
): TaggedTask[] | undefined => {
	if (!tasks) return undefined;
	return tasks.map((task) => ({
		...task,
		tasks: isSuite(task) ? attachTestBlockComments(task.tasks, testBlockDocComments) : undefined,
		file: undefined,
		suite: undefined,
		testBlockComments: testBlockDocComments.filter((t) => t.title === task.name),
	}));
};
