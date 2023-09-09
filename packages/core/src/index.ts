export type {
	AllTagsName as BlockTagNames,
	TestBlockDocComment,
	TestBlockName as TestBlockNames,
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
} from './lib/test-utils/factory';
