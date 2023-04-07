import { sourceFileFactory } from '@tsdoc-test-reporter/core';
import { SourceFile } from 'typescript';

export const testFileParserBasicFileName =
	'test-file-parser-basic.source-file.ts';
export const testFileParserBasicSourceFile: SourceFile = sourceFileFactory(
	testFileParserBasicFileName
)`
/**
 * @remarks unit tests
 */
describe('form validation', () => {
	/**
	 * @remarks acceptance criteria
	 */
	test('should validate email', () => {
		expect(true).toBe(true);
	})
})`;
