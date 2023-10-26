import type { TestDataFactory } from './types';

import type { TestBlockTag } from '../../types';

/**
 * @internal
 * @hidden
 * Factory function for creating a {@link TestBlockTag}
 * @example
 * ```ts
 * const block = testBlockTagFactory({
 *	type: "standard",
 *	name: "@remarks",
 * 	testBlockName: "test"
 *  testTitle: "test title",
 *  kind: "block",
 * })
 * ```
 */
export const testBlockTagFactory: TestDataFactory<TestBlockTag> = (overrides = {}) => ({
	type: 'standard',
	name: '@remarks',
	testBlockName: 'test',
	testTitle: 'default test title',
	testFilePath: 'test-file-path.ts',
	kind: 'block',
	...overrides,
	tags: (overrides.tags as string[]) ?? [],
});
