import { CommentTagParser, FileParserConfig } from '@tsdoc-test-reporter/core';
import type { TaggedFile } from '../../types';
import { attachTestBlockComments } from '../utils/vitest.utils';
import type { File } from 'vitest';

export const parseTestFiles = <CustomTags extends string>({
	tsDocParser,
	result,
	testBlockTagNames,
	tagSeparator,
	sourceFilesMap,
	applyTags,
}: FileParserConfig<File, CustomTags>): TaggedFile[] => {
	return result.map((file) => {
		const sourceFile = sourceFilesMap[file.filepath];
		if (!sourceFile) {
			return file;
		}
		const { testBlockDocComments } = new CommentTagParser<CustomTags>({
			sourceFile,
			tsDocParser,
			applyTags,
			testBlockTagNames,
			tagSeparator,
		});
		if (!testBlockDocComments.length) {
			return file;
		}
		return {
			...file,
			tasks: attachTestBlockComments(file.tasks, testBlockDocComments),
		};
	});
};
