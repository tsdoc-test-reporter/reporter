import type {
	BlockTagName,
	CoreDefaults,
	JSDocTagName,
	ModifierTagName,
	TestBlockName,
} from './types';

export const allBlockTags: BlockTagName[] = ['@deprecated', '@privateRemarks', '@remarks'];

export const allModifierTags: ModifierTagName[] = [
	'@alpha',
	'@beta',
	'@eventProperty',
	'@experimental',
	'@internal',
	'@override',
	'@packageDocumentation',
	'@public',
	'@readonly',
	'@sealed',
	'@virtual',
];

export const allTsDocTags: (ModifierTagName | BlockTagName)[] = [
	...allBlockTags,
	...allModifierTags,
];

export const allJSDocTags: JSDocTagName[] = [
	'@abstract',
	'@access',
	'@alias',
	'@async',
	'@augments',
	'@author',
	'@borrows',
	'@callback',
	'@class',
	'@classdesc',
	'@constant',
	'@constructs',
	'@copyright',
	'@default',
	'@defaultvalue',
	'@deprecated',
	'@description',
	'@enum',
	'@event',
	'@example',
	'@exports',
	'@external',
	'@host',
	'@file',
	'@fileoverview',
	'@overview',
	'@fires',
	'@emits',
	'@function',
	'@func',
	'@method',
	'@generator',
	'@global',
	'@hideconstructor',
	'@ignore',
	'@implements',
	'@inheritdoc',
	'@inner',
	'@instance',
	'@interface',
	'@kind',
	'@lends',
	'@license',
	'@listens',
	'@member',
	'@var',
	'@memberof',
	'@mixes',
	'@module',
	'@name',
	'@namespace',
	'@override',
	'@package',
	'@param',
	'@arg',
	'@argument',
	'@private',
	'@property',
	'@prop',
	'@protected',
	'@public',
	'@readonly',
	'@requires',
	'@returns',
	'@return',
	'@see',
	'@since',
	'@static',
	'@summary',
	'@this',
	'@throws',
	'@exception',
	'@todo',
	'@tutorial',
	'@type',
	'@typedef',
	'@variation',
	'@version',
	'@yields',
	'@yield',
];

/**
 * @hidden
 */
export const jsDocTagsMap = Object.fromEntries(allJSDocTags.map((key) => [key, true])) as Record<
	JSDocTagName,
	boolean
>;

export const testTagNames: TestBlockName[] = [
	'test',
	'test.skip',
	'test.skip.failing',
	'test.skip.each',
	'test.skipIf',
	'test.runIf',
	'test.only',
	'test.only.failing',
	'test.each',
	'test.concurrent',
	'test.concurrent.skip',
	'test.concurrent.each',
	'test.concurrent.only.each',
	'test.concurrent.skip.each',
	'test.todo',
	'test.failing',
	'test.failing.each',
	'test.fails',
	'it',
	'it.skip',
	'it.skip.failing',
	'it.skip.each',
	'it.skipIf',
	'it.runIf',
	'it.only',
	'it.only.failing',
	'it.each',
	'it.concurrent',
	'it.concurrent.each',
	'it.concurrent.only.each',
	'it.concurrent.skip.each',
	'it.todo',
	'it.failing',
	'it.failing.each',
	'it.fails',
];

export const ancestorTagNames: TestBlockName[] = [
	'describe',
	'describe.skip',
	'describe.skip.each',
	'describe.skipIf',
	'describe.only',
	'describe.only.each',
	'describe.concurrent',
	'describe.sequential',
	'describe.shuffle',
	'describe.todo',
	'describe.each',
];

export const testBlockTagNames: TestBlockName[] = [...testTagNames, ...ancestorTagNames];
/**
 * @hidden
 */
export const baseTestBlockNames: Record<
	Extract<TestBlockName, 'test' | 'it' | 'describe'>,
	boolean
> = {
	test: true,
	it: true,
	describe: true,
};

export const defaultOutputFileName = 'tsdoc-test-reporter-report';

export const coreDefaults: CoreDefaults = {
	testBlockTagNames: testBlockTagNames,
	tagSeparator: ',',
	outputFileType: 'html',
	outputFileName: defaultOutputFileName,
};
