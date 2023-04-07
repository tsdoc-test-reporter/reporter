import { sourceFileFactory } from '@tsdoc-test-reporter/core';
import { SourceFile } from 'typescript';

export const grouperBasicSourceFileName = 'grouper-basic.source-file.ts';
export const grouperBasicSourceFile: SourceFile = sourceFileFactory(
	grouperBasicSourceFileName
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
describe('feature title', () => {
	/**
	 * @remarks acceptance criteria
	 */
	it('should show invalid email error', () => {
		expect(true).toBe(true);
	})
})

describe('other tests', () => {
	it('should validate', () => {
		expect(true).toBe(true);
	})
})
`;
