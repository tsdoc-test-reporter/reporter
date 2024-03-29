import { AggregatedResult, Config, Reporter, Test, TestContext, TestResult } from '@jest/reporters';
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
	rootDirReplacer,
	titleFormatter,
	writeToFile,
} from '@tsdoc-test-reporter/core';
import type { CompilerOptions } from 'typescript';

import type { LogEntry, TaggedAggregatedResult } from '../types';
import { toUITestResults } from '../renderer';
import { resultMapper } from './reporter.utils';

/**
 * The reporter class being called by Jest when supplied
 * as a argument to 'reporters' config option.
 */
export class TSDocTestReporter<CustomTags extends string = AllTagsName>
	implements Pick<Reporter, 'onRunComplete' | "onTestResult">
{
	private readonly options: TsDocTestReporterConfig<CustomTags>;
	private readonly compilerOptions: CompilerOptions;
	private filePathToLogInfo: Record<string, LogEntry[]> = {};
	private rootDir: string;

	/**
	 *
	 * @param globalConfig Config options from Jest
	 * @param options Options passed from consumer
	 */
	constructor(globalConfig: Config.GlobalConfig, options: TsDocTestReporterConfig<CustomTags>) {
		this.options = {
			...coreDefaults,
			...options,
		};
		this.rootDir = globalConfig.rootDir;
		this.compilerOptions = getCompilerOptions(options.tsConfigPath);
	}

	/**
	 * Attached tags to test results
	 * @param results Test result without attached tags
	 * @returns Test Results with attached tags
	 */
	public getTaggedResult(results: AggregatedResult): TaggedAggregatedResult {
		const program = programFactory(results.testResults, 'testFilePath', this.compilerOptions);
		return {
			...results,
			testResults: parseTestFiles({
				getTypeChecker: program.getTypeChecker,
				result: results.testResults,
				filePath: 'testFilePath',
				resultMapper: (result, comments) => resultMapper(result, comments, this.filePathToLogInfo),
				sourceFilesMap: getSourceFilesMap(results.testResults, 'testFilePath', program),
				excludeTags: this.options.excludeTags as AllTagsName[],
				tagSeparator: this.options.tagSeparator,
				testBlockTagNames: this.options.testBlockTagNames,
				tsDocParser: new TSDocParser(getTsDocParserConfig(this.options.customTags)),
			}),
		};
	}

	private getRenderData = (result: TaggedAggregatedResult) => {
		return toUITestResults(result.testResults, {
			titleFormatter: titleFormatter(this.rootDir),
			...this.options.uiOptions,
		});
	};

	private getRenderOutput(results: AggregatedResult): string {
		return getRenderOutput({
			results: this.getTaggedResult(results),
			getRenderData: this.getRenderData,
			options: this.options,
			rootDirReplacer: this.options.repoUrl
				? rootDirReplacer(this.rootDir, this.options.repoUrl)
				: undefined,
		});
	}

	async onTestResult(
		_: Test,
    testResult: TestResult,
	) {
    // Console buffer is sometimes not available when run is complete
		// Extract if available for every test parsed
    if ((this.options.uiOptions?.includeLogs ?? true) && testResult.console?.length) {
      this.filePathToLogInfo[testResult.testFilePath] = testResult.console;
    }
  }

	/**
	 * Runs when all tests are finished and outputs result
	 * to specified output file
	 * @param _testContexts Internals from Jest, not used for this reporter
	 * @param results Test Results
	 */
	public onRunComplete(
		_testContexts: Set<TestContext>,
		results: AggregatedResult,
	): void | Promise<void> {
		writeToFile({
			outputFileType: this.options.outputFileType ?? coreDefaults.outputFileType,
			outputFileName: this.options.outputFileName ?? coreDefaults.outputFileName,
			buffer: this.getRenderOutput(results),
		});
	}
}
