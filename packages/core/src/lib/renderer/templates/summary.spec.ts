import { test, expect } from 'vitest';
import { uiTestResultMetaFactory } from '../../test-utils';
import { stripTabsAndNewlines } from '../../utils/string.utils';
import { formatSummary } from './summary';

test("format summary", () => {
  const result = stripTabsAndNewlines(
    formatSummary({
      title: "title",
      meta: uiTestResultMetaFactory(),
    })
  );
  expect(result).toEqual(
    expect.stringContaining(
      `<summary class="test-summary">`
    )
  )
  expect(result).toEqual(
    expect.stringContaining(
      `<h2>title</h2>`
    )
  )
  expect(result).toEqual(
    expect.stringContaining(
      `<div class="test-summary-status"></div>`
    )
  )
})
