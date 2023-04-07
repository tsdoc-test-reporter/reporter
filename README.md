# @tsdoc-test-reporter

**TSDoc Test Reporter** attaches [TSDoc](https://tsdoc.org/) notations as metadata to your test results.

- Supports: **Jest**.
- Outputs: **JSON** or **HTML**
- Supports using custom [TagDefinitions](https://tsdoc.org/pages/packages/tsdoc-config/)
- Grouping by notation (limited support)
- Supports specifying which test blocks should be parsed (`it`/`test`/`test.each` etc.)
- Supports multiple tags in same block notation

## Installing

```
npm i @tsdoc-test-reporter/jest
```

## Example

### Input
```ts
/**
 * @remarks unit tests
 */
describe('form validation', () => {
  /**
	 * @remarks WCAG criteria
	 * @privateRemarks WCAG 2.1, WCAG 2.2
	 */
	test('validate email', () => {
		expect(true).toBe(true);
	})
})

```
### Output

#### JSON
```json
{
	"ancestorTitles": [
		"form validation",
	],
	"fullName": "validate email",
	"title": "validate email",
	"status": "passed",
	"testBlockComments": [
		{
			"testBlockTags": {
				"@remarks": {
					"tags": [
						"WCAG criteria"
					],
					"testBlockType": "it",
				},
				"@privateRemarks": {
					"tags": [
						"WCAG 2.1",
						"WCAG 2.2"
					],
					"testBlockType": "it",
				}
			},
		}
	],
	"ancestorTestBlockComments": [
		{
			"title": "form validation",
			"testBlockTags": {
				"@remarks": {
					"tags": [
						"Unit tests"
					],
					"testBlockType": "describe",
				}
			},
		}
	]
}
```