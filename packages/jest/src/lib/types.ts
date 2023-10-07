import type { AggregatedResult, AssertionResult, TestResult } from '@jest/test-result';
import type { ITSDocTagDefinitionParameters, TSDocParser } from '@microsoft/tsdoc';
import type {
	AllTagsName,
	CommentTagParserConfig,
	WithTestDocBlockComments,
} from '@tsdoc-test-reporter/core';
import type { SourceFile } from 'typescript';

export type OutputFileType = 'json' | 'html';

export type StatusToIconMap = Record<AssertionResult['status'], string>;

/**
 * Options for when rendering the output for `html`
 */
export type UIOptions = {
	/** Overrides specific colors in the error output. The key is
	 * the ANSI color you want to override and the value should be
	 * a HEX color.
	 * @example
	 * { ansiCustomColorMap: { 0: '#001', 1: '#B00' }
	 */
	ansiCustomColorMap?: Record<number, string>;
	/** Hide the breadcrumbs from ancestors on invidual test result
	 * @example
	 * false: `describe > describe > test`
	 * true: `test`
	 */
	hideAncestorTitles?: boolean;
	/** Hides the tags from ancestors (describe blocks) on individual test result */
	hideAncestorTags?: boolean;
	/** Removes the `@` symbol on tags in the generated output.
	 * @example
	 * `@beta` -> `beta`
	 */
	removeAtSignOnTags?: boolean;
	/** Shows the name of the tag on block type tags
	 * @example
	 * `a tag name` -> `@remarks a tag name`
	 */
	showTagNameOnBlockTags?: boolean;
	/** Maps a specific status to a supplied icon, overrides default.
	 * @example
	 * { statusToIconMap: { passed: '🎉' } }
	 * */
	statusToIconMap?: StatusToIconMap;
	/** Custom CSS styling to pass in, will be placed below any existing styling
	 * in the script tag in the header
	 * @example
	 * { style: ":root { --tag-background-color: #FFF; }" }
	 * */
	style?: string;
	/** Maps a specific tag title to a supplied icon. The supplied key in
	 * the object passed must match the exact content of a block tag to be applied.
	 * @example
	 *  In your test:
	 *   `@remarks WCAG criteria`
	 *  In config:
	 *    { tagTitleToIconMap: { "WCAG criteria": '♿' } }
	 * */
	tagTitleToIconMap?: Record<string, string>;
	/** Sets the `<title>` in the head of the generated HTML file  */
	title?: string;
};

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
 * @internal
 */
export type FileParserConfig<CustomTags extends string> = Pick<
	CommentTagParserConfig<CustomTags>,
	'applyTags' | 'testBlockTagNames' | 'tagSeparator'
> & {
	testResults: TestResult[];
	tsDocParser: TSDocParser;
	sourceFilesMap: Record<string, SourceFile | undefined>;
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
