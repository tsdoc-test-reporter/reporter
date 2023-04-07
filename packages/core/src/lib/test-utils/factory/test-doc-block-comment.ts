import { TestDataFactory } from './types';

import { TestBlockDocComment } from '../../types';

import { testBlockTagFactory } from './test-doc-block-tag';

export const testDocBlockCommentFactory: TestDataFactory<
	TestBlockDocComment
> = (overrides = {}) => ({
	testFilePath: 'default-test-file-path.ts',
	title: 'default test title',
	testBlockType: 'test',
	commentStartPosition: 1,
	commentEndPosition: 2,
	...overrides,
	testBlockTags: overrides.testBlockTags
		? Object.fromEntries(
				Object.entries(overrides.testBlockTags).map(([tagName, tag]) => [
					tagName,
					testBlockTagFactory(tag),
				])
		  )
		: undefined,
});
