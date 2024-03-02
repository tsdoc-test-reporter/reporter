import type { ITSDocTagDefinitionParameters, TSDocParser } from '@microsoft/tsdoc';
import type { SourceFile, TypeChecker } from 'typescript';

/**
 * Describes if the tag is part of the specification or if it
 * is a user supplied tag.
 */
export type TagType = 'standard' | 'custom';

/**
 * If the test block belongs to a 'test' or 'describe' block
 */
export type TestBlockType = 'test' | 'ancestor';

/**
 * @hidden
 */
type TestBlockNamesBase = 'describe' | 'test' | 'it';
/**
 * @hidden
 */
type TestBlockNamesExtended =
	| 'each'
	| 'only'
	| 'skip'
	| 'failing'
	| 'fails'
	| 'concurrent'
	| 'todo'
	| 'skipIf'
	| 'runIf'
	| 'sequential'
	| 'shuffle';

/**
 * All names of functions in test files that are considered belonging to
 * the test framework. This includes parents such as `"describe"`.
 * @example
 * "test"
 * "test.each"
 * "describe"
 */
export type TestBlockName =
	| TestBlockNamesBase
	| `${TestBlockNamesBase}.${TestBlockNamesExtended}`
	| `${TestBlockNamesBase}.${TestBlockNamesExtended}.${TestBlockNamesExtended}`
	| `${TestBlockNamesBase}.${TestBlockNamesExtended}.${TestBlockNamesExtended}.${TestBlockNamesExtended}`;

/**
 * All tag names that are specified as modifiers in TSDoc.
 * @see {@link https://tsdoc.org/pages/spec/tag_kinds/}
 */
export type ModifierTagName =
	| '@alpha'
	| '@beta'
	| '@eventProperty'
	| '@experimental'
	| '@internal'
	| '@override'
	| '@packageDocumentation'
	| '@public'
	| '@readonly'
	| '@sealed'
	| '@virtual';

/**
 * All tag names that are specified as block tags in JSDoc
 * @see {@link https://jsdoc.app/}
 */
export type JSDocTagName =
	| '@abstract'
	| '@access'
	| '@alias'
	| '@async'
	| '@augments'
	| '@author'
	| '@borrows'
	| '@callback'
	| '@class'
	| '@classdesc'
	| '@constant'
	| '@constructs'
	| '@copyright'
	| '@default'
	| '@defaultvalue'
	| '@deprecated'
	| '@description'
	| '@enum'
	| '@event'
	| '@example'
	| '@exports'
	| '@external'
	| '@host'
	| '@file'
	| '@fileoverview'
	| '@overview'
	| '@fires'
	| '@emits'
	| '@function'
	| '@func'
	| '@method'
	| '@generator'
	| '@global'
	| '@hideconstructor'
	| '@ignore'
	| '@implements'
	| '@inheritdoc'
	| '@inner'
	| '@instance'
	| '@interface'
	| '@kind'
	| '@lends'
	| '@license'
	| '@listens'
	| '@member'
	| '@var'
	| '@memberof'
	| '@mixes'
	| '@module'
	| '@name'
	| '@namespace'
	| '@override'
	| '@package'
	| '@param'
	| '@arg'
	| '@argument'
	| '@private'
	| '@property'
	| '@prop'
	| '@protected'
	| '@public'
	| '@readonly'
	| '@requires'
	| '@returns'
	| '@return'
	| '@see'
	| '@since'
	| '@static'
	| '@summary'
	| '@this'
	| '@throws'
	| '@exception'
	| '@todo'
	| '@tutorial'
	| '@type'
	| '@typedef'
	| '@variation'
	| '@version'
	| '@yields'
	| '@yield';

/**
 * All tag names that are specified as block in TSDoc.
 * @see {@link https://tsdoc.org/pages/spec/tag_kinds/}
 */
export type BlockTagName = '@privateRemarks' | '@remarks' | '@deprecated' | JSDocTagName;
/**
 * All names of tags: modifiers and blocks.
 */
