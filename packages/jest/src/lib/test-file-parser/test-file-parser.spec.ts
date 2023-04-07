import { ITSDocTagDefinitionParameters, TSDocParser } from '@microsoft/tsdoc';

import {
	testFileParserBasicFileName,
	testFileParserBasicSourceFile,
} from './test-data/test-file-parser-basic.source-file';
import { testFileParserBasicAggregatedResult } from './test-data/test-file-parser-basic.test-results';
import { testFileParserCustomAggregatedResult } from './test-data/test-file-parser-custom.test-results';

import { parseTestFiles } from '.';
import { testFileParserCustomFileName, testFileParserCustomSourceFile } from './test-data/test-file-parser-custom.source-file';
import { getTsDocParserConfig } from '../utils/tsdoc.util';
import { coreDefaults } from '@tsdoc-test-reporter/core';

test('parse and tag test for files', () => {
	const taggedTestResults = parseTestFiles({
		testResults: testFileParserBasicAggregatedResult.testResults,
		tsDocParser: new TSDocParser(),
		sourceFilesMap: {
			[testFileParserBasicFileName]: testFileParserBasicSourceFile,
		},
	});
	expect(taggedTestResults[0].testFilePath).toEqual(
		'test-file-parser-basic.source-file.ts'
	);
	const testResult = taggedTestResults[0].testResults;
	const firstResult = testResult[0];
	expect(firstResult.title).toEqual('should validate email');
	expect(firstResult.ancestorTitles).toEqual(['form validation']);
	const firstTag = firstResult.testBlockComments?.[0];
	expect(firstTag?.testFilePath).toEqual(
		'test-file-parser-basic.source-file.ts'
	);
	expect(firstTag?.title).toEqual('should validate email');
	const tags = firstTag?.testBlockTags
		? firstTag.testBlockTags['@remarks']
		: undefined;
	expect(tags?.tags).toEqual(['acceptance criteria']);
	expect(tags?.testTitle).toEqual('should validate email');
});

test('parse and tag custom tags', () => {
	const customTags: ITSDocTagDefinitionParameters[] = [
		{
			tagName: "@custom",
			syntaxKind: 1,
		},
		{
			tagName: "@custom2",
			syntaxKind: 1,
		}
	]
	const taggedTestResults = parseTestFiles({
		applyTags: [...coreDefaults.applyTags, "@custom", "@custom2"],
		testResults: testFileParserCustomAggregatedResult.testResults,
		tsDocParser: new TSDocParser(getTsDocParserConfig(customTags)),
		sourceFilesMap: {
			[testFileParserCustomFileName]: testFileParserCustomSourceFile,
		},
	});
	expect(taggedTestResults[0].testFilePath).toEqual(
		'test-file-parser-custom.source-file.ts'
	);
	const testResult = taggedTestResults[0].testResults;
	const firstResult = testResult[0];
	const firstTag = firstResult.testBlockComments?.[0];
	const tags = firstTag?.testBlockTags
		? firstTag.testBlockTags['@custom2']
		: undefined;
	expect(tags?.tags).toEqual(['acceptance criteria']);
	const firstAncestorTag = firstResult.ancestorTestBlockComments?.[0];
	const ancestorTags = firstAncestorTag?.testBlockTags
		? firstAncestorTag.testBlockTags['@custom']
		: undefined;
	expect(ancestorTags?.tags).toEqual(['unit tests']);
});
