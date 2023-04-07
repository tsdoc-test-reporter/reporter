import { sourceFileFactory } from '@tsdoc-test-reporter/core';
import { SourceFile } from 'typescript';

export const testFileParserCustomFileName =
	'test-file-parser-custom.source-file.ts';
export const testFileParserCustomSourceFile: SourceFile = sourceFileFactory(
	testFileParserCustomFileName
)`
/**
 * @custom unit tests
 */
describe('form validation', () => {
	/**
	 * @custom2 acceptance criteria
	 */
	test('should validate email', () => {
		expect(true).toBe(true);
	})
})`;
