import { SourceFile } from 'typescript';

import { sourceFileFactory } from '../../test-utils/factory';

export const commentTagParserExtendedSourceFileName =
	'comment-tag-parser-extended.source-file.ts';
export const commentTagParserExtendedSourceFile: SourceFile = sourceFileFactory(
	commentTagParserExtendedSourceFileName
)`
/**
 * @remarks describe only tag
 */
describe.only('describe only title', () => {})
/**
 * @remarks describe only tag
 */
describe.skip('describe skip title', () => {})
/**
 * @remarks describe each tag
 */
describe.each('describe each title', () => {
	/**
	 * @remarks test each tag
	 */
	test.each("test each", () => {})
	/**
	 * @remarks test only tag
	 */
	test.only("test only", () => {})
	/**
	 * @remarks test skip tag
	 */
	test.skip("test skip",() => {})
	/**
	 * @remarks test failing tag
	 */
	test.failing("test failing",() => {})
	/**
	 * @remarks test todo tag
	 */
	test.todo("test todo", () => {})
	/**
	 * @remarks test concurrent tag
	 */
	test.concurrent("test concurrent",() => {})
	/**
	 * @remarks test concurrent each tag
	 */
	test.concurrent.each("test concurrent each",() => {})
})`;
