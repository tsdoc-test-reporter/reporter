export type {
	AllTagsName,
	TestBlockDocComment,
	TestBlockName,
	CoreDefaults,
	ICommentTagParser,
	CommentTagParserConfig,
	WithTestDocBlockComments,
	TestBlockTag,
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
