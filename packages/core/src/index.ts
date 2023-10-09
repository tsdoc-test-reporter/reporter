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
} from './lib/types';
export { CommentTagParser } from './lib/comment-tag-parser';
export { coreDefaults } from './lib/defaults';
export {
	testBlockTagFactory,
	testDocBlockCommentFactory,
	TestDataFactory,
	sourceFileFactory,
	testFileFactory,
} from './lib/test-utils/factory';
export {
	getCompilerOptionsThatFollowExtends,
	getSourceFileHelper,
	getCompilerOptions,
} from './lib/utils/ts.utils';
export { getTsDocParserConfig } from './lib/utils/tsdoc.utils';
export { writeToFile } from './lib/utils/io.utils';
export { renderTag, renderTags, aggregateTags } from './lib/utils/render.utils';
