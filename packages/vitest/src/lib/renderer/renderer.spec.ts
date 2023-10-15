import { test, expect, describe } from 'vitest';
import { UIAssertion, UITestResult, testDocBlockCommentFactory } from '@tsdoc-test-reporter/core';
import { taggedFileFactory, taggedSuiteFactory, taggedTestFactory } from '../../test-utils';
import { aggregateAssertions, toUITestResult } from './index';

describe('aggregate assertions', () => {
	test('tasks to assertions', () => {
		expect(
			aggregateAssertions(
				[
					taggedTestFactory({
						name: 'test name',
						result: {
							state: 'pass',
						},
						testBlockComments: [
							testDocBlockCommentFactory({
								title: 'test name',
								testBlockName: 'test',
								testBlockTags: {
									'@alpha': {
										kind: 'modifier',
										name: '@alpha',
										testTitle: 'test name',
										testBlockName: 'test',
										type: 'standard',
									},
								},
							}),
						],
					}),
				],
				[],
				[],
			),
		).toEqual<UIAssertion[]>([
			{
				ancestorTitles: [],
				status: 'pass',
				title: 'test name',
				tags: [
					{
						type: 'test',
						text: '@alpha',
						name: "@alpha",
						icon: undefined,
					},
				],
			},
		]);
	});

	test('suites and tasks to assertions', () => {
		expect(
			aggregateAssertions(
				[
					taggedSuiteFactory({
						name: 'describe name',
						testBlockComments: [
							testDocBlockCommentFactory({
								title: 'describe name',
								testBlockName: 'describe',
								type: 'ancestor',
								testBlockTags: {
									'@alpha': {
										kind: 'modifier',
										name: '@alpha',
										testTitle: 'describe name',
										testBlockName: 'describe',
										type: 'standard',
									},
								},
							}),
						],
						tasks: [
							{
								name: 'test name',
								testBlockComments: [
									testDocBlockCommentFactory({
										title: 'test name',
										testBlockName: 'test',
										testBlockTags: {
											'@beta': {
												kind: 'modifier',
												name: '@beta',
												testTitle: 'test name',
												testBlockName: 'test',
												type: 'standard',
											},
										},
									}),
								],
							},
						],
					}),
				],
				[],
				[],
			),
		).toEqual<UIAssertion[]>([
			{
				ancestorTitles: ['describe name'],
				status: 'pass',
				title: 'test name',
				tags: [
					{
						type: 'test',
						text: '@beta',
						name: "@beta",
						icon: undefined,
					},
					{
						type: 'ancestor',
						text: '@alpha',
						name: "@alpha",
						icon: undefined,
					},
				],
			},
		]);
	});

	test('suites and tasks to assertions when hideAncestorTags: true', () => {
		expect(
			aggregateAssertions(
				[
					taggedSuiteFactory({
						name: 'describe name',
						testBlockComments: [
							testDocBlockCommentFactory({
								title: 'describe name',
								testBlockName: 'describe',
								type: 'ancestor',
								testBlockTags: {
									'@alpha': {
										kind: 'modifier',
										name: '@alpha',
										testTitle: 'describe name',
										testBlockName: 'describe',
										type: 'standard',
									},
								},
							}),
						],
						tasks: [
							{
								name: 'test name',
								testBlockComments: [
									testDocBlockCommentFactory({
										title: 'test name',
										testBlockName: 'test',
										testBlockTags: {
											'@beta': {
												kind: 'modifier',
												name: '@beta',
												testTitle: 'test name',
												testBlockName: 'test',
												type: 'standard',
											},
										},
									}),
								],
							},
						],
					}),
				],
				[],
				[],
				{ hideAncestorTags: true },
			),
		).toEqual<UIAssertion[]>([
			{
				ancestorTitles: ['describe name'],
				status: 'pass',
				title: 'test name',
				tags: [
					{
						type: 'test',
						text: '@beta',
						name: "@beta",
						icon: undefined,
					},
				],
			},
		]);
	});
});

describe('ui result', () => {
	test('convert to ui result', () => {
		expect(
			toUITestResult({ aggregateTagsToFileHeading: true, })(
				taggedFileFactory({
					name: 'file name',
					filepath: 'test-file-path.ts',
					tasks: [
						{
							type: 'test',
							name: 'test name',
							result: {
								state: 'pass',
							},
							testBlockComments: [
								{
									testBlockName: 'test',
									type: 'test',
									testBlockTags: {
										'@alpha': {
											name: '@alpha',
											testBlockName: 'test',
											testTitle: 'test name',
											type: 'standard',
											kind: 'modifier',
										},
									},
								},
							],
						},
					],
				}),
			),
		).toEqual<UITestResult>({
			aggregatedTags: [
				{
					icon: undefined,
					text: '@alpha',
					type: 'test',
					name: "@alpha",
				},
			],
			assertions: [
				{
					title: 'test name',
					ancestorTitles: [],
					status: 'pass',
					tags: [
						{
							icon: undefined,
							text: '@alpha',
							type: 'test',
							name: "@alpha",
						},
					],
				},
			],
			meta: {
				failed: 0,
				passed: 1,
				skipped: 0,
				todo: 0,
			},
			title: 'test-file-path.ts',
		});
	});

	test('convert nested to ui result', () => {
		expect(
			toUITestResult({ aggregateTagsToFileHeading: true })(
				taggedFileFactory({
					name: 'file name',
					filepath: 'test-file-path.ts',
					tasks: [
						{
							type: 'suite',
							name: 'describe name',
							testBlockComments: [
								{
									testBlockName: 'describe',
									type: 'ancestor',
									testBlockTags: {
										'@beta': {
											name: '@beta',
											testBlockName: 'describe',
											testTitle: 'describe name',
											type: 'standard',
											kind: 'modifier',
										},
									},
								},
							],
							tasks: [
								{
									type: 'test',
									name: 'test name',
									result: {
										state: 'pass',
									},
									testBlockComments: [
										{
											testBlockName: 'test',
											type: 'test',
											testBlockTags: {
												'@alpha': {
													name: '@alpha',
													testBlockName: 'test',
													testTitle: 'test name',
													type: 'standard',
													kind: 'modifier',
												},
											},
										},
									],
								},
							],
						},
					],
				}),
			),
		).toEqual<UITestResult>({
			aggregatedTags: [
				{
					icon: undefined,
					text: '@alpha',
					type: 'test',
					name: "@alpha",
				},
				{
					icon: undefined,
					text: '@beta',
					type: 'ancestor',
					name: "@beta",
				},
			],
			assertions: [
				{
					title: 'test name',
					ancestorTitles: ['describe name'],
					status: 'pass',
					tags: [
						{
							icon: undefined,
							text: '@alpha',
							type: 'test',
							name: "@alpha",
						},
						{
							icon: undefined,
							text: '@beta',
							type: 'ancestor',
							name: "@beta",
						},
					],
				},
			],
			meta: {
				failed: 0,
				passed: 1,
				skipped: 0,
				todo: 0,
			},
			title: 'test-file-path.ts',
		});
	});
});
