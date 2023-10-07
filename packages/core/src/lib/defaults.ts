import type { BlockTagName, CoreDefaults, ModifierTagName, TestBlockName } from './types';

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

export const testBlockTagNames: TestBlockName[] = [
	'describe',
	'describe.each',
	'describe.only',
	'describe.skip',
	'describe.skip.each',
	'describe.only.each',
	'test',
	'test.each',
	'test.only',
	'test.only.failing',
	'test.only.each',
	'test.skip',
	'test.skip.failing',
	'test.skip.each',
	'test.failing',
	'test.failing.each',
	'test.todo',
	'test.concurrent',
	'test.concurrent.each',
	'it',
	'it.each',
	'it.only',
	'it.only.failing',
	'it.only.each',
	'it.skip',
	'it.skip.failing',
	'it.skip.each',
	'it.failing',
	'it.failing.each',
	'it.todo',
	'it.concurrent',
	'it.concurrent.each',
];

export const coreDefaults: CoreDefaults<string> = {
	testBlockTagNames: testBlockTagNames,
	tagSeparator: ',',
	applyTags: [...allBlockTags, ...allModifierTags],
};
