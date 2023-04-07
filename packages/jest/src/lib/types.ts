import type {
	AggregatedResult,
	AssertionResult,
	TestResult,
} from '@jest/test-result';
import type { ITSDocTagDefinitionParameters, TSDocParser } from '@microsoft/tsdoc';
import type {
	BlockTagNames,
	CommentTagParserConfig,
	TestBlockDocComment,
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

export type TaggedAggregatedResult<CustomTag extends string = string> =
	AggregatedResult & {
		testResults: TaggedTestResult<CustomTag>[];
	};

export type TaggedTestResult<CustomTag extends string = string> = TestResult & {
	testResults: TaggedAssertionResult<CustomTag>[];
};

export type TaggedAssertionResult<CustomTag extends string = string> =
	AssertionResult & {
		ancestorTestBlockComments?: TestBlockDocComment<CustomTag>[];
		testBlockComments?: TestBlockDocComment<CustomTag>[];
	};

export type TestGroup<CustomTag extends string> = Pick<
	TaggedTestResult,
	'numFailingTests' | 'numPassingTests' | 'numPendingTests' | 'numTodoTests'
> & {
	groupTagName: BlockTagNames | CustomTag | 'fileName';
	groupTitle: string;
	numSkippedTests: number;
	testResults?: TaggedAssertionResult<CustomTag>[];
};

export type TestGrouperSchema<CustomTag extends string> = {
	tagName: BlockTagNames | CustomTag;
};

export type TestGrouperConfig<CustomTag extends string> = {
	testResult: TaggedAggregatedResult<CustomTag>;
	schema: TestGrouperSchema<BlockTagNames | CustomTag>;
};
