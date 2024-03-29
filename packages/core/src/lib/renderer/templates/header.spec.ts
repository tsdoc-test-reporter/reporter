import { test, expect } from 'vitest';
import { stripTabsAndNewlines } from '../../utils/string.utils';
import { formatHeader } from './header';

test('format header', () => {
	const result = stripTabsAndNewlines(formatHeader({ title: 'title' }));
	expect(result).toEqual(expect.stringContaining(`<header class=""><h1>title</h1></header>`));
});

test('format header with build info', () => {
	const result = stripTabsAndNewlines(
		formatHeader({
			title: 'title',
			buildInfo: {
				text: 'text',
				url: 'https://example.com',
			},
		}),
	);
	expect(result).toEqual(
		expect.stringContaining(
			`<header class=""><h1>title</h1><a class="info build-info" href="https://example.com" rel="noreferrer" target="_blank">`,
		),
	);
	expect(result).toEqual(expect.stringContaining(`text`));
});
