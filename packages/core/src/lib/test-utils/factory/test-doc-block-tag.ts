import { TestDataFactory } from './types';

import { TestBlockTag } from '../../types';

export const testBlockTagFactory: TestDataFactory<TestBlockTag> = (
	overrides = {}
) => ({
	type: 'standard',
	tags: [],
	tagName: '@remarks',
	testBlockType: 'test',
	testTitle: 'default test title',
	...overrides,
});
