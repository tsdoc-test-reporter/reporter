export type {
	AllTagsName,
	TestBlockDocComment,
	TestBlockName,
	CoreDefaults,
	ICommentTagParser,
	CommentTagParserConfig,
	WithTestDocBlockComments,
	TestBlockTag,
	UIOptions,
	OutputFileType,
	FileParserConfig,
	UITestResult,
	UIAssertion,
	UITag,
	UITestResultMeta,
	TsDocTestReporterConfig,
	TestBlockTagMap,
	UITestError,
	BuildInfo,
} from './lib/types';
export { CommentTagParser } from './lib/comment-tag-parser';
export { coreDefaults, allBlockTags, allJSDocTags, allModifierTags } from './lib/defaults';
export {
	testBlockTagFactory,
	testDocBlockCommentFactory,
	TestDataFactory,
	sourceFileFactory,
	testFileFactory,
	DeepPartial,
} from './lib/test-utils/factory';
export {
	getCompilerOptionsThatFollowExtends,
	programFactory,
	getCompilerOptions,
	getSourceFilesMap,
	getTestTitleFromExpression,
} from './lib/utils/ts.utils';
export { getTsDocParserConfig } from './lib/utils/tsdoc.utils';
export { writeToFile } from './lib/utils/io.utils';
export { parseTestFiles } from './lib/test-file-parser';
export {
	getTagsFromTestBlockComments,
	render,
	aggregateMeta,
	aggregateTags,
	defaultOutputFileName,
	getRenderOutput,
} from './lib/renderer';
export { rootDirReplacer } from './lib/utils/string.utils';
