import type { AggregatedResult, AssertionResult, TestResult } from '@jest/test-result';
import type { ITSDocTagDefinitionParameters } from '@microsoft/tsdoc';
import type {
	AllTagsName,
	CommentTagParserConfig,
	OutputFileType,
	UIOptions,
	WithTestDocBlockComments,
} from '@tsdoc-test-reporter/core';

/**
 * Main config for the reporter used by the consumer
 */
export type TsDocTestReporterConfig<CustomTags extends string = string> = Pick<
	CommentTagParserConfig<CustomTags>,
	'applyTags' | 'testBlockTagNames' | 'tagSeparator'
> & {
	customTags?: ITSDocTagDefinitionParameters[];
	/**
	 * @default "html"
	 */
	outputFileType?: OutputFileType;
	/**
	 * Specifies the name of the generated file. Supports folders.
	 * @example
	 * "output"
	 * "reports/output"
	 * @default 'tsdoc-test-reporter-report'
	 */
	outputFileName?: string;
	/** Options to configure the output of `outputFileType: "html"` */
	uiOptions?: UIOptions;
	/**
	 * Use this option if you have placed your tsconfig in a subfolder
	 * or have renamed your config. The reporter will otherwise
	 * look for the config in the root folder by default.
	 * @default './tsconfig.json'
	 */
	tsConfigPath?: string;
};

/**
 * @see {@link AssertionResult} from Jest with TestDockBlockComments
 * from the parser
 */
export type TaggedAssertionResult<CustomTags extends string = string> = WithTestDocBlockComments<
	AssertionResult,
	CustomTags
>;

export type TaggedTestResult<CustomTags extends string = string> = TestResult & {
	testResults: TaggedAssertionResult<CustomTags>[];
};

export type TaggedAggregatedResult<CustomTags extends string = string> = AggregatedResult & {
	testResults: TaggedTestResult<CustomTags>[];
};

/**
 * @hidden
 */
export type TestGroup<CustomTags extends string> = Pick<
	TaggedTestResult,
	'numFailingTests' | 'numPassingTests' | 'numPendingTests' | 'numTodoTests'
> & {
	groupTagName: AllTagsName | CustomTags | 'fileName';
	groupTitle: string;
	numSkippedTests: number;
	testResults?: TaggedAssertionResult<CustomTags>[];
};

/**
 * @hidden
 */
export type TestGrouperSchema<CustomTags extends string> = {
	tagName: AllTagsName | CustomTags;
};

/**
 * @hidden
 */
export type TestGrouperConfig<CustomTags extends string> = {
	testResult: TaggedAggregatedResult<CustomTags>;
	schema: TestGrouperSchema<AllTagsName | CustomTags>;
};
