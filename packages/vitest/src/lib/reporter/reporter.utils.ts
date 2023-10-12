import type { File } from 'vitest';
import type { TestBlockDocComment } from '@tsdoc-test-reporter/core';
import type { TaggedFile } from '../../types';
import { attachTestBlockComments } from '../utils/vitest.utils';

export const resultMapper = (
	result: File,
	testDocBlockComments: TestBlockDocComment[],
): TaggedFile => ({
	...result,
	tasks: attachTestBlockComments(result.tasks, testDocBlockComments),
});
