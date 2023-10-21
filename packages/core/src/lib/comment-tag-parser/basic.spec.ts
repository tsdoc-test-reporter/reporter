import { test, describe, expect } from 'vitest';
import { TSDocParser } from '@microsoft/tsdoc';
import { CommentTagParser } from './index';
import { testFileFactory } from '../test-utils/factory/test-file';
import { allBlockTags, allModifierTags, testBlockTagNames } from '../defaults';
import { basicTestDataGenerator, TestData } from '../test-utils/test-data-generator';
import { TestBlockDocComment, TestBlockTag } from '../types';
import { mockedGetTestTitleFromExpression } from '../test-utils';

const getTagValues = (testBlockDocComments: TestBlockDocComment[]) =>
	Object.values(testBlockDocComments[0].testBlockTags ?? {});

describe('transform all tags in the standard', () => {
	const testData: TestData[] = [
		...basicTestDataGenerator({
			tags: allBlockTags,
			fileName: 'basic.ts',
			tagContent: ['unit', 'acceptance'],
		}),
		...basicTestDataGenerator({
			fileName: 'basic.ts',
			tags: allModifierTags,
		}),
	];
	test.each(testData)(
		'$options.0.testBlockName: $options.0.tags.0.tagName: $options.0.tags.0',
		({ expected, fileName, options, parserOptions }) => {
			const { testBlockDocComments } = new CommentTagParser({
				sourceFile: testFileFactory({ fileName, options }),
				tsDocParser: new TSDocParser(),
				getTestTitleFromExpression: mockedGetTestTitleFromExpression,
				...parserOptions,
			});
			expect(getTagValues(testBlockDocComments)).toEqual<TestBlockTag[]>(expected);
		},
	);
});

describe('transform all tags in the standard for each test block name', () => {
	const testData: TestData[] = testBlockTagNames.flatMap((testBlockName) => [
		...basicTestDataGenerator({
			fileName: 'basic.ts',
			tags: allModifierTags,
			testBlockName,
		}),
		...basicTestDataGenerator({
			fileName: 'basic.ts',
			tags: allModifierTags,
			testBlockName,
			tagContent: ['a tag'],
		}),
	]);
	test.each(testData)(
		'$options.0.testBlockName: $options.0.tags.0.tagName: $options.0.tags.0',
		({ expected, fileName, options, parserOptions }) => {
			const { testBlockDocComments } = new CommentTagParser({
				sourceFile: testFileFactory({ fileName, options }),
				tsDocParser: new TSDocParser(),
				getTestTitleFromExpression: mockedGetTestTitleFromExpression,
				...parserOptions,
			});
			expect(getTagValues(testBlockDocComments)).toEqual<TestBlockTag[]>(expected);
		},
	);
});

describe('transform with user supplied parserOptions', () => {
	test.only('disregard excluded tags', () => {
		const { testBlockDocComments } = new CommentTagParser({
			sourceFile: testFileFactory({
				fileName: 'basic.ts',
				options: [
					{
						testBlockName: 'test',
						testTitle: '@alpha',
						tags: [
							{
								tagName: '@alpha',
							},
							{
								tagName: '@beta',
							},
							{
								tagName: '@remarks',
							},
						],
					},
				],
			}),
			tsDocParser: new TSDocParser(),
			excludeTags: ['@beta', "@remarks"],
			getTestTitleFromExpression: mockedGetTestTitleFromExpression,
		});
		expect(getTagValues(testBlockDocComments)).toEqual<TestBlockTag[]>([
			{
				kind: 'modifier',
				name: '@alpha',
				testBlockName: 'test',
				type: 'standard',
				testTitle: '@alpha',
			},
		]);
	});

	test('separate tags in blocks with custom separator', () => {
		const { testBlockDocComments } = new CommentTagParser({
			sourceFile: testFileFactory({
				fileName: 'basic.ts',
				options: [
					{
						testBlockName: 'test',
						testTitle: '@alpha',
						tags: [
							{
								tagName: '@remarks',
								tagContent: 'unit;acceptance',
							},
						],
					},
				],
			}),
			tsDocParser: new TSDocParser(),
			tagSeparator: ';',
			getTestTitleFromExpression: mockedGetTestTitleFromExpression,
		});
		expect(getTagValues(testBlockDocComments)).toEqual<TestBlockTag[]>([
			{
				kind: 'block',
				name: '@remarks',
				testBlockName: 'test',
				type: 'standard',
				testTitle: '@alpha',
				tags: ['unit', 'acceptance'],
			},
		]);
	});

	test('only parse user supplied test block names', () => {
		const sourceFile = testFileFactory({
			fileName: 'basic.ts',
			options: [
				{
					testBlockName: 'it',
					testTitle: '@alpha',
					tags: [
						{
							tagName: '@alpha',
						},
					],
				},
				{
					testBlockName: 'test',
					testTitle: '@beta',
					tags: [
						{
							tagName: '@beta',
						},
					],
				},
			],
		})
		const { testBlockDocComments } = new CommentTagParser({
			sourceFile,
			tsDocParser: new TSDocParser(),
			testBlockTagNames: ['test'],
			getTestTitleFromExpression: mockedGetTestTitleFromExpression,
		});
		expect(testBlockDocComments[0].testBlockTags).toEqual({});
		expect(testBlockDocComments[1].testBlockTags).toEqual({
			'@beta': {
				testBlockName: 'test',
				testTitle: '@beta',
				type: 'standard',
				tags: undefined,
				name: '@beta',
				kind: 'modifier',
			},
		});
	});
});
