import { describe, test, expect } from 'vitest';
import { attachTestBlockComments, isSuite, isTest } from './vitest.utils';
import { taskFactory } from '../../test-utils';
import {
	TestBlockDocComment,
	TestBlockTag,
	TestBlockTagMap,
	testDocBlockCommentFactory,
} from '@tsdoc-test-reporter/core';
import { TaggedTask } from '../../types';

/**
 * @remarks unit
 */
describe('isSuite', () => {
	test('is suite', () => {
		expect(
			isSuite(
				taskFactory({
					type: 'suite',
				}),
			),
		).toBeTruthy();
	});
	test('is not suite', () => {
		expect(
			isSuite(
				taskFactory({
					type: 'test',
				}),
			),
		).toBeFalsy();
	});
});

/**
 * @remarks unit
 */
describe('isTest', () => {
	test('is test', () => {
		expect(
			isTest(
				taskFactory({
					type: 'test',
				}),
			),
		).toBeTruthy();
	});
	test('is not test', () => {
		expect(
			isTest(
				taskFactory({
					type: 'suite',
				}),
			),
		).toBeFalsy();
	});
});

/**
 * @remarks unit
 */
describe('attachTestBlockComments', () => {
	test('attach tags from tasks without nesting', () => {
		expect(
			attachTestBlockComments(
				[
					taskFactory({
						name: 'test name',
						type: 'test',
					}),
				],
				[
					testDocBlockCommentFactory({
						title: 'test name',
						type: 'test',
						testBlockName: 'test',
						testBlockTags: {
							'@alpha': {
								testTitle: 'test name',
								kind: 'modifier',
								type: 'standard',
								testBlockName: 'test',
								name: '@alpha',
							},
						},
					}),
				],
			),
		).toEqual([
			expect.objectContaining<Partial<TaggedTask>>({
				testBlockComments: [
					expect.objectContaining<Partial<TestBlockDocComment>>({
						title: 'test name',
						type: 'test',
						testBlockName: 'test',
						testBlockTags: expect.objectContaining<TestBlockTagMap>({
							'@alpha': expect.objectContaining<Partial<TestBlockTag>>({
								name: '@alpha',
								testTitle: 'test name',
								kind: 'modifier',
								type: 'standard',
								testBlockName: 'test',
							}),
						}),
					}),
				],
			}),
		]);
	});

	test('attach tags from tasks with nesting', () => {
		expect(
			attachTestBlockComments(
				[
					taskFactory({
						name: 'suite name',
						type: 'suite',
						tasks: [
							{
								name: 'test name',
								type: 'test',
							},
						],
					}),
				],
				[
					testDocBlockCommentFactory({
						title: 'suite name',
						type: 'ancestor',
						testBlockName: 'describe',
						testBlockTags: {
							'@beta': {
								testTitle: 'suite name',
								kind: 'modifier',
								type: 'standard',
								testBlockName: 'describe',
								name: '@beta',
							},
						},
					}),
					testDocBlockCommentFactory({
						title: 'test name',
						type: 'test',
						testBlockName: 'test',
						testBlockTags: {
							'@alpha': {
								testTitle: 'test name',
								kind: 'modifier',
								type: 'standard',
								testBlockName: 'test',
								name: '@alpha',
							},
						},
					}),
				],
			),
		).toEqual([
			expect.objectContaining<Partial<TaggedTask>>({
				testBlockComments: [
					expect.objectContaining<Partial<TestBlockDocComment>>({
						title: 'suite name',
						type: 'ancestor',
						testBlockName: 'describe',
						testBlockTags: expect.objectContaining({
							'@beta': expect.objectContaining<Partial<TestBlockTag>>({
								name: '@beta',
								testTitle: 'suite name',
								kind: 'modifier',
								type: 'standard',
								testBlockName: 'describe',
							}),
						}),
					}),
				],
				tasks: [
					expect.objectContaining<Partial<TaggedTask>>({
						testBlockComments: [
							expect.objectContaining<Partial<TestBlockDocComment>>({
								title: 'test name',
								type: 'test',
								testBlockName: 'test',
								testBlockTags: expect.objectContaining({
									'@alpha': expect.objectContaining<Partial<TestBlockTag>>({
										name: '@alpha',
										testTitle: 'test name',
										kind: 'modifier',
										type: 'standard',
										testBlockName: 'test',
									}),
								}),
							}),
						],
					}),
				],
			}),
		]);
	});
});
