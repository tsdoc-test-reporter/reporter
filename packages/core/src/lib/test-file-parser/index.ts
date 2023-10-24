import { CommentTagParser } from '../comment-tag-parser';
import { AllTagsName, FileParserConfig } from '../types';

export const parseTestFiles = <
	Result extends object,
	Output extends object,
	CustomTags extends string = AllTagsName,
>({
	tsDocParser,
	result,
	testBlockTagNames,
	tagSeparator,
	sourceFilesMap,
	excludeTags,
	resultMapper,
	filePath,
	getTypeChecker,
}: FileParserConfig<Result, Output, CustomTags>): Output[] => {
	return result.flatMap((result) => {
		const sourceFile = sourceFilesMap[result[filePath] as string];
		if (!sourceFile) return result as unknown as Output;
		const { testBlockDocComments } = new CommentTagParser<CustomTags>({
			sourceFile,
			tsDocParser,
			excludeTags,
			testBlockTagNames,
			tagSeparator,
			getTypeChecker,
		});
		if (!testBlockDocComments.length) return result as unknown as Output;
		return resultMapper(result, testBlockDocComments);
	});
};
