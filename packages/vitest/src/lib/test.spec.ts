import { expect, test } from 'vitest';

describe('describe', () => {
	test('thing', () => {
		expect(true).toBe(true);
	});
});

/**
 * @beta
 */
test('thing', () => {
	expect(true).toBe(true);
});
