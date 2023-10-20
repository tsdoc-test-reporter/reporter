import { test, expect } from 'vitest';
import { TSDocParser } from '@microsoft/tsdoc';
import { coreDefaults } from '../defaults';
import { parseTestFiles } from './index';
import { testFileFactory } from '../test-utils/factory/test-file';
import { WithTestDocBlockComments } from '../types';
import { mockedGetTestTitleFromExpression } from '../test-utils';

type TestData = {
	filePath: string;
};

type TestDataOutput = WithTestDocBlockComments<TestData>;

test('parses test files', () => {
	const fileName = 'test-file-parser.ts';
	expect(
		parseTestFiles<TestData, TestDataOutput>({
			...coreDefaults,
			tsDocParser: new TSDocParser(),
			getTestTitleFromExpression: mockedGetTestTitleFromExpression,
			sourceFilesMap: {
				[fileName]: testFileFactory({
					fileName,
					options: [
						{
							testBlockName: 'test',
							testTitle: 'test title',
							tags: [
								{
									tagName: '@alpha',
								},
							],
						},
					],
				}),
			},
			filePath: 'filePath',
			result: [
				{
					filePath: fileName,
				},
			],
			resultMapper(result, testBlockComments) {
				return {
					...result,
					testBlockComments,
				};
			},
		}),
	).toEqual<TestDataOutput[]>([
		{
			filePath: fileName,
			testBlockComments: [
				{
					commentEndPosition: 19,
					commentStartPosition: 1,
					testBlockName: 'test',
					testFilePath: fileName,
					title: 'test title',
					type: 'test',
					testBlockTags: {
						'@alpha': {
							kind: 'modifier',
							name: '@alpha',
							testBlockName: 'test',
							testTitle: 'test title',
							type: 'standard',
						},
					},
				},
			],
		},
	]);
});
