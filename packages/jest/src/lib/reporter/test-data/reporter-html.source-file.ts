import { sourceFileFactory } from '@tsdoc-test-reporter/core';
import { SourceFile } from 'typescript';

export const reporterHTMLSourceFileName = 'reporter-html.source-file.ts';
export const reporterHTMLSourceFile: SourceFile = sourceFileFactory(
	reporterHTMLSourceFileName
)`
describe('form validation', () => {
	/**
	 * @public
	 * @beta
	 * @alpha
	 */
	test('should validate email', () => {
		expect(true).toBe(true);
	})
	describe('error handling', () => {
    /**
     * @remarks WCAG criteria
     * @privateRemarks WCAG 2.1, WCAG 2.2
		 * @deprecated old
     */
		it('should show invalid email error', () => {
			expect(true).toBe(false);
		})
	})
})
`;
