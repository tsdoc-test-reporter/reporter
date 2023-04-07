import { TSDocParser } from '@microsoft/tsdoc';

import { commentTagParserBasicSourceFile } from './test-data/comment-tag-parser-basic.source-file';

import { TestBlockTag } from '../types';

import { CommentTagParser } from './index';

it('transforms source file to test tags for default applied describe and test/it blocks', () => {
	const { testBlockDocComments } = new CommentTagParser({
		sourceFile: commentTagParserBasicSourceFile,
		tsDocParser: new TSDocParser(),
	});
	expect(testBlockDocComments).toHaveLength(4);
	const [first, second, third, fourth] = testBlockDocComments;

	expect(first.title).toEqual('form validation');
	expect(first.testBlockType).toEqual('describe');
	expect(first.testBlockTags).toBeDefined();
	const firstTestBlockTags = first.testBlockTags ?? {};
	expect(firstTestBlockTags['@remarks']).toMatchObject({
		tagName: '@remarks',
		tags: ['unit tests'],
		testBlockType: 'describe',
		testTitle: 'form validation',
		type: 'standard',
	} as TestBlockTag);

	expect(second.title).toEqual('error handling');
	expect(second.testBlockType).toEqual('describe');
	expect(second.testBlockTags).toBeDefined();
	const secondTestBlockTags = second.testBlockTags ?? {};
	expect(secondTestBlockTags['@remarks']).toMatchObject({
		tagName: '@remarks',
		tags: ['WCAG criteria'],
		testBlockType: 'describe',
		testTitle: 'error handling',
		type: 'standard',
	} as TestBlockTag);

	expect(third.title).toEqual('form validation');
	expect(third.testBlockType).toEqual('describe');
	expect(third.testBlockTags).toBeDefined();
	const thirdTestBlockTags = third.testBlockTags ?? {};
	expect(thirdTestBlockTags['@remarks']).toMatchObject({
		tagName: '@remarks',
		tags: ['feature/XXXX'],
		testBlockType: 'describe',
		testTitle: 'form validation',
		type: 'standard',
	} as TestBlockTag);

	expect(fourth.title).toEqual('should should invalid email error');
	expect(fourth.testBlockType).toEqual('it');
	expect(fourth.testBlockTags).toBeDefined();
	const fourthTestBlockTags = fourth.testBlockTags ?? {};
	expect(fourthTestBlockTags['@remarks']).toMatchObject({
		tagName: '@remarks',
		tags: ['acceptance criteria'],
		testBlockType: 'it',
		testTitle: 'should should invalid email error',
		type: 'standard',
	} as TestBlockTag);
});

it('transforms source file to test tags for user defined applied describe and test/it blocks', () => {
	const { testBlockDocComments } = new CommentTagParser({
		sourceFile: commentTagParserBasicSourceFile,
		tsDocParser: new TSDocParser(),
		applyTags: ['@privateRemarks', '@remarks'],
	});
	expect(testBlockDocComments).toHaveLength(4);
	const [first, second, third, fourth] = testBlockDocComments;

	expect(first.title).toEqual('form validation');
	expect(first.testBlockType).toEqual('describe');
	expect(first.testBlockTags).toBeDefined();
	const firstTestBlockTags = first.testBlockTags ?? {};
	expect(firstTestBlockTags['@remarks']).toMatchObject({
		tagName: '@remarks',
		tags: ['unit tests'],
		testBlockType: 'describe',
		testTitle: 'form validation',
		type: 'standard',
	} as TestBlockTag);

	expect(second.title).toEqual('error handling');
	expect(second.testBlockType).toEqual('describe');
	expect(second.testBlockTags).toBeDefined();
	const secondTestBlockTags = second.testBlockTags ?? {};
	expect(secondTestBlockTags['@remarks']).toMatchObject({
		tagName: '@remarks',
		tags: ['WCAG criteria'],
		testBlockType: 'describe',
		testTitle: 'error handling',
		type: 'standard',
	} as TestBlockTag);
	expect(secondTestBlockTags['@privateRemarks']).toMatchObject({
		tagName: '@privateRemarks',
		tags: ['WCAG 2.1', 'WCAG 2.2'],
		testBlockType: 'describe',
		testTitle: 'error handling',
		type: 'standard',
	} as TestBlockTag);

	expect(third.title).toEqual('form validation');
	expect(third.testBlockType).toEqual('describe');
	expect(third.testBlockTags).toBeDefined();
	const thirdTestBlockTags = third.testBlockTags ?? {};
	expect(thirdTestBlockTags['@remarks']).toMatchObject({
		tagName: '@remarks',
		tags: ['feature/XXXX'],
		testBlockType: 'describe',
		testTitle: 'form validation',
		type: 'standard',
	} as TestBlockTag);

	expect(fourth.title).toEqual('should should invalid email error');
	expect(fourth.testBlockType).toEqual('it');
	expect(fourth.testBlockTags).toBeDefined();
	const fourthTestBlockTags = fourth.testBlockTags ?? {};
	expect(fourthTestBlockTags['@remarks']).toMatchObject({
		tagName: '@remarks',
		tags: ['acceptance criteria'],
		testBlockType: 'it',
		testTitle: 'should should invalid email error',
		type: 'standard',
	} as TestBlockTag);
});
