import { test, expect } from 'vitest';
import { uiTagFactory } from '../../test-utils';
import { stripTabsAndNewlines } from '../../utils/string.utils';
import { formatTag } from './tag';

test('format tag', () => {
	const result = stripTabsAndNewlines(
		formatTag({
			tag: uiTagFactory({
				text: 'tag content',
				type: 'test',
			}),
		}),
	);
	expect(result).toEqual(expect.stringContaining(`<span class="tag">tag content</span>`));
});

test('format tag with icon', () => {
	const result = stripTabsAndNewlines(
		formatTag({
			tag: uiTagFactory({
				text: 'tag content',
				type: 'test',
				icon: '🎉',
			}),
		}),
	);
	expect(result).toEqual(
		expect.stringContaining(
			`<span class="sr-only">tag content</span><span class="tag" aria-hidden="true">🎉</span>`,
		),
	);
});
