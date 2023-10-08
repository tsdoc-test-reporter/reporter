import { testBlockTagFactory } from '@tsdoc-test-reporter/core';
import { aggregateTags, aggregateTagsForResults, formatTag, formatTestBlockTag } from './utils';
import { taggedAssertionResultFactory } from '../test-utils/factory';

describe('formatTag', () => {
	test('format modifier', () => {
		expect(formatTag()('@alpha')).toEqual('<span class="tag">@alpha</span>');
	});

	test('format modifier without @-sign', () => {
		expect(formatTag({ removeAtSignOnTags: true })('@alpha')).toEqual(
			'<span class="tag">alpha</span>',
		);
	});

	test('format block tag with tag name', () => {
		expect(formatTag({ showTagNameOnBlockTags: true })('tag', '@remarks')).toEqual(
			'<span class="tag">@remarks: tag</span>',
		);
	});

	test('format block tag without tag name', () => {
		expect(formatTag()('tag', '@remarks')).toEqual('<span class="tag">tag</span>');
	});

	test('replace block tag with icon', () => {
		expect(formatTag({ tagTitleToIconMap: { tag: '👌🏼' } })('tag', '@remarks')).toEqual(
			'<span class="tag" aria-hidden="true">👌🏼</span><span class="sr-only">tag</span>',
		);
	});

	test('replace modifier with icon', () => {
		expect(formatTag({ tagTitleToIconMap: { '@alpha': '👌🏼' } })('@alpha')).toEqual(
			'<span class="tag" aria-hidden="true">👌🏼</span><span class="sr-only">@alpha</span>',
		);
	});
});

describe('formatTestBlockTag', () => {
	test('format modifier', () => {
		expect(
			formatTestBlockTag()(
				testBlockTagFactory({
					testBlockName: 'test',
					testTitle: 'test',
					name: '@alpha',
					type: 'standard',
					kind: 'modifier',
				}),
			),
		).toEqual('<span class="tag">@alpha</span>');
	});

	test('format block', () => {
		expect(
			formatTestBlockTag()(
				testBlockTagFactory({
					testBlockName: 'test',
					testTitle: 'test',
					name: '@remarks',
					tags: ['unit', 'acceptance'],
					type: 'standard',
					kind: 'block',
				}),
			),
		).toEqual('<span class="tag">unit</span><span class="tag">acceptance</span>');
	});
});

describe('aggregateTags', () => {
	test('aggregate both ancestors and test tags', () => {
		expect(
			aggregateTags({ aggregateTagsToFileHeading: true })(
				taggedAssertionResultFactory({
					title: 'test',
					status: 'passed',
					ancestorTitles: ['ancestor'],
					testBlockComments: [
						{
							title: 'test',
							testFilePath: 'test.ts',
							testBlockName: 'test',
							testBlockTags: {
								'@beta': {
									name: '@beta',
									testBlockName: 'test',
									testTitle: 'test',
									type: 'standard',
									kind: 'modifier',
								},
							},
						},
					],
					ancestorTestBlockComments: [
						{
							title: 'ancestor',
							testFilePath: 'test.ts',
							testBlockName: 'describe',
							testBlockTags: {
								'@alpha': {
									name: '@alpha',
									testBlockName: 'describe',
									testTitle: 'ancestor',
									type: 'standard',
									kind: 'modifier',
								},
							},
						},
					],
				}),
			),
		).toEqual('<span class="tag">@alpha</span><span class="tag">@beta</span>');
	});

	test('do not aggregate duplicates', () => {
		const result = taggedAssertionResultFactory({
			title: 'test',
			status: 'passed',
			ancestorTitles: ['ancestor'],
			testBlockComments: [
				{
					title: 'test',
					testFilePath: 'test.ts',
					testBlockName: 'test',
					testBlockTags: {
						'@beta': {
							name: '@beta',
							testBlockName: 'test',
							testTitle: 'test',
							type: 'standard',
							kind: 'modifier',
						},
					},
				},
			],
			ancestorTestBlockComments: [
				{
					title: 'ancestor',
					testFilePath: 'test.ts',
					testBlockName: 'describe',
					testBlockTags: {
						'@alpha': {
							name: '@alpha',
							testBlockName: 'describe',
							testTitle: 'ancestor',
							type: 'standard',
							kind: 'modifier',
						},
					},
				},
			],
		})
		expect(
			aggregateTagsForResults(
				[
					result,
					result,
				]
			, { aggregateTagsToFileHeading: true })
		).toEqual('<span class="tag">@alpha</span><span class="tag">@beta</span>');
	});

	test('aggregate only ancestors', () => {
		expect(
			aggregateTags({ aggregateTagsToFileHeading: 'onlyAncestors' })(
				taggedAssertionResultFactory({
					title: 'test',
					status: 'passed',
					ancestorTitles: ['ancestor'],
					testBlockComments: [
						{
							title: 'test',
							testFilePath: 'test.ts',
							testBlockName: 'test',
							testBlockTags: {
								'@beta': {
									name: '@beta',
									testBlockName: 'test',
									testTitle: 'test',
									type: 'standard',
									kind: 'modifier',
								},
							},
						},
					],
					ancestorTestBlockComments: [
						{
							title: 'ancestor',
							testFilePath: 'test.ts',
							testBlockName: 'describe',
							testBlockTags: {
								'@alpha': {
									name: '@alpha',
									testBlockName: 'describe',
									testTitle: 'ancestor',
									type: 'standard',
									kind: 'modifier',
								},
							},
						},
					],
				}),
			),
		).toEqual('<span class="tag">@alpha</span>');
	});

	test('aggregate only test tags', () => {
		expect(
			aggregateTags({ aggregateTagsToFileHeading: 'withoutAncestors' })(
				taggedAssertionResultFactory({
					title: 'test',
					status: 'passed',
					ancestorTitles: ['ancestor'],
					testBlockComments: [
						{
							title: 'test',
							testFilePath: 'test.ts',
							testBlockName: 'test',
							testBlockTags: {
								'@beta': {
									name: '@beta',
									testBlockName: 'test',
									testTitle: 'test',
									type: 'standard',
									kind: 'modifier',
								},
							},
						},
					],
					ancestorTestBlockComments: [
						{
							title: 'ancestor',
							testFilePath: 'test.ts',
							testBlockName: 'describe',
							testBlockTags: {
								'@alpha': {
									name: '@alpha',
									testBlockName: 'describe',
									testTitle: 'ancestor',
									type: 'standard',
									kind: 'modifier',
								},
							},
						},
					],
				}),
			),
		).toEqual('<span class="tag">@beta</span>');
	});

	test('aggregate only selected tags', () => {
		expect(
			aggregateTags({ aggregateTagsToFileHeading: ['@beta'] })(
				taggedAssertionResultFactory({
					title: 'test',
					status: 'passed',
					ancestorTitles: ['ancestor'],
					testBlockComments: [
						{
							title: 'test',
							testFilePath: 'test.ts',
							testBlockName: 'test',
							testBlockTags: {
								'@beta': {
									name: '@beta',
									testBlockName: 'test',
									testTitle: 'test',
									type: 'standard',
									kind: 'modifier',
								},
							},
						},
					],
					ancestorTestBlockComments: [
						{
							title: 'ancestor',
							testFilePath: 'test.ts',
							testBlockName: 'describe',
							testBlockTags: {
								'@alpha': {
									name: '@alpha',
									testBlockName: 'describe',
									testTitle: 'ancestor',
									type: 'standard',
									kind: 'modifier',
								},
							},
						},
					],
				}),
			),
		).toEqual('<span class="tag">@beta</span>');
	});
});
