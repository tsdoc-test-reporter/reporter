import { test, expect } from 'vitest';
import { uiTagFactory, uiTestResultMetaFactory } from '../../test-utils';
import { stripTabsAndNewlines } from '../../utils/string.utils';
import { formatSummary } from './summary';

test('format summary', () => {
	const result = stripTabsAndNewlines(
		formatSummary({
			title: 'title',
			meta: uiTestResultMetaFactory(),
		}),
	);
	expect(result).toEqual(expect.stringContaining(`<summary class="test-summary">`));
	expect(result).toEqual(expect.stringContaining(`<h2>title</h2>`));
	expect(result).toEqual(expect.stringContaining(`<div class="test-summary-status"></div>`));
});

test('format summary with aggregated tags', () => {
	const result = stripTabsAndNewlines(
		formatSummary({
			title: 'title',
			meta: uiTestResultMetaFactory(),
			tags: [
				uiTagFactory({
					text: 'tag',
					type: 'test',
				}),
			],
		}),
	);
	expect(result).toEqual(expect.stringContaining(`<summary class="test-summary">`));
	expect(result).toEqual(expect.stringContaining(`<h2>title</h2>`));
	expect(result).toEqual(expect.stringContaining(`<div class="test-summary-status"></div>`));
	expect(result).toEqual(expect.stringContaining(`<span class="tag">tag</span>`));
});
