import type { TestDataFactory } from './types';

import type { TestBlockDocComment } from '../../types';

import { testBlockTagFactory } from './test-doc-block-tag';

/**
 * @internal
 * @hidden
 * Factory function for creating a {@link TestBlockDocComment}
 * @example
 * ```ts
 * const block = testDocBlockCommentFactory({
 *		testFilePath: "filePath.ts",
 * 		title: "test title",
 * 		testBlockName: "test"
 * })
 * ```
 */
export const testDocBlockCommentFactory: TestDataFactory<TestBlockDocComment> = (
	overrides = {},
) => ({
	testFilePath: 'default-test-file-path.ts',
	title: 'default test title',
	testBlockName: 'test',
	commentStartPosition: 1,
	commentEndPosition: 2,
	...overrides,
	testBlockTags: overrides.testBlockTags
		? Object.fromEntries(
			Object.entries(overrides.testBlockTags).map(([tagName, tag]) => [
				tagName,
				testBlockTagFactory(tag),
			]),
		)
		: undefined,
});