export type AllTagsName = BlockTagName | ModifierTagName;
/**
 * Specifies which kind the @see {@link TestBlockTag} is.
 * @see {@link https://tsdoc.org/pages/spec/tag_kinds/}
 */
export type TagKind = 'block' | 'modifier' | 'inline';

/**
 * The internal representation of a parsed tag (`@`) from TSDoc.
 */
export type TestBlockTag<CustomTags extends string = AllTagsName> = {
	/**
	 * If the tag is from the Standard TSDoc or is supplied
	 * as a custom tag by the user.
	 * */
	type: TagType;
	/** List of tags that are parsed from block type tags.
	 * @see {@link CommentTagParserConfig.tagSeparator} to specify how to split tags.
	 * @example
	 * test:
	 * "@remarks first, second"
	 * output:
	 * ["first", "second"]
	 */
	tags?: string[];
	/** Then name of the parsed tag. Types as string
	 * because the name can be custom user supplied.
	 * @example
	 * "@remarks"
	 * "@myCustomTag"
	 */
	name: AllTagsName | CustomTags;
	/** Specifies if it is a modifier or block tag  */
	kind: TagKind;
	/** Parsed name of test-function that the comment has been extracted from
	 * @example
	 * test:
	 * test.each("should parse email", () => {})
	 * output:
	 * testBlockName: "test.each"
	 */
	testBlockName: TestBlockName;
	/** The names of the parsed test.
	 * @example
	 * test:
	 * test("should parse email", () => {})
	 * output:
	 * "should parse email"
	 */
	testTitle: string;
	/**
	 * File path for test this tag originates from
	 */
	testFilePath: string;
	/**
	 * If tag belongs to the original JSDoc standard and
	 * is not an extended TSDoc tag.
	 */
	jsDoc?: boolean;
};

export type TestBlockTagMap<CustomTags extends string = AllTagsName> = Partial<
	Record<AllTagsName | CustomTags, TestBlockTag<CustomTags>>
>;

/**
 * Representation of a TSDoc comment with all parsed tags
 */
export type TestBlockDocComment<CustomTags extends string = AllTagsName> = {
	testFilePath: string;
	title: string;
	testBlockName: TestBlockName;
	type: TestBlockType;
	testBlockTags?: TestBlockTagMap<CustomTags>;
	commentStartPosition: number;
	commentEndPosition: number;
};

/**
 * Creates a type that has testBlockComments
 * attached to it
 */
export type WithTestDocBlockComments<
	Type extends object,
	CustomTags extends string = AllTagsName,
> = Type & {
	testBlockComments?: TestBlockDocComment<CustomTags>[];
};

export type ICommentTagParser<CustomTags extends string = AllTagsName> = {
	testBlockDocComments: TestBlockDocComment<CustomTags>[];
};

/**
 * Config for parsing comments from a single file
 */
export type CommentTagParserConfig<CustomTags extends string = AllTagsName> = {
	/** The source file to parse */
	sourceFile: SourceFile;
	/** @see {@link TSDocParser} from `"@microsoft/tsdoc"` that needs
	 * to be supplied to be able to parse tags
	 */
	tsDocParser: TSDocParser;
	/**
	 * Which tags to exclude when parsing.
	 * @example
	 * ```ts
	 *{
	 * 	excludeTags: ["@author"]
	 *}
	 * ```
	 */
	excludeTags?: (AllTagsName | CustomTags)[];
	/**
	 * The names of the test block that will be parsed.
	 * Use @see {@link CoreDefaults.testBlockTagNames} if you want to extend
	 * @example
	 * ```ts
	 *{
	 *  testBlockTagNames: [
	 *   ...coreDefaults.testBlockTagNames.filter(name => !name.includes("describe"))
	 *  ]
	 *}
	 * ```
	 */
	testBlockTagNames?: TestBlockName[];
	/**
	 * Separator to use when parsing block tags if you want to supply multiple tags
	 * to the same block tags
	 * @example
	 * ```ts
	 * { tagSeparator: ";" }
	 * "@remarks: tag1;tag2"
	 * ```
	 * @default ","
	 */
	tagSeparator?: string;
	getTypeChecker: () => TypeChecker;
};

