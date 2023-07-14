import { SourceFile } from 'typescript';

import { sourceFileFactory } from '../../test-utils/factory';

export const commentTagParserModifiersSourceFileName =
	'comment-tag-parser-modifier-set.source-file.ts';
export const commentTagParserModifiersSourceFile: SourceFile = sourceFileFactory(
	commentTagParserModifiersSourceFileName
)`
/**
 * @beta
 * @public
 */
describe('form validation', () => {
	test('should validate email', () => {
		expect(true).toBe(true);
	})
})
`;
