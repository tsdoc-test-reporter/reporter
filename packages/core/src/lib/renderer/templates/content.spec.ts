import { test, expect } from 'vitest';
import { uiAssertionFactory } from '../../test-utils';
import { stripTabsAndNewlines } from '../../utils/string.utils';
import { statusToIconMap } from '../defaultValues';
import { formatContent } from './content';

test('format content', () => {
	const result = stripTabsAndNewlines(
		formatContent({
			assertions: [
				uiAssertionFactory({
					tags: [
						{
							text: 'tag',
						},
					],
				}),
			],
			statusMap: statusToIconMap,
		}),
	);
	expect(result).toEqual(expect.stringContaining(`<div class="test-assertions"><ul>`));
	expect(result).toEqual(
		expect.stringContaining(`<span class="assertion-title">assertion title</span>`),
	);
	expect(result).toEqual(expect.stringContaining(`<span class="tag">tag</span>`));
	expect(result).toEqual(expect.stringContaining(`<span aria-hidden="true">✅</span>`));
	expect(result).toEqual(expect.stringContaining(`<span class="sr-only">pass</span>`));
});
