import type {
	AggregatedResult,
	AssertionResult,
	TestResult,
} from '@jest/test-result';
import type {
	ITSDocTagDefinitionParameters,
	TSDocParser,
} from '@microsoft/tsdoc';
import type {
	BlockTagNames,
	CommentTagParserConfig,
	WithTestDocBlockComments,
} from '@tsdoc-test-reporter/core';
import type { SourceFile } from 'typescript';

export type OutputFileType = 'json' | 'html';

export type StatusToIconMap = Record<AssertionResult['status'], string>;

export type UIOptions = {
	title?: string;
	style?: string;
	statusToIconMap?: StatusToIconMap;
	ansiCustomColorMap?: Record<number, string>;
	tagTitleToIconMap?: Record<string, string>;
	hideAncestorTitles?: boolean;
	hideAncestorTags?: boolean;
};

export type FileParserConfig<CustomTag extends string> = Pick<
	CommentTagParserConfig<CustomTag>,
	'applyTags' | 'testBlockTagNames' | 'tagSeparator'
> & {
	testResults: TestResult[];
	tsDocParser: TSDocParser;
	sourceFilesMap: Record<string, SourceFile | undefined>;
};

export type TsDocTaggedTestReporterConfig<CustomTag extends string> = Pick<
	CommentTagParserConfig<CustomTag>,
	'applyTags' | 'testBlockTagNames' | 'tagSeparator'
> & {
	customTags?: ITSDocTagDefinitionParameters[];
	outputFileType: OutputFileType;
	outputFileName: string;
	groupBySchema?: TestGrouperSchema<BlockTagNames | CustomTag>;
	uiOptions?: UIOptions;
	tsConfigPath?: string;
};

export type TaggedTestResult<CustomTags extends string = string> =
	TestResult & {
		testResults: TaggedAssertionResult<CustomTags>[];
	};

export type TaggedAssertionResult<CustomTags extends string = string> =
	WithTestDocBlockComments<AssertionResult, CustomTags>;

export type TaggedAggregatedResult<CustomTags extends string = string> =
	AggregatedResult & {
		testResults: TaggedTestResult<CustomTags>[];
	};

export type TestGroup<CustomTags extends string> = Pick<
	TaggedTestResult,
	'numFailingTests' | 'numPassingTests' | 'numPendingTests' | 'numTodoTests'
> & {
	groupTagName: BlockTagNames | CustomTags | 'fileName';
	groupTitle: string;
	numSkippedTests: number;
	testResults?: TaggedAssertionResult<CustomTags>[];
};

export type TestGrouperSchema<CustomTags extends string> = {
	tagName: BlockTagNames | CustomTags;
};

export type TestGrouperConfig<CustomTags extends string> = {
	testResult: TaggedAggregatedResult<CustomTags>;
	schema: TestGrouperSchema<BlockTagNames | CustomTags>;
};
