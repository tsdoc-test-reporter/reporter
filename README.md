![social_preview](https://github.com/tsdoc-test-reporter/reporter/assets/21122051/5c8bb5cd-5772-47d2-8264-cc43cf5886ca)

# @tsdoc-test-reporter

**@tsdoc-test-reporter** is a test reporter that attaches [TSDoc](https://tsdoc.org/) comments to your test results. It enables you to attach metadata to your unit tests in the form of comments.

## Output

**[Example output from the reporter](https://tsdoc-test-reporter.github.io/kitchen-sink/)**

## Features

- Supports: **Jest** and **Vitest**
- Parses _JSDoc_ and extended _TSDoc_ tags
- Outputs: **JSON** or **HTML**
- `block` and `modifier` tags (no `inline` tag support yet)
- Specifying which test blocks should be parsed (`it`/`test`/`describe`)
- Supports using custom [TagDefinitions](https://tsdoc.org/pages/packages/tsdoc-config/)

## Installing

### Jest

```bash
npm install @tsdoc-test-reporter/jest
```

### Vitest

```bash
npm install @tsdoc-test-reporter/vitest
```

## Usage

### Basic

#### Jest

1. Add reporter to your jest config (`jest.config.js`)

```js
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
	reporters: ['default', '@tsdoc-test-reporter/jest'],
};
```

2. Add TSDoc comments to a test of your choice:

```ts
/**
 * @remarks
 * WCAG Criteria
 */
test('get correct background color based on text color', () => {
	expect(true).toBe(true);
});
```

3. Run tests
4. Open the newly generated file `tsdoc-test-reporter-report.html` in the browser of your choice

#### Vitest

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
 * @remarks
 * WCAG Criteria
 */
test('get correct background color based on text color', () => {
	expect(true).toBe(true);
});
```

3. Run tests (`vitest run`)
4. Open the newly generated file `tsdoc-test-reporter-report.html` in the browser of your choice

### With config

#### Jest

> See [the documentation for the config](https://tsdoc-test-reporter.github.io/reporter/types/core_src.TsDocTestReporterConfig.html) for full docs of possible options

```js
/** @type {import('@tsdoc-test-reporter/jest').TsDocTestReporterConfig} */
const options = {
	outputFileName: 'reports/tsdoc-report',
	uiOptions: {
		title: 'Title of HTML Page',
	},
};

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
	reporters: ['default', ['@tsdoc-test-reporter/jest', options]],
};
```

#### Vitest

> See [the documentation for the config](https://tsdoc-test-reporter.github.io/reporter/types/core_src.TsDocTestReporterConfig.html) for full docs of possible options

1. Create a file for the custom reporter in your project. Vitest does not allow passing config directly when specifying reporters so we need to call the reporter from our own custom reporter.

```ts
// reporter.ts
import TSDocTestReporter from '@tsdoc-test-reporter/vitest';
import { Reporter } from 'vitest/reporters';
import { File } from 'vitest';

export default class MyDefaultReporter extends Reporter {
	async onFinished(files: File[]) {
		new TSDocTestReporter({
			outputFileName: 'reports/tsdoc-report',
			uiOptions: {
				title: 'Title of HTML Page',
			},
		}).onFinished(files);
	}
}
```

2. Link reporter:

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
	test: {
		reporters: ['./reporter.ts'],
	},
});
```

### With Custom User Supplied tags

#### Jest

```js
/** @type {import('@tsdoc-test-reporter/jest').TsDocTestReporterConfig} */
const options = {
	customTags: [
		{
			tagName: '@customModifierTag',
			syntaxKind: 2,
		},
	],
};

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
	reporters: ['default', ['@tsdoc-test-reporter/jest', options]],
};
```

#### Vitest

```ts
// reporter.ts
import TSDocTestReporter, { coreDefaults } from '@tsdoc-test-reporter/vitest';
import { Reporter } from 'vitest/reporters';
import { File } from 'vitest';

export default class MyDefaultReporter extends Reporter {
	async onFinished(files: File[]) {
		new TSDocTestReporter({
			customTags: [
				{
					tagName: '@customModifierTag',
					syntaxKind: 2,
				},
			],
		}).onFinished(files);
	}
}
```
