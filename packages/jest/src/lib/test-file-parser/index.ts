import { CommentTagParser, FileParserConfig } from '@tsdoc-test-reporter/core';

import type { TaggedTestResult } from '../types';
import type { TestResult } from '@jest/test-result';

export const parseTestFiles = <CustomTags extends string>({
	tsDocParser,
	result,
	testBlockTagNames,
	tagSeparator,
	sourceFilesMap,
	applyTags,
}: FileParserConfig<TestResult, CustomTags>): TaggedTestResult<CustomTags>[] => {
	return result.flatMap((result) => {
		const sourceFile = sourceFilesMap[result.testFilePath];
		if (!sourceFile) return result;
		const { testBlockDocComments } = new CommentTagParser<CustomTags>({
			sourceFile,
			tsDocParser,
			applyTags,
			testBlockTagNames,
			tagSeparator,
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
