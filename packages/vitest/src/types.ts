import type { WithTestDocBlockComments } from '@tsdoc-test-reporter/core';

import type { File, Suite, Task, Test } from 'vitest';

export type TaggedTask<CustomTags extends string = string> = WithTestDocBlockComments<
	Omit<Task, 'tasks'>,
	CustomTags
> & { tasks?: TaggedTask[] };

export type TaggedSuite<CustomTags extends string = string> = WithTestDocBlockComments<
	Omit<Suite, 'tasks'>,
	CustomTags
> & { tasks?: TaggedTask[] };

export type TaggedFile<CustomTags extends string = string> = WithTestDocBlockComments<
	Omit<File, 'tasks'>,
	CustomTags
> & { tasks?: (TaggedTask | TaggedSuite)[] };

export type TaggedTest<CustomTags extends string = string> = WithTestDocBlockComments<
	Test,
	CustomTags
>;
