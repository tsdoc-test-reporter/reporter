import { test, describe, expect, vi } from 'vitest';
import {
	aggregateMeta,
	aggregateTags,
	formatTitle,
	getRenderOutput,
	getTagsFromTestBlockComments,
	render,
} from './index';
import { UITag, UITestResultMeta } from '../types';
import { testDocBlockCommentFactory } from '../test-utils/factory';

describe('aggregate tags', () => {
	test('should remove duplicates', () => {
		expect(
			aggregateTags(
				[
					{
						title: 'title',
						status: 'pass',
						tags: [
							{
								text: '@alpha',
								type: 'test',
								name: '@alpha',
							},
						],
					},
					{
						title: 'title',
						status: 'pass',
						tags: [
							{
								text: '@alpha',
								type: 'test',
								name: '@alpha',
							},
						],
					},
				],
				false,
			),
		).toEqual<UITag[]>([
			{
				text: '@alpha',
				type: 'test',
				name: '@alpha',
			},
		]);
	});

	test('should only aggregate ancestors', () => {
		expect(
			aggregateTags(
				[
					{
						title: 'title',
						status: 'pass',
						tags: [
							{
								text: '@alpha',
								type: 'test',
								name: '@alpha',
							},
						],
					},
					{
						title: 'title',
						status: 'pass',
						tags: [
							{
								text: '@beta',
								type: 'ancestor',
								name: '@beta',
							},
						],
					},
				],
				'onlyAncestors',
			),
		).toEqual<UITag[]>([
			{
				text: '@beta',
				type: 'ancestor',
				name: '@beta',
			},
		]);
	});

	test('should only aggregate without ancestors', () => {
		expect(
			aggregateTags(
				[
					{
						title: 'title',
						status: 'pass',
						tags: [
							{
								text: '@alpha',
								type: 'test',
								name: '@alpha',
							},
						],
					},
					{
						title: 'title',
						status: 'pass',
						tags: [
							{
								text: '@beta',
								type: 'ancestor',
								name: '@beta',
							},
						],
					},
				],
				'withoutAncestors',
			),
		).toEqual<UITag[]>([
			{
				text: '@alpha',
				type: 'test',
				name: '@alpha',
			},
		]);
	});

	test('should only aggregate certain tags', () => {
		expect(
			aggregateTags(
				[
					{
						title: 'title',
						status: 'pass',
						tags: [
							{
								text: '@alpha',
								type: 'test',
								name: '@alpha',
							},
						],
					},
					{
						title: 'title',
						status: 'pass',
						tags: [
							{
								text: '@beta',
								type: 'ancestor',
								name: '@beta',
							},
						],
					},
				],
				['@alpha'],
			),
		).toEqual<UITag[]>([
			{
				text: '@alpha',
				type: 'test',
				name: '@alpha',
			},
		]);
	});
});

describe('format title', () => {
	test('format custom title', () => {
		expect(formatTitle('title', (t) => t + '!')).toEqual('title!');
	});
});

describe('aggregate meta', () => {
	test('no values when no assertions', () => {
		expect(aggregateMeta([])).toEqual<UITestResultMeta>({
			passed: 0,
			todo: 0,
			skipped: 0,
			failed: 0,
		});
	});

	test('aggregates assertions', () => {
		expect(
			aggregateMeta([
				{
					title: 'title',
					status: 'fail',
					tags: [],
				},
				{
					title: 'title',
					status: 'pass',
					tags: [],
				},
				{
					title: 'title',
					status: 'skip',
					tags: [],
				},
				{
					title: 'title',
					status: 'todo',
					tags: [],
				},
			]),
		).toEqual<UITestResultMeta>({
			passed: 1,
			todo: 1,
			skipped: 1,
			failed: 1,
		});
	});
});

