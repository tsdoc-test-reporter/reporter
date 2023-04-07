import {
	TSDocConfiguration,
	TSDocParser,
	TSDocTagDefinition,
	TSDocTagSyntaxKind,
} from '@microsoft/tsdoc';

import { commentTagParserCustomTagsSourceFile } from './test-data/comment-tag-parser-custom.source-file';

import { TestBlockTag } from '../types';

import { CommentTagParser } from '.';

it('transforms custom tags', () => {
	const config = new TSDocConfiguration();
	const customBlockDefinition = new TSDocTagDefinition({
		tagName: '@custom',
		syntaxKind: TSDocTagSyntaxKind.BlockTag,
	});
	config.addTagDefinition(customBlockDefinition);
	const { testBlockDocComments } = new CommentTagParser<'@custom'>({
		sourceFile: commentTagParserCustomTagsSourceFile,
		tsDocParser: new TSDocParser(config),
		applyTags: ['@custom'],
	});
	const [first] = testBlockDocComments;
	expect(first.title).toEqual('form validation');
	expect(first.testBlockType).toEqual('describe');
	expect(first.testBlockTags).toBeDefined();
	const testBlockTags = first.testBlockTags ?? {};
	expect(testBlockTags['@custom']).toMatchObject({
		type: 'standard',
		tags: ['acceptance criteria'],
		tagName: '@custom',
		testBlockType: 'describe',
		testTitle: 'form validation',
	} as TestBlockTag);
	expect(testBlockTags['@remarks']).toBeUndefined();
});
