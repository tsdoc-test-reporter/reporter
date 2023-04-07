import { CommentTagParser } from '@tsdoc-test-reporter/core';

import {
	FileParserConfig,
	TaggedAssertionResult,
	TaggedTestResult,
} from '../types';

export const parseTestFiles = <CustomTag extends string>({
	tsDocParser,
	testResults,
	testBlockTagNames,
	tagSeparator,
	sourceFilesMap,
	applyTags,
}: FileParserConfig<CustomTag>): TaggedTestResult<CustomTag>[] => {
	return testResults.flatMap((result) => {
		const sourceFile = sourceFilesMap[result.testFilePath];
		if (!sourceFile) return result;
		const { testBlockDocComments } = new CommentTagParser<CustomTag>({
			sourceFile,
			tsDocParser: tsDocParser,
			applyTags: applyTags,
			testBlockTagNames,
			tagSeparator: tagSeparator,
		});
		const testResults = result.testResults.map((testResult) => {
			const result: TaggedAssertionResult<CustomTag> = {
				...testResult,
				ancestorTestBlockComments: testBlockDocComments.filter((t) =>
					testResult.ancestorTitles.includes(t.title)
				),
				testBlockComments: testBlockDocComments.filter(
					(t) => t.title === testResult.title
				),
			};
			return result;
		});
		return {
			...result,
			testResults,
		};
	});
};
