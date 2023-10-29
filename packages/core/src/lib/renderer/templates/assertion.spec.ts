import { test, expect } from 'vitest';
import { formatAssertion } from './assertion';
import { uiAssertionFactory } from '../../test-utils';
import { stripTabsAndNewlines } from '../../utils/string.utils';
import { statusToIconMap } from '../defaultValues';

test('format assertions', () => {
	const result = stripTabsAndNewlines(
		formatAssertion({
			assertion: uiAssertionFactory({
				tags: [
					{
						text: 'tag',
					},
				],
			}),
			statusMap: statusToIconMap,
		}),
	);
	expect(result).toEqual(
		expect.stringContaining(`<span class="assertion-title">assertion title</span>`),
	);
	expect(result).toEqual(expect.stringContaining(`<span class="tag">tag</span>`));
	expect(result).toEqual(expect.stringContaining(`<span aria-hidden="true" class="meta pass-tests">pass</span>`));
	expect(result).toEqual(expect.stringContaining(`<span class="sr-only">pass</span>`));
});
