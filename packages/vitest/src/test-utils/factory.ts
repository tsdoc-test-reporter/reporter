import {
	testDocBlockCommentFactory,
	type DeepPartial,
	type TestDataFactory,
} from '@tsdoc-test-reporter/core';
import type { ErrorWithDiff, File, Suite, Task, TaskResult, Test } from 'vitest';
import { TaggedFile, TaggedSuite, TaggedTest } from '../types';

export const locationFactory: TestDataFactory< {
	line: number;
	column: number;
}> = (overrides = {}) => ({
	line: 0,
	column: 0,
	...overrides,
})

export const errorFactory: TestDataFactory<ErrorWithDiff> = (overrides = {}) => ({
	message: 'message',
	name: 'name',
	...overrides,
	stacks: [],
});

export const taskResultFactory: TestDataFactory<TaskResult> = (overrides = {}) => ({
	state: 'pass',
	...overrides,
	errors: overrides.errors?.map(errorFactory) ?? [],
	benchmark: undefined,
	hooks: undefined,
	retryCount: undefined,
	repeatCount: undefined,
	error: undefined,
});

type FactoryTask = Omit<Task, 'suite' | 'file' | 'state' | 'logs'> & {
	tasks: FactoryTask[];
};

const internalTaskFactory: TestDataFactory<FactoryTask> = (overrides = {}) => ({
	id: 'id',
	name: 'name',
	type: 'test',
	mode: 'run',
	filepath: 'file-path.ts',
	meta: {},
	...overrides,
	location: locationFactory(overrides.location),
	tasks: overrides.tasks?.map(internalTaskFactory) ?? [],
	result: taskResultFactory(overrides.result),
});

export const taskFactory = (overrides: DeepPartial<Task> = {}): Task =>
	internalTaskFactory(overrides) as Task;

export const testFactory = (overrides: DeepPartial<Test> = {}): Test =>
	taskFactory({
		type: 'test',
		...overrides,
	}) as unknown as Test;

export const suiteFactory = (overrides: DeepPartial<Suite> = {}): Suite =>
	taskFactory({
		type: 'suite',
		...overrides,
	}) as unknown as Suite;

export const taggedTestFactory: TestDataFactory<TaggedTest> = (overrides = {}) => ({
	...testFactory(overrides),
	testBlockComments: overrides.testBlockComments?.map(testDocBlockCommentFactory) ?? [],
});

export const taggedSuiteFactory: TestDataFactory<TaggedSuite> = (overrides = {}) => ({
	...suiteFactory(overrides as DeepPartial<Suite>),
	testBlockComments: overrides.testBlockComments?.map(testDocBlockCommentFactory) ?? [],
});

type FactoryFile = Omit<File, 'suite' | 'file' | 'meta' | 'result' | 'logs' | 'tasks'> & {
	tasks: FactoryTask[];
};

export const internalFileFactory: TestDataFactory<FactoryFile> = (overrides = {}) => ({
	id: 'id',
	filepath: 'file-path.ts',
	name: 'name',
	mode: 'run',
	type: 'suite',
	projectName: 'projectName',
	...overrides,
	location: locationFactory(overrides.location),
	tasks: overrides.tasks?.map(internalTaskFactory) ?? [],
});

export const fileFactory = (overrides: DeepPartial<File> = {}): File =>
	internalFileFactory(overrides) as File;

export const taggedFileFactory = (overrides: DeepPartial<TaggedFile> = {}): TaggedFile => ({
	...fileFactory({
		...(overrides as DeepPartial<File>),
	}),
});
