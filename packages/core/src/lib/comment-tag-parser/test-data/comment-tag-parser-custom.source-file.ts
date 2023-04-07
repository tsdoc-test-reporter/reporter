import { SourceFile } from 'typescript';

import { sourceFileFactory } from '../../test-utils/factory';

export const commentTagParserCustomTagsSourceFileName =
	'comment-tag-parser-basic-custom-tags.source-file.ts';
export const commentTagParserCustomTagsSourceFile: SourceFile = sourceFileFactory(
	commentTagParserCustomTagsSourceFileName
)`
/**
 * @remarks unit test
 * @custom acceptance criteria
 */
describe('form validation', () => {
	test('should validate email', () => {
		expect(true).toBe(true);
	})
})
`;
