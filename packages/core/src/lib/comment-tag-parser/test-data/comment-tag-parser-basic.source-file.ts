import { SourceFile } from 'typescript';

import { sourceFileFactory } from '../../test-utils/factory';

export const commentTagParserSourceFileName =
	'comment-tag-parser-basic.source-file.ts';
export const commentTagParserBasicSourceFile: SourceFile = sourceFileFactory(
	commentTagParserSourceFileName
)`
/**
 * @remarks unit tests
 */
describe('form validation', () => {
	test('should validate email', () => {
		expect(true).toBe(true);
	})
	/**
	 * @remarks WCAG criteria
	 * @privateRemarks WCAG 2.1, WCAG 2.2
	 */
	describe('error handling', () => {
		it('should show invalid email error', () => {
			expect(true).toBe(true);
		})
	})
})

/**
 * @remarks feature/XXXX
 */
describe('form validation', () => {
	/**
	 * @remarks acceptance criteria
	 */
	it('should should invalid email error', () => {
		expect(true).toBe(true);
	})
})
`;
