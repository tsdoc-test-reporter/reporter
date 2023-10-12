import {
	coreDefaults,
	type AllTagsName,
	type TestBlockName,
	getCompilerOptions,
	getTsDocParserConfig,
	writeToFile,
	parseTestFiles,
	UIOptions,
	render,
	TsDocTestReporterConfig,
	defaultOutputFileName,
	OutputFileType,
	getSourceFilesMap,
} from '@tsdoc-test-reporter/core';
import type { Reporter, File } from 'vitest';
import { type ITSDocTagDefinitionParameters, TSDocParser } from '@microsoft/tsdoc';
import type { CompilerOptions } from 'typescript';
import type { TaggedFile } from '../../types';
import { toUITestResults } from '../renderer';
import { resultMapper } from './reporter.utils';

export class TSDocTestReporter<CustomTags extends string = string> implements Reporter {
	private readonly applyTags: (AllTagsName | CustomTags)[];
	private readonly customTags: ITSDocTagDefinitionParameters[] | undefined;
	private readonly tagSeparator: string;
	private readonly testBlockTagNames: TestBlockName[];
	private readonly outputFileType: OutputFileType;
	private readonly outputFileName: string;
	private readonly outputJsonAs: 'raw' | 'ui';
	private readonly compilerOptions: CompilerOptions;
	private readonly uiOptions: UIOptions | undefined;

	constructor(options?: TsDocTestReporterConfig<CustomTags>) {
		this.applyTags = options?.applyTags ?? (coreDefaults.applyTags as (AllTagsName | CustomTags)[]);
		this.customTags = options?.customTags ?? undefined;
		this.tagSeparator = options?.tagSeparator ?? coreDefaults.tagSeparator;
		this.testBlockTagNames = options?.testBlockTagNames ?? coreDefaults.testBlockTagNames;
		this.outputFileType = options?.outputFileType ?? 'html';
		this.outputFileName = options?.outputFileName ?? defaultOutputFileName;
		this.outputJsonAs = options?.outputJsonAs ?? 'raw';
		this.compilerOptions = getCompilerOptions(options?.tsConfigPath);
		this.uiOptions = options?.uiOptions;
	}

	private getBuffer(results: TaggedFile[]): string {
		switch (this.outputFileType) {
			case 'html':
				return render(toUITestResults(results, this.uiOptions), this.uiOptions);
			case 'json':
				return JSON.stringify({
					results: this.outputJsonAs === 'raw' ? results : toUITestResults(results, this.uiOptions),
				});
			default:
				return '';
		}
	}

	onFinished(files?: File[]) {
		if (!files) return;
		const sourceFilesMap = getSourceFilesMap(files, 'filepath', this.compilerOptions);
		const results = parseTestFiles<File, TaggedFile, CustomTags>({
			result: files,
			filePath: 'filepath',
			resultMapper,
			sourceFilesMap,
			applyTags: this.applyTags,
			tagSeparator: this.tagSeparator,
			testBlockTagNames: this.testBlockTagNames,
			tsDocParser: new TSDocParser(getTsDocParserConfig(this.customTags)),
		});

		writeToFile({
			outputFileType: this.outputFileType,
			outputFileName: this.outputFileName,
			buffer: this.getBuffer(results),
		});
	}
}
