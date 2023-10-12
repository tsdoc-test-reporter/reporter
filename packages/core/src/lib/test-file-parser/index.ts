import { CommentTagParser } from '../comment-tag-parser';
import { FileParserConfig } from '../types';

export const parseTestFiles = <
	Result extends object,
	Output extends object,
	CustomTags extends string = string,
>({
	tsDocParser,
	result,
	testBlockTagNames,
	tagSeparator,
	sourceFilesMap,
	applyTags,
	resultMapper,
	filePath,
}: FileParserConfig<Result, Output, CustomTags>): Output[] => {
	return result.flatMap((result) => {
		const sourceFile = sourceFilesMap[result[filePath] as string];
		if (!sourceFile) return result as unknown as Output;
		const { testBlockDocComments } = new CommentTagParser<CustomTags>({
			sourceFile,
			tsDocParser,
			applyTags,
			testBlockTagNames,
			tagSeparator,
		});
		if (!testBlockDocComments.length) return result as unknown as Output;
		return resultMapper(result, testBlockDocComments);
	});
};
