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

export const defaultOutputFileName = 'tsdoc-test-reporter-report';

export const coreDefaults: CoreDefaults = {
	testBlockTagNames: testBlockTagNames,
	tagSeparator: ',',
	applyTags: [...allBlockTags, ...allModifierTags],
	outputFileType: 'html',
	outputFileName: defaultOutputFileName,
};
