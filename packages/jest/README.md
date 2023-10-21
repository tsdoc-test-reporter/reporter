# @tsdoc-test-reporter/jest

TSDoc Test Reporter for Jest

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
	reporters: ['default', '@tsdoc-test-reporter/jest'],
};
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

3. Run tests
4. Open the newly generated file `tsdoc-test-reporter-report.html` in the browser of your choice

## Testing

```bash
pnpm nx test jest
```
