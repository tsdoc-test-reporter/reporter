import { testBlockTagFactory, testDocBlockCommentFactory } from '../test-utils/factory';
import { aggregateTags, renderTag, renderTags } from './render.utils';

describe('renderTag', () => {
	test('format modifier', () => {
		expect(renderTag()('@alpha')).toEqual('<span class="tag">@alpha</span>');
	});

	test('format modifier without @-sign', () => {
		expect(renderTag({ removeAtSignOnTags: true })('@alpha')).toEqual(
			'<span class="tag">alpha</span>',
		);
	});

	test('format block tag with tag name', () => {
		expect(renderTag({ showTagNameOnBlockTags: true })('tag', '@remarks')).toEqual(
			'<span class="tag">@remarks: tag</span>',
		);
	});

	test('format block tag without tag name', () => {
		expect(renderTag()('tag', '@remarks')).toEqual('<span class="tag">tag</span>');
	});

	test('replace block tag with icon', () => {
		expect(renderTag({ tagTitleToIconMap: { tag: '👌🏼' } })('tag', '@remarks')).toEqual(
			'<span class="tag" aria-hidden="true">👌🏼</span><span class="sr-only">tag</span>',
		);
	});

	test('replace modifier with icon', () => {
		expect(renderTag({ tagTitleToIconMap: { '@alpha': '👌🏼' } })('@alpha')).toEqual(
			'<span class="tag" aria-hidden="true">👌🏼</span><span class="sr-only">@alpha</span>',
		);
	});
});

describe('renderTags', () => {
	test('format modifier', () => {
		expect(
			renderTags()(
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
			renderTags()(
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
			aggregateTags({ aggregateTagsToFileHeading: true })({
				testBlockComments: [
					testDocBlockCommentFactory({
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
					}),
				],
				ancestorTestBlockComments: [
					testDocBlockCommentFactory({
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
					}),
				],
			}),
		).toEqual('<span class="tag">@alpha</span><span class="tag">@beta</span>');
	});

	test('aggregate only ancestors', () => {
		expect(
			aggregateTags({ aggregateTagsToFileHeading: 'onlyAncestors' })({
				title: 'test',
				status: 'passed',
				ancestorTitles: ['ancestor'],
				testBlockComments: [
					testDocBlockCommentFactory({
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
					}),
				],
				ancestorTestBlockComments: [
					testDocBlockCommentFactory({
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
					}),
				],
			}),
		).toEqual('<span class="tag">@alpha</span>');
	});

	test('aggregate only test tags', () => {
		expect(
			aggregateTags({ aggregateTagsToFileHeading: 'withoutAncestors' })({
				title: 'test',
				status: 'passed',
				ancestorTitles: ['ancestor'],
				testBlockComments: [
					testDocBlockCommentFactory({
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
					}),
				],
				ancestorTestBlockComments: [
					testDocBlockCommentFactory({
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
					}),
				],
			}),
		).toEqual('<span class="tag">@beta</span>');
	});

	test('aggregate only selected tags', () => {
		expect(
			aggregateTags({ aggregateTagsToFileHeading: ['@beta'] })({
				title: 'test',
				status: 'passed',
				ancestorTitles: ['ancestor'],
				testBlockComments: [
					testDocBlockCommentFactory({
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
					}),
				],
				ancestorTestBlockComments: [
					testDocBlockCommentFactory({
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
					}),
				],
			}),
		).toEqual('<span class="tag">@beta</span>');
	});
});
