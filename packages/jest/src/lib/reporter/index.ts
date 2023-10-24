import { AggregatedResult, Config, Reporter, TestContext } from '@jest/reporters';
import { TSDocParser } from '@microsoft/tsdoc';
import {
	AllTagsName,
	TsDocTestReporterConfig,
	coreDefaults,
	getCompilerOptions,
	getRenderOutput,
	getSourceFilesMap,
	getTsDocParserConfig,
	parseTestFiles,
	programFactory,
	writeToFile,
} from '@tsdoc-test-reporter/core';
import type { CompilerOptions } from 'typescript';

import type { TaggedAggregatedResult } from '../types';
import { toUITestResults } from '../renderer';
import { resultMapper } from './reporter.utils';

export class TSDocTestReporter<CustomTags extends string = AllTagsName>
	implements Pick<Reporter, 'onRunComplete'>
{
	private readonly options: TsDocTestReporterConfig<CustomTags>;
	private readonly compilerOptions: CompilerOptions;

	constructor(_globalConfig: Config.GlobalConfig, options: TsDocTestReporterConfig<CustomTags>) {
		this.options = {
			...coreDefaults,
			...options,
		};
		this.compilerOptions = getCompilerOptions(options.tsConfigPath);
	}

	public getTaggedResult(results: AggregatedResult): TaggedAggregatedResult {
		const program = programFactory(results.testResults, 'testFilePath', this.compilerOptions);
		return {
			...results,
			testResults: parseTestFiles({
				getTypeChecker: program.getTypeChecker,
				result: results.testResults,
				filePath: 'testFilePath',
				resultMapper,
				sourceFilesMap: getSourceFilesMap(results.testResults, 'testFilePath', program),
				excludeTags: this.options.excludeTags as AllTagsName[],
				tagSeparator: this.options.tagSeparator,
				testBlockTagNames: this.options.testBlockTagNames,
				tsDocParser: new TSDocParser(getTsDocParserConfig(this.options.customTags)),
			}),
		};
	}

	public onRunComplete(
		_testContexts: Set<TestContext>,
		results: AggregatedResult,
	): void | Promise<void> {
		writeToFile({
			outputFileType: this.options.outputFileType ?? coreDefaults.outputFileType,
			outputFileName: this.options.outputFileName ?? coreDefaults.outputFileName,
			buffer: getRenderOutput<TaggedAggregatedResult>(
				this.getTaggedResult(results),
				(result) => toUITestResults(result.testResults, this.options.uiOptions),
				this.options,
			),
		});
	}
}