describe('get tags from test block comments', () => {
	test('get tags', () => {
		expect(
			getTagsFromTestBlockComments([
				testDocBlockCommentFactory({
					testBlockName: 'test',
					testFilePath: 'file-path.ts',
					type: 'test',
					title: 'title',
					testBlockTags: {
						'@alpha': {
							type: 'standard',
							kind: 'modifier',
							name: '@alpha',
							testBlockName: 'test',
							testTitle: 'title',
						},
					},
				}),
				testDocBlockCommentFactory({
					testBlockName: 'describe',
					testFilePath: 'file-path.ts',
					type: 'ancestor',
					title: 'describe title',
					testBlockTags: {
						'@beta': {
							type: 'standard',
							kind: 'modifier',
							name: '@beta',
							testBlockName: 'describe',
							testTitle: 'describe title',
						},
					},
				}),
				testDocBlockCommentFactory({
					testBlockName: 'describe',
					testFilePath: 'file-path.ts',
					type: 'ancestor',
					title: 'describe title',
					testBlockTags: {
						'@remarks': {
							type: 'standard',
							kind: 'block',
							tags: ['tag'],
							name: '@remarks',
							testBlockName: 'describe',
							testTitle: 'describe title',
						},
					},
				}),
			]),
		).toEqual<UITag[]>([
			{
				text: '@alpha',
				type: 'test',
				icon: undefined,
				name: '@alpha',
			},
			{
				text: '@beta',
				type: 'ancestor',
				icon: undefined,
				name: '@beta',
			},
			{
				text: 'tag',
				type: 'ancestor',
				icon: undefined,
				name: '@remarks',
			},
		]);
	});

	test('show tag name on block tags options', () => {
		expect(
			getTagsFromTestBlockComments(
				[
					testDocBlockCommentFactory({
						testBlockName: 'test',
						testFilePath: 'file-path.ts',
						type: 'test',
						title: 'title',
						testBlockTags: {
							'@remarks': {
								type: 'standard',
								kind: 'block',
								tags: ['tag'],
								name: '@remarks',
								testBlockName: 'test',
								testTitle: 'title',
							},
						},
					}),
				],
				{ showTagNameOnBlockTags: true },
			),
		).toEqual<UITag[]>([
			{
				text: '@remarks: tag',
				type: 'test',
				icon: undefined,
				name: '@remarks',
			},
		]);
	});

	test('remove @ sign when option is passed', () => {
		expect(
			getTagsFromTestBlockComments(
				[
					testDocBlockCommentFactory({
						testBlockName: 'test',
						testFilePath: 'file-path.ts',
						type: 'test',
						title: 'title',
						testBlockTags: {
							'@alpha': {
								type: 'standard',
								kind: 'modifier',
								name: '@alpha',
								testBlockName: 'test',
								testTitle: 'title',
							},
						},
					}),
				],
				{ removeAtSignOnTags: true },
			),
		).toEqual<UITag[]>([
			{
				text: 'alpha',
				type: 'test',
				icon: undefined,
				name: '@alpha',
			},
		]);
	});

	test('map icon to tag text', () => {
		expect(
			getTagsFromTestBlockComments(
				[
					testDocBlockCommentFactory({
						testBlockName: 'test',
						testFilePath: 'file-path.ts',
						type: 'test',
						title: 'title',
						testBlockTags: {
							'@alpha': {
								type: 'standard',
								kind: 'modifier',
								name: '@alpha',
								testBlockName: 'test',
								testTitle: 'title',
							},
						},
					}),
				],
				{ tagTitleToIconMap: { '@alpha': '🎉' } },
			),
		).toEqual<UITag[]>([
			{
				text: '@alpha',
				type: 'test',
				icon: '🎉',
				name: '@alpha',
			},
		]);
	});
});

describe('render', () => {
	test('should render html tags', () => {
		expect(render([])).toEqual(expect.stringContaining('<!doctype html>'));
		expect(render([])).toEqual(expect.stringContaining('</html>'));
		expect(render([])).toEqual(expect.stringContaining('<html lang="en">'));
	});
	test('should render title', () => {
		expect(render([])).toEqual(expect.stringContaining('Test Results'));
	});

	test('should render body and main tags', () => {
		expect(render([])).toEqual(expect.stringContaining('<body>'));
		expect(render([])).toEqual(expect.stringContaining('</body>'));
		expect(render([])).toEqual(expect.stringContaining('<main>'));
		expect(render([])).toEqual(expect.stringContaining('</main>'));
	});
	test('should render title', () => {
		expect(render([])).toEqual(expect.stringContaining('<h1>Test Results</h1>'));
	});

	test('should render custom title', () => {
		expect(render([], { title: 'Custom title' })).toEqual(
			expect.stringContaining('<h1>Custom title</h1>'),
		);
	});
});

test('should call onBeforeRender when supplied', () => {
	type TestData = {
		name: string;
	};
	const testData: TestData[] = [{ name: 'name' }];
	const onBeforeRender = vi.fn(() => []);
	const getRenderData = () => [];
	getRenderOutput(testData, getRenderData, {
		onBeforeRender,
	});
	expect(onBeforeRender).toHaveBeenCalled();
});
