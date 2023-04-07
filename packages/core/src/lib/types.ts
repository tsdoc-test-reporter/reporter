import type { TSDocParser } from '@microsoft/tsdoc';
import type { SourceFile } from 'typescript';

export type TagType = 'standard' | 'custom';

type TestBlockNamesBase = 'describe' | 'test' | 'it';
type TestBlockNamesExtended =
	| 'each'
	| 'only'
	| 'skip'
	| 'failing'
	| 'concurrent'
	| 'todo';

export type TestBlockNames =
	| TestBlockNamesBase
	| `${TestBlockNamesBase}.${TestBlockNamesExtended}`
	| `${TestBlockNamesBase}.${TestBlockNamesExtended}.${TestBlockNamesExtended}`;

export type BlockTagNames = '@privateRemarks' | '@remarks';

export type ModifierTagNames =
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

export type TestBlockTag = {
	type: TagType;
	tags: string[];
	tagName: string;
	testBlockType: TestBlockNames;
	testTitle: string;
};

export type TestBlockDocComment<CustomTags extends string = string> = {
	testFilePath: string;
	title: string;
	testBlockType: TestBlockNames;
	testBlockTags?: Partial<Record<BlockTagNames | CustomTags, TestBlockTag>>;
	commentStartPosition: number;
	commentEndPosition: number;
};

export type ICommentTagParser<CustomTag extends string> = {
	testBlockDocComments: TestBlockDocComment<CustomTag>[];
};

export type CommentTagParserConfig<CustomTag extends string> = {
	sourceFile: SourceFile;
	tsDocParser: TSDocParser;
	applyTags?: (BlockTagNames | CustomTag)[];
	testBlockTagNames?: string[];
	tagSeparator?: string;
};

export type CoreDefaults<CustomTag extends string> = {
	testBlockTagNames: string[];
	tagSeparator: string;
	applyTags: (BlockTagNames | CustomTag)[];
};
