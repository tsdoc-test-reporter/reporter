import type { CommentTagParserConfig, OutputFileType, UIOptions, WithTestDocBlockComments } from '@tsdoc-test-reporter/core';
import { type ITSDocTagDefinitionParameters } from '@microsoft/tsdoc';

import type { File, Task } from 'vitest';

export type TaggedTask<CustomTags extends string = string> = WithTestDocBlockComments<
	Omit<Task, 'tasks'>,
	CustomTags
> & { tasks?: TaggedTask[] };

export type TaggedFile<CustomTags extends string = string> = WithTestDocBlockComments<
	Omit<File, 'tasks'>,
	CustomTags
> & { tasks?: TaggedTask[] };

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