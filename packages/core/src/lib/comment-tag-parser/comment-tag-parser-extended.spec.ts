import { TSDocParser } from '@microsoft/tsdoc';

import { commentTagParserExtendedSourceFile } from './test-data/comment-tag-parser-extended.source-file';

import { CommentTagParser } from './index';

it('transforms source file to test tags for describe and test extended scenario', () => {
	const { testBlockDocComments } = new CommentTagParser({
		sourceFile: commentTagParserExtendedSourceFile,
		tsDocParser: new TSDocParser(),
	});
	expect(testBlockDocComments).toHaveLength(10);
});
