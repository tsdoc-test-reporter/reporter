import { AggregatedResult, Config, Reporter, TestContext } from '@jest/reporters';
import { type ITSDocTagDefinitionParameters, TSDocParser } from '@microsoft/tsdoc';
import {
	AllTagsName,
	OutputFileType,
	TestBlockName,
	TsDocTestReporterConfig,
	UIOptions,
	coreDefaults,
	defaultOutputFileName,
	getCompilerOptions,
	getSourceFilesMap,
	getTsDocParserConfig,
	parseTestFiles,
	render,
	writeToFile,
} from '@tsdoc-test-reporter/core';
import type { CompilerOptions } from 'typescript';

import type { TaggedAggregatedResult } from '../types';
import { toUITestResults } from '../renderer';
import { resultMapper } from './reporter.utils';

export class TsDocTestReporter<CustomTags extends string = string>
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
	private readonly outputJsonAs: 'raw' | 'ui';

	constructor(_globalConfig: Config.GlobalConfig, options: TsDocTestReporterConfig<CustomTags>) {
		this.applyTags = options.applyTags ?? (coreDefaults.applyTags as (AllTagsName | CustomTags)[]);
		this.customTags = options.customTags;
		this.tagSeparator = options.tagSeparator ?? coreDefaults.tagSeparator;
		this.testBlockTagNames = options.testBlockTagNames ?? coreDefaults.testBlockTagNames;
		this.outputFileType = options.outputFileType ?? 'html';
		this.outputFileName = options.outputFileName ?? defaultOutputFileName;
		this.outputJsonAs = options.outputJsonAs ?? 'raw';
		this.uiOptions = options.uiOptions ?? {};
		this.compilerOptions = getCompilerOptions(options.tsConfigPath);
	}

	private getBuffer(result: TaggedAggregatedResult): string {
		switch (this.outputFileType) {
			case 'html':
				return render(toUITestResults(result.testResults, this.uiOptions), this.uiOptions);
			case 'json':
				return JSON.stringify(
					this.outputJsonAs === 'raw'
						? result
						: {
								results: toUITestResults(result.testResults, this.uiOptions),
						  },
				);
			default:
				return '';
		}
	}

	public onRunComplete(
		_testContexts: Set<TestContext>,
		results: AggregatedResult,
	): void | Promise<void> {
		const sourceFilesMap = getSourceFilesMap(
			results.testResults,
			'testFilePath',
			this.compilerOptions,
		);
		const testResults = parseTestFiles({
			result: results.testResults,
			filePath: 'testFilePath',
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
			buffer: this.getBuffer({
				...results,
				testResults,
			}),
		});
	}
}
