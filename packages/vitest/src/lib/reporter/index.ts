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
	getTestTitleFromExpression,
	AllTagsName,
} from '@tsdoc-test-reporter/core';
import type { Reporter, File } from 'vitest';
import { TSDocParser } from '@microsoft/tsdoc';
import type { CompilerOptions } from 'typescript';
import type { TaggedFile } from '../../types';
import { toUITestResults } from '../renderer';
import { resultMapper } from './reporter.utils';

export class TSDocTestReporter<CustomTags extends string = AllTagsName> implements Reporter {
	private readonly compilerOptions: CompilerOptions;
	private readonly options: TsDocTestReporterConfig<CustomTags>;

	constructor(options?: TsDocTestReporterConfig<CustomTags>) {
		this.options = {
			...coreDefaults,
			...options,
		};
		this.compilerOptions = getCompilerOptions(options?.tsConfigPath);
	}

	public getTaggedResult(files: File[]): TaggedFile[] {
		const program = programFactory(files, 'filepath', this.compilerOptions);
		const typeChecker = program.getTypeChecker();
		return parseTestFiles<File, TaggedFile>({
			result: files,
			filePath: 'filepath',
			resultMapper,
			getTestTitleFromExpression: (expression) =>
				getTestTitleFromExpression(expression, typeChecker),
			sourceFilesMap: getSourceFilesMap(files, 'filepath', program),
			excludeTags: this.options.excludeTags as AllTagsName[],
			tagSeparator: this.options.tagSeparator,
			testBlockTagNames: this.options.testBlockTagNames,
			tsDocParser: new TSDocParser(getTsDocParserConfig(this.options.customTags)),
		});
	}

	onFinished(files?: File[]) {
		writeToFile({
			outputFileType: this.options.outputFileType ?? coreDefaults.outputFileType,
			outputFileName: this.options.outputFileName ?? coreDefaults.outputFileName,
			buffer: getRenderOutput<TaggedFile[]>(
				this.getTaggedResult(files ?? []),
				(result) => toUITestResults(result, this.options.uiOptions),
				this.options,
			),
		});
	}
}
