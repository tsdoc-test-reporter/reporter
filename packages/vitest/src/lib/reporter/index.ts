import {
	coreDefaults,
	type AllTagsName,
	type TestBlockName,
	getCompilerOptions,
	getSourceFileHelper,
	getTsDocParserConfig,
	writeToFile,
} from '@tsdoc-test-reporter/core';
import type { Reporter, File } from 'vitest';
import { ITSDocTagDefinitionParameters, TSDocParser } from '@microsoft/tsdoc';
import type { CompilerOptions } from 'typescript';
import { parseTestFiles } from '../test-file-parser';
import { TsDocTestReporterConfig } from '../../types';

export class TSDocTestReporter<CustomTags extends string = string> implements Reporter {
	private applyTags: (AllTagsName | CustomTags)[];
	private customTags: ITSDocTagDefinitionParameters[] | undefined;
	private tagSeparator: string;
	private testBlockTagNames: TestBlockName[];
	private outputFileType: 'html' | 'json';
	private outputFileName: string;
	private compilerOptions: CompilerOptions;

	constructor(options?: TsDocTestReporterConfig<CustomTags>) {
		this.applyTags = options?.applyTags ?? coreDefaults.applyTags as (AllTagsName | CustomTags)[];
		this.customTags = options?.customTags ?? undefined;
		this.tagSeparator = options?.tagSeparator ?? coreDefaults.tagSeparator;
		this.testBlockTagNames = options?.testBlockTagNames ?? coreDefaults.testBlockTagNames;
		this.outputFileType = options?.outputFileType ?? 'json';
		this.outputFileName = options?.outputFileName ?? 'tsdoc-test-reporter-report';
		this.compilerOptions = getCompilerOptions(options?.tsConfigPath);
	}

	onFinished(files?: File[]) {
		if (!files) return;
		const fileNames = files.map((result) => result.filepath);
		const getSourceFile = getSourceFileHelper(fileNames, this.compilerOptions);
		const sourceFilesMap = Object.fromEntries(
			files.map((result) => [result.filepath, getSourceFile(result.filepath)]),
		);
		const result = parseTestFiles({
			result: files,
			applyTags: this.applyTags,
			tagSeparator: this.tagSeparator,
			testBlockTagNames: this.testBlockTagNames,
			tsDocParser: new TSDocParser(getTsDocParserConfig(this.customTags)),
			sourceFilesMap,
		})
		writeToFile({
			outputFileType: this.outputFileType,
			outputFileName: this.outputFileName,
			buffer: JSON.stringify(result),
		});
	}
}
