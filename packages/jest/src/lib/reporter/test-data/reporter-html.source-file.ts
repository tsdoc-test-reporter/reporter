import { sourceFileFactory } from '@tsdoc-test-reporter/core';
import { SourceFile } from 'typescript';

export const reporterHTMLSourceFileName = 'reporter-html.source-file.ts';
export const reporterHTMLSourceFile: SourceFile = sourceFileFactory(
	reporterHTMLSourceFileName
)`
/**
 * @remarks Unit tests
 */
describe('form validation', () => {
	test('should validate email', () => {
		expect(true).toBe(true);
	})
	describe('error handling', () => {
    /**
     * @remarks WCAG criteria
     * @privateRemarks WCAG 2.1, WCAG 2.2
     */
		it('should show invalid email error', () => {
			expect(true).toBe(false);
		})
	})
})
`;
