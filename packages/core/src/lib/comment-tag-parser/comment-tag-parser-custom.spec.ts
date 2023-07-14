import {
	TSDocConfiguration,
	TSDocParser,
	TSDocTagDefinition,
	TSDocTagSyntaxKind,
} from '@microsoft/tsdoc';

import { commentTagParserCustomTagsSourceFile } from './test-data/comment-tag-parser-custom.source-file';

import { TestBlockTag } from '../types';

import { CommentTagParser } from '.';

it('transforms custom tags for block', () => {
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
		type: 'custom',
		tags: ['acceptance criteria'],
		name: '@custom',
		testBlockType: 'describe',
		testTitle: 'form validation',
		kind: 'block',
	} as TestBlockTag);
	expect(testBlockTags['@remarks']).toBeUndefined();
});

it('transforms custom tags for modifier', () => {
	const config = new TSDocConfiguration();
	const customBlockDefinition = new TSDocTagDefinition({
		tagName: '@customModifier',
		syntaxKind: TSDocTagSyntaxKind.ModifierTag,
	});
	config.addTagDefinition(customBlockDefinition);
	const { testBlockDocComments } = new CommentTagParser<'@customModifier'>({
		sourceFile: commentTagParserCustomTagsSourceFile,
		tsDocParser: new TSDocParser(config),
		applyTags: ['@customModifier'],
	});
	const [first] = testBlockDocComments;
	expect(first.title).toEqual('form validation');
	expect(first.testBlockType).toEqual('describe');
	expect(first.testBlockTags).toBeDefined();
	const testBlockTags = first.testBlockTags ?? {};
	expect(testBlockTags['@customModifier']).toMatchObject({
		type: 'custom',
		name: '@customModifier',
		testBlockType: 'describe',
		testTitle: 'form validation',
		kind: "modifier",
	} as TestBlockTag);
	expect(testBlockTags['@remarks']).toBeUndefined();
});
