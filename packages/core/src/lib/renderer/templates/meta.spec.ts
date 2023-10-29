import { test, expect } from 'vitest';
import { uiTestResultMetaFactory } from '../../test-utils';
import { stripTabsAndNewlines } from '../../utils/string.utils';
import { formatMeta } from './meta';

test('format meta with no tests', () => {
	const result = stripTabsAndNewlines(formatMeta({ meta: uiTestResultMetaFactory() }));
	expect(result).toEqual(expect.stringContaining(`<div class="test-summary-status"></div>`));
});

test('format meta with passed', () => {
	const result = stripTabsAndNewlines(
		formatMeta({
			meta: uiTestResultMetaFactory({
				passed: 1,
			}),
		}),
	);
	expect(result).toEqual(
		expect.stringContaining(
			`<span aria-hidden="true">Pass: 1</span><span class="sr-only">Passing tests: 1, </span>`,
		),
	);
});

test('format meta with skipped', () => {
	const result = stripTabsAndNewlines(
		formatMeta({
			meta: uiTestResultMetaFactory({
				skipped: 1,
			}),
		}),
	);
	expect(result).toEqual(
		expect.stringContaining(
			`<span aria-hidden="true">Skip: 1</span><span class="sr-only">Skipped tests: 1, </span>`,
		),
	);
});

test('format meta with failed', () => {
	const result = stripTabsAndNewlines(
		formatMeta({
			meta: uiTestResultMetaFactory({
				failed: 1,
			}),
		}),
	);
	expect(result).toEqual(
		expect.stringContaining(
			`<span aria-hidden="true">Fail: 1</span><span class="sr-only">Failing tests: 1, </span>`,
		),
	);
});

test('format meta with todo', () => {
	const result = stripTabsAndNewlines(
		formatMeta({
			meta: uiTestResultMetaFactory({
				todo: 1,
			}),
		}),
	);
	expect(result).toEqual(
		expect.stringContaining(
			`<span aria-hidden="true">Todo: 1</span><span class="sr-only">Todo tests: 1, </span>`,
		),
	);
});
