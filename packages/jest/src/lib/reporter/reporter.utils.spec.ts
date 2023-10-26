import { test, expect } from 'vitest';
import { resultMapper } from './reporter.utils';
import { testResultFactory } from '../test-utils/factory';
import { TestBlockDocComment, testDocBlockCommentFactory } from '@tsdoc-test-reporter/core';
import { TaggedAssertionResult, TaggedTestResult } from '../types';

test('maps doc comments to result', () => {
	expect(
		resultMapper(
			testResultFactory({
				testFilePath: 'test-file-path.ts',
				testResults: [
					{
						title: 'test title',
						ancestorTitles: ['ancestor title'],
					},
				],
			}),
			[
				testDocBlockCommentFactory({
					testBlockName: 'describe',
					title: 'ancestor title',
					type: 'ancestor',
					testFilePath: 'test-file-path.ts',
				}),
				testDocBlockCommentFactory({
					testBlockName: 'test',
					title: 'test title',
					type: 'test',
					testFilePath: 'test-file-path.ts',
				}),
			],
		),
	).toEqual<TaggedTestResult>(
		expect.objectContaining<Partial<TaggedTestResult>>({
			testFilePath: 'test-file-path.ts',
			testResults: [
				expect.objectContaining<Partial<TaggedAssertionResult>>({
					title: 'test title',
					testBlockComments: [
						expect.objectContaining<Partial<TestBlockDocComment>>({
							testBlockName: 'describe',
							testFilePath: 'test-file-path.ts',
							type: 'ancestor',
							title: 'ancestor title',
						}),
						expect.objectContaining<Partial<TestBlockDocComment>>({
							testBlockName: 'test',
							testFilePath: 'test-file-path.ts',
							type: 'test',
							title: 'test title',
						}),
					],
				}),
			],
		}),
	);
});
