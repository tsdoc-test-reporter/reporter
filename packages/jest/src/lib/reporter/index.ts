import { AggregatedResult, Config, Reporter, TestContext } from '@jest/reporters';
import { type ITSDocTagDefinitionParameters, TSDocParser } from '@microsoft/tsdoc';
import { AllTagsName, TestBlockName, coreDefaults } from '@tsdoc-test-reporter/core';
import type { CompilerOptions } from 'typescript';

import { defaultOutputFileName } from './defaultValues';

import { render } from '../renderer';
import { parseTestFiles } from '../test-file-parser';
import type {
	OutputFileType,
	TaggedAggregatedResult,
	TsDocTaggedTestReporterConfig,
	UIOptions,
} from '../types';
import { getCompilerOptions, writeToFile } from '../utils/io.util';
import { getSourceFileHelper } from '../utils/typescript.util';
import { getTsDocParserConfig } from '../utils/tsdoc.util';

export class TsDocTaggedTestReporter<CustomTags extends string = string>
	implements Pick<Reporter, 'onRunComplete'>
{
	private readonly applyTags: (AllTagsName | CustomTags)[];
	private readonly customTags: ITSDocTagDefinitionParameters[] | undefined;
	private readonly tagSeparator: string;
	private readonly testBlockTagNames: TestBlockName[];
	private readonly outputFileType: OutputFileType;
	private readonly outputFileName: string;
	private readonly uiOptions: UIOptions;
	private readonly compilerOptions: CompilerOptions;

	constructor(
		_globalConfig: Config.GlobalConfig,
		config: TsDocTaggedTestReporterConfig<CustomTags>
	) {
		this.applyTags = config.applyTags ?? (coreDefaults.applyTags as (AllTagsName | CustomTags)[]);
		this.customTags = config.customTags;
		this.tagSeparator = config.tagSeparator ?? coreDefaults.tagSeparator;
		this.testBlockTagNames = config.testBlockTagNames ?? coreDefaults.testBlockTagNames;
		this.outputFileType = config.outputFileType ?? 'html';
		this.outputFileName = config.outputFileName ?? defaultOutputFileName;
		this.uiOptions = config.uiOptions ?? {};
		this.compilerOptions = getCompilerOptions(config.tsConfigPath);
	}

	public onRunComplete(
		_testContexts: Set<TestContext>,
		results: AggregatedResult
	): void | Promise<void> {
		const fileNames = results.testResults.map((result) => result.testFilePath);
		const getSourceFile = getSourceFileHelper(fileNames, this.compilerOptions);
		const sourceFilesMap = Object.fromEntries(
			results.testResults.map((result) => [result.testFilePath, getSourceFile(result.testFilePath)])
		);

		const result: TaggedAggregatedResult = {
			...results,
			testResults: parseTestFiles({
				applyTags: this.applyTags,
				tagSeparator: this.tagSeparator,
				testBlockTagNames: this.testBlockTagNames,
				testResults: results.testResults,
				tsDocParser: new TSDocParser(getTsDocParserConfig(this.customTags)),
				sourceFilesMap,
			}),
		};

		writeToFile({
			outputFileType: this.outputFileType,
			outputFileName: this.outputFileName,
			buffer:
				this.outputFileType === 'html' ? render(result, this.uiOptions) : JSON.stringify(result),
		});
	}
}
