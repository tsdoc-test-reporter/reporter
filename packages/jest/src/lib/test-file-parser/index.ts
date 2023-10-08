import { CommentTagParser } from '@tsdoc-test-reporter/core';

import type { FileParserConfig, TaggedTestResult } from '../types';

export const parseTestFiles = <CustomTags extends string>({
	tsDocParser,
	testResults,
	testBlockTagNames,
	tagSeparator,
	sourceFilesMap,
	applyTags,
}: FileParserConfig<CustomTags>): TaggedTestResult<CustomTags>[] => {
	return testResults.flatMap((result) => {
		const sourceFile = sourceFilesMap[result.testFilePath];
		if (!sourceFile) return result;
		const { testBlockDocComments } = new CommentTagParser<CustomTags>({
			sourceFile,
			tsDocParser: tsDocParser,
			applyTags: applyTags,
			testBlockTagNames,
			tagSeparator: tagSeparator,
		});
		if (!testBlockDocComments.length) return result;
		return {
			...result,
			testResults: result.testResults.map((testResult) => ({
				...testResult,
				ancestorTestBlockComments: testBlockDocComments.filter((t) =>
					testResult.ancestorTitles.includes(t.title),
				),
				testBlockComments: testBlockDocComments.filter((t) => t.title === testResult.title),
			})),
		};
	});
};