/**
 * Main config for the reporter used by the consumer
 */
export type TsDocTestReporterConfig<CustomTags extends string = AllTagsName> = Pick<
	CommentTagParserConfig<CustomTags>,
	'excludeTags' | 'testBlockTagNames' | 'tagSeparator'
> & {
	customTags?: ITSDocTagDefinitionParameters[];
	/**
	 * @default "html"
	 */
	outputFileType?: OutputFileType;
	/**
	 * Callback that runs right before rendering result
	 * as UITestResult. Useful if you want to modify
	 * the information before rendering.
	 */
	onBeforeRender?: (results: UITestResult[]) => UITestResult[];
	/**
	 * Specifies the name of the generated file. Supports folders.
	 * @example
	 * "output"
	 * "reports/output"
	 * @default 'tsdoc-test-reporter-report'
	 */
	outputFileName?: string;
	/**
	 * Sets if output when json is raw data or the same data that is rendered
	 * when using HTML
	 * @default 'raw'
	 */
	outputJsonAs?: 'raw' | 'ui';
	/**
	 * Set this to add link to origin remote
	 * @example
	 * { repoUrl: "https://github.com/tsdoc-test-reporter/reporter/blob/main" }
	 */
	repoUrl?: string;
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

export type OutputFileType = 'json' | 'html';

export type CoreDefaults<CustomTags extends string = AllTagsName> = Required<
	Pick<CommentTagParserConfig<CustomTags>, 'testBlockTagNames' | 'tagSeparator'>
> & {
	outputFileType: OutputFileType;
	outputFileName: string;
};

export type BuildInfo = {
	text: string;
	url: string;
	position?: 'right' | 'bottom';
};

/**
 * Options for when rendering the output for `html`
 */
export type UIOptions = {
	/**
	 * Aggregates tags on the specific tests up to the title.
	 * Choose to aggregate test tags, with or without ancestor.
	 * Or aggregate only selected tags by passing an array of
	 * tags.
	 * @example
	 * ```js
	 * { aggregateTagsToFileHeading: ["@remarks"] }
	 * ```
	 * ```js
	 * { aggregateTagsToFileHeading: "onlyAncestors" }
	 * ```
	 * @default
	 * false
	 */
	aggregateTagsToFileHeading?: boolean | 'withoutAncestors' | 'onlyAncestors' | AllTagsName[];
	/** Overrides specific colors in the error output. The key is
	 * the ANSI color you want to override and the value should be
	 * a HEX color.
	 * @example
	 * { ansiCustomColorMap: { 0: '#001', 1: '#B00' }
	 */
	ansiCustomColorMap?: Record<number, string>;
	/** Hide the breadcrumbs from ancestors on invidual test result
	 * @default
	 * false
	 * @example
	 * false: `describe > describe > test`
	 * true: `test`
	 */
	hideAncestorTitles?: boolean;
	/**
	 * Displays build link close to heading
	 */
	buildInfo?: BuildInfo;
	/**
	 * Expands the error details element if there is an error on the assertion
	 * @default
	 * false
	 */
	expandErrorDetails?: boolean;
	/**
	 * Hides the tags from ancestors (describe blocks) on individual test result
	 * @default
	 * false
	 */
	hideAncestorTags?: boolean;
	/** Sets the `<title>` in the head of the generated HTML file
	 * @default
	 * Test results
	 */
	htmlTitle?: string;
	/**
	 * Render console.log output in the report 
	 * @default
	 * true
	 */
	includeLogs?: boolean;
	/** Removes the `@` symbol on on the tag name in the generated output.
	 * @default
	 * false
	 * @example
	 * true:
	 * `@beta` -> `beta`
	 * false:
	 * `@beta` -> `@beta`
	 */
	removeAtSignOnTags?: boolean | TagKind[];
	/**
	 * Shows or hides the tag name for block tags
	 * @default
	 * true
	 * @example
	 * true:
	 * `@remarks: tag content`
	 * false:
	 * `tag content`
	 */
	showTagNameOnBlockTags?: boolean;
	/**
	 * Show text next to the summary for skipped, todo, failing and passing tests.
	 * Screen reader text will still read text with number even if hiding text.
	 * @example
	 * true:
	 * `Todo: 2`
	 * false:
	 * `2`
	 * @default
	 * true
	 */
	showTextOnTestSummaryMeta?: boolean;
	/** Maps a specific status to a supplied icon, overrides default.
	 * @example
	 * ```ts
	 * { statusToIconMap: { passed: '🎉' } }
	 * ```
	 * */
	statusToIconMap?: Partial<Record<UIAssertion['status'], string>>;
	/** Custom CSS styling to pass in, will be placed below any existing styling
	 * in the script tag in the header
	 * @example
	 * { style: ":root { --tag-background-color: #FFF; }" }
	 * */
	style?: string;
	/**
	 * Custom formatting of test file path
	 * @param title filepath of file
	 */
	titleFormatter?: (title: string) => string;
	/**
	 * Custom formatter for converting text of tag before rendering.
	 * Add icon property if you want to display an icon instead of the text
	 * when rendering. When icon is set, text will be screen reader only.
	 * @param tag current tag being formatted
	 * @param tagText tag text being formatted, this is the actual text in case when block tag has several tags
	 */
	tagTextAndIconFormatter?: (tag: TestBlockTag, tagText: string) => Pick<UITag, 'text' | 'icon'>;
};

/**
 * @internal
 */
export type FileParserConfig<
	Result extends object,
	Output extends object,
	CustomTags extends string = AllTagsName,
> = Pick<
	CommentTagParserConfig<CustomTags>,
	'excludeTags' | 'testBlockTagNames' | 'tagSeparator' | 'getTypeChecker' | 'tsDocParser'
> & {
	result: Result[];
	sourceFilesMap: Record<string, SourceFile | undefined>;
	resultMapper: (
		result: Result,
		testBlockDocComments: TestBlockDocComment<CustomTags>[],
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		extraData?: Record<string, any>
	) => Output;
	filePath: keyof Result;
};

export type UITag = {
	text: string;
	icon?: string;
	type: TestBlockType;
	name: AllTagsName;
};

export type UITestError = {
	name: string;
	message: string;
	actual?: string;
	expected?: string;
	diff?: string;
};

export type UILogType =
	| 'assert'
	| 'count'
	| 'debug'
	| 'dir'
	| 'dirxml'
	| 'error'
	| 'group'
	| 'groupCollapsed'
	| 'info'
	| 'log'
	| 'time'
	| 'warn';

export type UILog = {
	content: string;
	type: UILogType;
	origin?: string;
};

export type UIAssertion = {
	title: string;
	ancestorTitles?: string[];
	status: 'pass' | 'fail' | 'skip' | 'todo' | 'run' | 'only';
	tags: UITag[];
	errors?: UITestError[];
	logs?: UILog[];
};

export type UITestResultMeta = {
	passed: number;
	failed: number;
	skipped: number;
	todo: number;
	hasLogs?: boolean;
};

export type UITestResult = {
	title: string;
	filePath?: string;
	meta: UITestResultMeta;
	aggregatedTags?: UITag[];
	assertions: UIAssertion[];
	logs?: UILog[];
};

export type ToUITestResults<Type> = (results: Type[], options?: UIOptions) => UITestResult[];
export type ToUITestError<Error> = (error: Error) => UITestError;
export type ToUILog<Log> = (log: Log) => UILog;

export type GetRenderOutputConfig<Type> = {
	results: Type;
	getRenderData: (results: Type) => UITestResult[];
	options: TsDocTestReporterConfig<string>;
	rootDirReplacer?: (filePath: string) => string;
};
