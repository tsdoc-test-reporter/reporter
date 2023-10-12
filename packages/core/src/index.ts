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
} from './lib/types';
export { CommentTagParser } from './lib/comment-tag-parser';
export { coreDefaults } from './lib/defaults';
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
	getSourceFileHelper,
	getCompilerOptions,
	getSourceFilesMap,
} from './lib/utils/ts.utils';
export { getTsDocParserConfig } from './lib/utils/tsdoc.utils';
export { writeToFile } from './lib/utils/io.utils';
export { AnsiToHtmlConverter } from './lib/utils/ansi-to-html';
export { parseTestFiles } from './lib/test-file-parser';
export {
	getTagsFromTestBlockComments,
	render,
	aggregateMeta,
	aggregateTags,
	defaultOutputFileName,
	formatTitle,
} from './lib/renderer';
