import { TSDocParser } from '@microsoft/tsdoc';

import { commentTagParserModifiersSourceFile } from './test-data/comment-tag-parser-modifiers.source-file';

import { CommentTagParser } from './index';
import { TestBlockTag } from '../types';

it('transforms source file to test tags for default applied describe and test/it blocks', () => {
	const { testBlockDocComments } = new CommentTagParser({
		sourceFile: commentTagParserModifiersSourceFile,
		tsDocParser: new TSDocParser(),
	});
	expect(testBlockDocComments).toHaveLength(1);
	const [first] = testBlockDocComments;
	const testBlockTags = first.testBlockTags as Record<string, TestBlockTag>; 
	expect(testBlockTags["@beta"]).toBeDefined()
	expect(testBlockTags["@beta"].name).toEqual("@beta");
	expect(testBlockTags["@beta"].type).toEqual("standard");
	expect(testBlockTags["@beta"].kind).toEqual("modifier");
	expect(testBlockTags["@public"]).toBeDefined()
	expect(testBlockTags["@public"].name).toEqual("@public");
	expect(testBlockTags["@public"].type).toEqual("standard");
	expect(testBlockTags["@public"].kind).toEqual("modifier");
});
