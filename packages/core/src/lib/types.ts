import type { ITSDocTagDefinitionParameters, TSDocParser } from '@microsoft/tsdoc';
import type { SourceFile } from 'typescript';

/**
 * Describes if the tag is part of the specification or if it
 * is a user supplied tag.
 */
export type TagType = 'standard' | 'custom';

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
 * All tag names that are specified as block in TSDoc.
 * @see {@link https://tsdoc.org/pages/spec/tag_kinds/}
 */
export type BlockTagName = '@privateRemarks' | '@remarks' | '@deprecated';
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
export type TestBlockTag<CustomTags extends string = string> = {
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
};

export type TestBlockTagMap<CustomTags extends string = string> = Partial<
	Record<AllTagsName | CustomTags, TestBlockTag<CustomTags>>
>;

/**
 * Representation of a TSDoc comment with all parsed tags
 */
export type TestBlockDocComment<CustomTags extends string = string> = {
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
	CustomTags extends string = string,
> = Type & {
	testBlockComments?: TestBlockDocComment<CustomTags>[];
};

export type ICommentTagParser<CustomTags extends string> = {
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
	 * Which tags to apply when parsing.
	 * Use @see {@link CoreDefaults.applyTags} if you want to extend
	 * @example
	 * ```ts
	 *{
	 * applyTags: [...coreDefaults.applyTags, "@custom"]
	 *}
	 * ```
	 */
	applyTags?: (AllTagsName | CustomTags)[];
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
};

/**
 * Main config for the reporter used by the consumer
 */
export type TsDocTestReporterConfig<CustomTags extends string = AllTagsName> = Pick<
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
	/**
	 * Sets if output when json is raw data or the same data that is rendered
	 * when using HTML
	 * @default 'raw'
	 */
	outputJsonAs?: 'raw' | 'ui';
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

export type CoreDefaults<CustomTags extends string = AllTagsName> = {
	testBlockTagNames: TestBlockName[];
	tagSeparator: string;
	applyTags: (AllTagsName | CustomTags)[];
	outputFileType: OutputFileType;
	outputFileName: string;
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
	 * @default false
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
	 * @example
	 * false: `describe > describe > test`
	 * true: `test`
	 */
	hideAncestorTitles?: boolean;
	/** Hides the tags from ancestors (describe blocks) on individual test result */
	hideAncestorTags?: boolean;
	/**
	 * Custom formatting of test file path shown in accordion summary
	 * @param title filepath
	 */
	formatTitle?: (title: string) => string;
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
	statusToIconMap?: Record<string, string>;
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
 * @internal
 */
export type FileParserConfig<
	Result extends object,
	Output extends object,
	CustomTags extends string = string,
> = Pick<CommentTagParserConfig<CustomTags>, 'applyTags' | 'testBlockTagNames' | 'tagSeparator'> & {
	result: Result[];
	tsDocParser: TSDocParser;
	sourceFilesMap: Record<string, SourceFile | undefined>;
	resultMapper: (result: Result, testBlockDocComments: TestBlockDocComment[]) => Output;
	filePath: keyof Result;
};

export type UITag = {
	text: string;
	icon?: string;
	type: TestBlockType;
	name: AllTagsName;
};

export type UIAssertion = {
	title: string;
	ancestorTitles?: string[];
	status: 'pass' | 'fail' | 'skip' | 'todo' | 'run' | 'only';
	tags: UITag[];
};

export type UITestResultMeta = {
	passed: number;
	failed: number;
	skipped: number;
	todo: number;
};

export type UITestResult = {
	title: string;
	meta: UITestResultMeta;
	aggregatedTags?: UITag[];
	assertions: UIAssertion[];
};
