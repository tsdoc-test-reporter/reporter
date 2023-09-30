import { TestDataFactory } from './types';

import { TestBlockTag } from '../../types';

/**
 * @internal
 * @hidden
 */
export const testBlockTagFactory: TestDataFactory<TestBlockTag> = (
	overrides = {}
) => ({
	type: 'standard',
	tags: [],
	name: '@remarks',
	testBlockType: 'test',
	testTitle: 'default test title',
	kind: 'block',
	...overrides,
});
