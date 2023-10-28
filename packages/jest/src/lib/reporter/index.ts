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
	addRootDir,
	writeToFile,
} from '@tsdoc-test-reporter/core';
import type { CompilerOptions } from 'typescript';

import type { TaggedAggregatedResult } from '../types';
import { toUITestResults } from '../renderer';
import { resultMapper } from './reporter.utils';

/**
 * The reporter class being called by Jest when supplied
 * as a argument to 'reporters' config option.
 */
export class TSDocTestReporter<CustomTags extends string = AllTagsName>
	implements Pick<Reporter, 'onRunComplete'>
{
	private readonly options: TsDocTestReporterConfig<CustomTags>;
	private readonly compilerOptions: CompilerOptions;
	private rootDir: string;
	private packageDir: string;

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
		this.packageDir = this.rootDir.replace(process.cwd(), '');
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
				resultMapper,
				sourceFilesMap: getSourceFilesMap(results.testResults, 'testFilePath', program),
				excludeTags: this.options.excludeTags as AllTagsName[],
				tagSeparator: this.options.tagSeparator,
				testBlockTagNames: this.options.testBlockTagNames,
				tsDocParser: new TSDocParser(getTsDocParserConfig(this.options.customTags)),
			}),
		};
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
			buffer: getRenderOutput<TaggedAggregatedResult>(
				this.getTaggedResult(results),
				(result) =>
					toUITestResults(result.testResults, {
						titleFormatter: (title) => this.rootDir && this.rootDir !== "."
							? title.replace(this.rootDir, '')
							: title,
						...this.options.uiOptions,
					}),
				this.options,
				this.options.repoUrl ? addRootDir(`${this.options.repoUrl}${this.packageDir}`) : undefined,
			),
		});
	}
}
