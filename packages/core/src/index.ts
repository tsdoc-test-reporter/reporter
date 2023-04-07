export type {
	BlockTagNames,
	TestBlockDocComment,
	TestBlockNames,
	CoreDefaults,
	ICommentTagParser,
	CommentTagParserConfig,
} from './lib/types';
export { CommentTagParser } from './lib/comment-tag-parser';
export { coreDefaults } from './lib/defaults';
export {
	testBlockTagFactory,
	testDocBlockCommentFactory,
	TestDataFactory,
	sourceFileFactory,
} from './lib/test-utils/factory';
