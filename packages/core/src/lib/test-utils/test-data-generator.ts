import { allModifierTags } from '../defaults';
import {
	AllTagsName,
	CommentTagParserConfig,
	ModifierTagName,
	TestBlockName,
	TestBlockTag,
} from '../types';
import { TestFileFactoryOptions } from './factory/test-file';

export type TestData = TestFileFactoryOptions & {
	expected: TestBlockTag[];
	parserOptions?: Partial<CommentTagParserConfig<string>>;
};

export type TestDataConfig = Pick<TestFileFactoryOptions, 'fileName'> & {
	tags: AllTagsName[];
	tagContent?: string[];
	testBlockName?: TestBlockName;
	parserOptions?: Partial<CommentTagParserConfig<string>>;
};

export const basicTestDataGenerator = ({
	tags,
	parserOptions = {},
	tagContent,
	testBlockName = 'test',
	fileName = 'fileName.ts',
}: TestDataConfig): TestData[] =>
	tags.map((tag) => ({
		fileName: fileName,
		options: [
			{
				testBlockName,
				testTitle: tag,
				tags: [
					{
						tagName: tag,
						tagContent: tagContent?.join(','),
					},
				],
			},
		],
		expected: [
			{
				kind: allModifierTags.includes(tag as ModifierTagName) ? 'modifier' : 'block',
				name: tag,
				tags: allModifierTags.includes(tag as ModifierTagName) ? undefined : tagContent,
				testBlockName,
				testTitle: tag,
				type: 'standard',
			},
		],
		parserOptions,
	}));
