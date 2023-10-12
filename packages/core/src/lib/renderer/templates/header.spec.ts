import { test, expect } from 'vitest';
import { stripTabsAndNewlines } from '../../utils/string.utils';
import { formatHeader } from './header';

test("format header", () => {
  const result = stripTabsAndNewlines(
    formatHeader({ title: "title"})
  );
  expect(result).toEqual(
    expect.stringContaining(
      `<header><h1>title</h1></header>`
    )
  )
})
