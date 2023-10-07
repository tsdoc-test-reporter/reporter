import type { SourceFile } from 'typescript';
import type { AllTagsName, TestBlockName } from '../../types';
import { sourceFileFactory } from './source-file';

type TestTag<CustomTags extends string = string> = {
	tagName: AllTagsName | CustomTags;
	tagContent?: string;
};

type TestBlockWithComments<CustomTags extends string = string> = {
	testBlockName: TestBlockName;
	tags: TestTag<CustomTags>[];
	testTitle: string;
	children?: TestBlockWithComments<CustomTags>[];
};

export const testFileContentFactory = (options: TestBlockWithComments[], depth = 0): string => {
	const renderChildren = (option: TestBlockWithComments) => {
		if (!option.children) return `expect(true).toBe(true)`;
		return testFileContentFactory(option.children, depth + 1);
	};
	const renderTag = (tag: TestTag, index: number, array: TestTag[]) => {
		const formattedTagContent = tag.tagContent ? ` ${tag.tagContent}\n * ` : '';
		const lineBreakWhenMultipleTags = !tag.tagContent && index !== array.length - 1 ? '\n * ' : '';
		return `${tag.tagName}${formattedTagContent}${lineBreakWhenMultipleTags}`;
	};
	return options
		.map((option) => {
			const tabWidth = '\t'.repeat(depth);
			return `
${tabWidth}/**
${tabWidth} * ${option.tags.map(renderTag).join('')} 
${tabWidth} */
${tabWidth}${option.testBlockName}("${option.testTitle}", () => {
${tabWidth}  ${renderChildren(option)}
${tabWidth}});
`;
		})
		.join('');
};

export type TestFileFactoryOptions<CustomTags extends string = string> = {
	fileName: string;
	options: TestBlockWithComments<CustomTags>[];
};

export const testFileFactory = <CustomTags extends string = string>({
	fileName,
	options,
}: TestFileFactoryOptions<CustomTags>): SourceFile => {
	return sourceFileFactory(fileName)(testFileContentFactory(options));
};
