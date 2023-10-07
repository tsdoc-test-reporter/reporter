import {
	TSDocConfiguration,
	TSDocParser,
	TSDocTagDefinition,
	TSDocTagSyntaxKind,
} from '@microsoft/tsdoc';

import { CommentTagParser } from '.';
import { testFileFactory } from '../test-utils/factory/test-file';
import { TestBlockDocComment, TestBlockTag } from '../types';

const getTagValues = (testBlockDocComments: TestBlockDocComment[]) =>
	Object.values(testBlockDocComments[0].testBlockTags ?? {});

it('transforms custom tag for block', () => {
	const config = new TSDocConfiguration();
	const customBlockDefinition = new TSDocTagDefinition({
		tagName: '@custom',
		syntaxKind: TSDocTagSyntaxKind.BlockTag,
	});
	config.addTagDefinition(customBlockDefinition);
	const sourceFile = testFileFactory<'@custom'>({
		fileName: 'custom.ts',
		options: [
			{
				testTitle: '@custom',
				testBlockName: 'test',
				tags: [
					{
						tagName: '@custom',
						tagContent: 'unit,acceptance',
					},
				],
			},
		],
	});
	const { testBlockDocComments } = new CommentTagParser<'@custom'>({
		sourceFile,
		tsDocParser: new TSDocParser(config),
		applyTags: ['@custom'],
	});
	expect(getTagValues(testBlockDocComments)).toEqual<TestBlockTag[]>([
		{
			testBlockName: 'test',
			testTitle: '@custom',
			tags: ['unit', 'acceptance'],
			type: 'custom',
			kind: 'block',
			name: '@custom',
		},
	]);
});

it('transforms custom tag for modifiers', () => {
	const config = new TSDocConfiguration();
	const customBlockDefinition = new TSDocTagDefinition({
		tagName: '@customModifier',
		syntaxKind: TSDocTagSyntaxKind.ModifierTag,
	});
	config.addTagDefinition(customBlockDefinition);
	const sourceFile = testFileFactory<'@customModifier'>({
		fileName: 'custom.ts',
		options: [
			{
				testTitle: '@customModifier',
				testBlockName: 'test',
				tags: [
					{
						tagName: '@customModifier',
					},
				],
			},
		],
	});
	const { testBlockDocComments } = new CommentTagParser<'@customModifier'>({
		sourceFile,
		tsDocParser: new TSDocParser(config),
		applyTags: ['@customModifier'],
	});
	expect(getTagValues(testBlockDocComments)).toEqual<TestBlockTag[]>([
		{
			testBlockName: 'test',
			testTitle: '@customModifier',
			tags: undefined,
			type: 'custom',
			kind: 'modifier',
			name: '@customModifier',
		},
	]);
});
