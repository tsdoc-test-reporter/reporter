import type { TSDocParser } from '@microsoft/tsdoc';
import type { SourceFile } from 'typescript';

/**
 * Describes if the tag is part of the specification or if it
 * is a user supplied tag.
 */
export type TagType = 'standard' | 'custom';

/**
 * @hidden
 */
type TestBlockNamesBase = 'describe' | 'test' | 'it';
/**
 * @hidden
 */
type TestBlockNamesExtended = 'each' | 'only' | 'skip' | 'failing' | 'concurrent' | 'todo';

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
	| `${TestBlockNamesBase}.${TestBlockNamesExtended}.${TestBlockNamesExtended}`;

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
export type TestBlockTag = {
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
	name: string;
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
	Record<AllTagsName | CustomTags, TestBlockTag>
>;

export type TestBlockDocComment<CustomTags extends string = string> = {
	testFilePath: string;
	title: string;
	testBlockName: TestBlockName;
	testBlockTags?: TestBlockTagMap<CustomTags>;
	commentStartPosition: number;
	commentEndPosition: number;
};

export type WithTestDocBlockComments<
	Type extends object,
	CustomTags extends string = string
> = Type & {
	ancestorTestBlockComments?: TestBlockDocComment<CustomTags>[];
	testBlockComments?: TestBlockDocComment<CustomTags>[];
};

export type ICommentTagParser<CustomTags extends string> = {
	testBlockDocComments: TestBlockDocComment<CustomTags>[];
};

/**
 * Config for parsing comments from a single file
 */
export type CommentTagParserConfig<CustomTags extends string> = {
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

export type CoreDefaults<CustomTags extends string = string> = {
	testBlockTagNames: TestBlockName[];
	tagSeparator: string;
	applyTags: (AllTagsName | CustomTags)[];
};
