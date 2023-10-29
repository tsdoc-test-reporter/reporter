import { test, expect } from '@jest/globals';

test('passing', () => {
	expect(true).toBeTruthy();
});

test('failing', () => {
	expect(true).toBeFalsy();
});
