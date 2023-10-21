# @tsdoc-test-reporter/vitest

TSDoc Test Reporter for Vitest

## Installing

```bash
npm install @tsdoc-test-reporter/vitest
```

## Usage

1. Add reporter to config (`vite.config.ts`)

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
	test: {
		reporters: ['@tsdoc-test-reporter/vitest'],
	},
});
```

2. Add TSDoc comments to a test of your choice:

```ts
/**
 * @remarks WCAG Criteria
 */
test('get correct background color based on text color', () => {
	expect(true).toBe(true);
});
```

3. Run tests (`vitest run`)
4. Open the newly generated file `tsdoc-test-reporter-report.html` in the browser of your choice

## Testing

```bash
pnpm nx test vitest
```
