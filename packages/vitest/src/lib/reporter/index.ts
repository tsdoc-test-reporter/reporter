import {
	coreDefaults,
	getCompilerOptions,
	getTsDocParserConfig,
	writeToFile,
	parseTestFiles,
	TsDocTestReporterConfig,
	getSourceFilesMap,
	getRenderOutput,
	programFactory,
	AllTagsName,
	rootDirReplacer,
} from '@tsdoc-test-reporter/core';
import type { Reporter, File, Vitest } from 'vitest';
import { TSDocParser } from '@microsoft/tsdoc';
import type { CompilerOptions } from 'typescript';
import type { TaggedFile } from '../../types';
import { toUITestResults } from '../renderer';
import { resultMapper } from './reporter.utils';

/**
 * The reporter class
 */
export class TSDocTestReporter<CustomTags extends string = AllTagsName> implements Reporter {
	private readonly compilerOptions: CompilerOptions;
	private readonly options: TsDocTestReporterConfig<CustomTags>;
	private rootDir: string | undefined;

	/**
	 *
	 * @param options Options passed from consumer
	 */
	constructor(options?: TsDocTestReporterConfig<CustomTags>) {
		this.options = {
			...coreDefaults,
			...options,
		};
		this.compilerOptions = getCompilerOptions(options?.tsConfigPath);
	}

	onInit(ctx: Vitest): void {
		this.rootDir = ctx.config.root;
	}

	/**
	 * Attached tags to test results
	 * @param results Test result without attached tags
	 * @returns Test Results with attached tags
	 */
	public getTaggedResult(files: File[]): TaggedFile[] {
		const program = programFactory(files, 'filepath', this.compilerOptions);
		return parseTestFiles<File, TaggedFile>({
			result: files,
			filePath: 'filepath',
			resultMapper,
			getTypeChecker: program.getTypeChecker,
			sourceFilesMap: getSourceFilesMap(files, 'filepath', program),
			excludeTags: this.options.excludeTags as AllTagsName[],
			tagSeparator: this.options.tagSeparator,
			testBlockTagNames: this.options.testBlockTagNames,
			tsDocParser: new TSDocParser(getTsDocParserConfig(this.options.customTags)),
		});
	}

	/**
	 * Runs when all tests are finished and outputs result
	 * to specified output file
	 */
	onFinished(files?: File[]) {
		writeToFile({
			outputFileType: this.options.outputFileType ?? coreDefaults.outputFileType,
			outputFileName: this.options.outputFileName ?? coreDefaults.outputFileName,
			buffer: getRenderOutput<TaggedFile[]>(
				this.getTaggedResult(files ?? []),
				(result) =>
					toUITestResults(result, {
						titleFormatter: (title) =>
							this.rootDir && this.rootDir !== '.' ? title.replace(this.rootDir, '') : title,
						...this.options.uiOptions,
					}),
				this.options,
				this.options.repoUrl ? rootDirReplacer(this.rootDir, this.options.repoUrl) : undefined,
			),
		});
	}
}
