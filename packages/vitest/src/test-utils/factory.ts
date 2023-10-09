import type { TestDataFactory } from '@tsdoc-test-reporter/core';
import type { File, Task, TaskResult } from 'vitest';

export const taskResultFactory: TestDataFactory<TaskResult> = (overrides = {}) => ({
	state: 'pass',
	...overrides,
	errors: [],
	benchmark: undefined,
	hooks: undefined,
	retryCount: undefined,
	repeatCount: undefined,
	error: undefined,
});

type FactoryTask = Omit<Task, 'suite' | 'file' | 'state' | 'logs'> & {
	tasks: FactoryTask[];
};

export const taskFactory: TestDataFactory<FactoryTask> = (overrides = {}) => ({
	id: 'id',
	name: 'name',
	type: 'test',
	mode: 'run',
	filepath: 'file-path.ts',
	meta: {},
	...overrides,
	tasks: overrides.tasks?.map(taskFactory) ?? [],
	result: taskResultFactory(overrides.result),
});

type FactoryFile = Omit<File, 'suite' | 'file' | 'meta' | 'result' | 'logs' | 'tasks'> & {
	tasks: FactoryTask[];
};

export const fileFactory: TestDataFactory<FactoryFile> = (overrides = {}) => ({
	id: 'id',
	filepath: 'file-path.ts',
	name: 'name',
	mode: 'run',
	type: 'suite',
	...overrides,
	tasks: overrides.tasks?.map(taskFactory) ?? [],
});
