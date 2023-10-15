import { test, expect } from 'vitest';
import { uiTestResultFactory } from '../../test-utils';
import { stripTabsAndNewlines } from '../../utils/string.utils';
import { statusToIconMap } from '../defaultValues';
import { formatResults } from './results';

test('format results', () => {
	const result = stripTabsAndNewlines(
		formatResults({
			results: [uiTestResultFactory()],
			statusMap: statusToIconMap,
		}),
	);
	expect(result).toEqual(expect.stringContaining(`<details class="test-details">`));
	expect(result).toEqual(expect.stringContaining(`<h2>test result title</h2>`));
	expect(result).toEqual(expect.stringContaining(`<div class="test-assertions"><ul></ul></div`));
	expect(result).toEqual(expect.stringContaining(`</details>`));
});
