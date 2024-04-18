![social_preview](https://github.com/tsdoc-test-reporter/reporter/assets/21122051/5c8bb5cd-5772-47d2-8264-cc43cf5886ca)

# @tsdoc-test-reporter

**@tsdoc-test-reporter** is a test reporter that attaches [TSDoc](https://tsdoc.org/) comments to your test results. It enables you to attach metadata to your unit tests in the form of comments.

## Output

**[Example output from the reporter](https://tsdoc-test-reporter.github.io/kitchen-sink/)**

## Features

- Supports: **Jest** and **Vitest**
- Parses _JSDoc_ and extended _TSDoc_ tags
- Outputs: **JSON** or **HTML**
- Extensive configuration of HTML report ([See UIOptions](https://tsdoc-test-reporter.github.io/reporter/types/core_src.UIOptions.html))
- Displays error details
- Supports using custom Tag Definitions
- Works with regular JavaScript files as well
- Works as a regular HTML/JSON reporter if you don't have any JSDoc
- [See limitations](#limitations) on a list of what are some known limitations

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
		htmlTitle: 'Title of HTML Page',
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
import type { File, Vitest } from 'vitest';

export default class MyDefaultReporter extends Reporter {
	private reporter: TSDocTestReporter;
	constructor() {
		this.reporter = new TSDocTestReporter({
			outputFileName: 'reports/tsdoc-report',
			uiOptions: {
				htmlTitle: 'Title of HTML Page',
			},
		});
	}
	onInit(ctx: Vitest) {
		this.reporter.onInit(ctx);
	}
	onFinished(files: File[]) {
		this.reporter.onFinished(files);
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
import TSDocTestReporter from '@tsdoc-test-reporter/vitest';
import { Reporter } from 'vitest/reporters';
import type { File, Vitest } from 'vitest';

export default class MyDefaultReporter extends Reporter {
	private reporter: TSDocTestReporter;

	constructor() {
		this.reporter = new TSDocTestReporter({
			customTags: [
				{
					tagName: '@customModifierTag',
					syntaxKind: 2,
				},
			],
		});
	}
	onInit(ctx: Vitest) {
		this.reporter.onInit(ctx);
	}
	onFinished(files: File[]) {
		this.reporter.onFinished(files);
	}
}
```

## Limitations

- Does not parse more than regular text in block comments as of writing. This is being worked on. You can create multiple tags when using a block tag. See example below. If you want a custom tagseparator that is not `,` you can supply it as an option.

```ts
/**
 * @remarks
 * unit,acceptance,whatever
 */
test('get correct background color based on text color', () => {
	expect(true).toBe(true);
});
```

- Has limited support of inline tags. As of writing the supported case is using `@see {@link variableName}`. If the linked reference is a variable it will be resolved to a value if it is in scope of the source file (in the source file or imported by the source file). This is limited to string literals and object properties that are string literals (or enums). The example below works, and works if the enum is imported as a named import.

```ts
const enum MyEnum {
	Key = 'Value',
}

/**
 * @see {@link MyEnum.Key}
 */
test('get correct background color based on text color', () => {
	expect(true).toBe(true);
});
```

- Can not parse test titles that has parameters. If you are using `test.each` or similar where you are using placeholders in the test title, this test will not be able to match the JSDoc to the test assertion. You will have to wrap that each block with a `describe` and add a JSDoc to the `describe` block. If you are not using parameters in the title, `test.each` will work.

```ts
/**
 * @remarks
 * unit,acceptance
 */
test.each([{ name: 'value' }])('this will fail: $name', () => {
	expect(true).toBe(true);
});
```

## How to contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) on how to contribute and how to setup the project locally.