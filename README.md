<img src="logo.png" width="100" height="100" align="center" />

# @tsdoc-test-reporter

**TSDoc Test Reporter** attaches [TSDoc](https://tsdoc.org/) notations as metadata to your test results.

## Features

- Supports: **Jest**
- Outputs: **JSON** or **HTML**
- Use multiple tags in same `block` notation
- Specifying which test blocks should be parsed (`it`/`test`/`describe`)
- Supports using custom [TagDefinitions](https://tsdoc.org/pages/packages/tsdoc-config/)


## Installing

```bash
npm install @tsdoc-test-reporter/jest
```

## Usage

### Basic

1. Add reporter to your jest config (`jest.config.js`)
```js
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  reporters: [
		"default",
		"@tsdoc-test-reporter/jest",
	]
};
```
2. Add TSDoc comments to a test of your choice:
```ts
/**
 * @remarks WCAG Criteria
 */
test("get correct background color based on text color", () => {
	expect(true).toBe(true);
})

```
3. Run tests
4. Open the newly generated file `tsdoc-test-reporter-report.html` in the browser of your choice

### With config

> See Documentation for full docs of possible options

```js
/** @type {import('@tsdoc-test-reporter/jest').TsDocTestReporterConfig} */
const options = {
  testBlockTagNames: ["test", "test.each"],
  applyTags: ["@remarks"],
  outputFileName: "reports/tsdoc-report",
  tsConfigPath: "./tsconfig.json",
  tagSeparator: ";",
	// These are only applied for HTML Report
  uiOptions: {
    title: "Title of HTML Page",
    hideAncestorTitles: false,
    hideAncestorTags: false,
    removeAtSignOnTags: true,
    showTagNameOnBlockTags: false,
    statusToIconMap: {
      passed: "🎉"
    },
    tagTitleToIconMap: {
      "WCAG Criteria": "♿"
    }
  }
}

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  reporters: [
    "default",
    ["@tsdoc-test-reporter/jest", options]
  ]
};
```

### With Custom User Supplied tags

```js
const { coreDefaults } = require("@tsdoc-test-reporter/jest")

/** @type {import('@tsdoc-test-reporter/jest').TsDocTestReporterConfig} */
const options = {
  applyTags: [...coreDefaults.applyTags, "@customModifierTag"],
  customTags: [
    {
      tagName: "@customModifierTag",
      syntaxKind: 2,
    }
  ]
}

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  reporters: [
    "default",
    ["@tsdoc-test-reporter/jest", options]
  ]
};
```
