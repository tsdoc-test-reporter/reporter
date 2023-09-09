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

export type TestBlockName =
	| TestBlockNamesBase
	| `${TestBlockNamesBase}.${TestBlockNamesExtended}`
	| `${TestBlockNamesBase}.${TestBlockNamesExtended}.${TestBlockNamesExtended}`;

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
	| '@virtual'

export type BlockTagName = '@privateRemarks' | '@remarks' | '@deprecated';
export type AllTagsName = BlockTagName | ModifierTagName;
export type TagKind = 'block' | 'modifier' | 'inline';

export type TestBlockTag = {
	type: TagType;
	tags?: string[];
	name: string;
	kind: TagKind;
	testBlockType: TestBlockName;
	testTitle: string;
};

export type TestBlockDocComment<CustomTags extends string = string> = {
	testFilePath: string;
	title: string;
	testBlockType: TestBlockName;
	testBlockTags?: Partial<Record<AllTagsName | CustomTags, TestBlockTag>>;
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

export type CommentTagParserConfig<CustomTags extends string> = {
	sourceFile: SourceFile;
	tsDocParser: TSDocParser;
	applyTags?: (AllTagsName | CustomTags)[];
	testBlockTagNames?: string[];
	tagSeparator?: string;
};

export type CoreDefaults<CustomTags extends string> = {
	testBlockTagNames: string[];
	tagSeparator: string;
	applyTags: (AllTagsName | CustomTags)[];
};
