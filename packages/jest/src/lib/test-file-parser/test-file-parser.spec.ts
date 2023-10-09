import { TSDocParser } from '@microsoft/tsdoc';

import { parseTestFiles } from './index';
import { TestBlockDocComment, testFileFactory } from '@tsdoc-test-reporter/core';
import { aggregatedResultFactory } from '../test-utils/factory';

test('parse and tag test for source files', () => {
	const sourceFile = testFileFactory({
		fileName: 'basic.ts',
		options: [
			{
				testTitle: '@alpha',
				testBlockName: 'test',
				tags: [
					{
						tagName: '@alpha',
					},
				],
			},
		],
	});
	const { testResults } = aggregatedResultFactory({
		testResults: [
			{
				testFilePath: 'basic.ts',
				testResults: [
					{
						ancestorTitles: [],
						fullName: '@alpha',
						title: '@alpha',
						numPassingAsserts: 1,
						status: 'passed',
						failureDetails: [],
						failureMessages: [],
					},
				],
			},
		],
	});
	const result = parseTestFiles({
		result: testResults,
		tsDocParser: new TSDocParser(),
		sourceFilesMap: {
			[sourceFile.fileName]: sourceFile,
		},
	});
	expect(result[0].testResults[0].testBlockComments).toEqual<TestBlockDocComment[]>([
		{
			testFilePath: sourceFile.fileName,
			title: '@alpha',
			testBlockName: 'test',
			commentStartPosition: 1,
			commentEndPosition: 19,
			testBlockTags: {
				'@alpha': {
					kind: 'modifier',
					name: '@alpha',
					testBlockName: 'test',
					testTitle: '@alpha',
					type: 'standard',
				},
			},
		},
	]);
});

test('parse and tag test for source files with ancestors', () => {
	const sourceFile = testFileFactory({
		fileName: 'basic.ts',
		options: [
			{
				testTitle: 'ancestor',
				testBlockName: 'describe',
				tags: [
					{
						tagName: '@alpha',
					},
				],
				children: [
					{
						testBlockName: 'test',
						testTitle: 'child',
						tags: [
							{
								tagName: '@beta',
							},
						],
					},
				],
			},
		],
	});
	const { testResults } = aggregatedResultFactory({
		testResults: [
			{
				testFilePath: 'basic.ts',
				testResults: [
					{
						ancestorTitles: ['ancestor'],
						fullName: 'child',
						title: 'child',
						numPassingAsserts: 1,
						status: 'passed',
						failureDetails: [],
						failureMessages: [],
					},
				],
			},
		],
	});
	const result = parseTestFiles({
		result: testResults,
		tsDocParser: new TSDocParser(),
		sourceFilesMap: {
			[sourceFile.fileName]: sourceFile,
		},
	});
	expect(result[0].testResults[0].testBlockComments).toEqual<TestBlockDocComment[]>([
		{
			testFilePath: sourceFile.fileName,
			title: 'child',
			testBlockName: 'test',
			commentStartPosition: 53,
			commentEndPosition: 72,
			testBlockTags: {
				'@beta': {
					kind: 'modifier',
					name: '@beta',
					testBlockName: 'test',
					testTitle: 'child',
					type: 'standard',
				},
			},
		},
	]);
	expect(result[0].testResults[0].ancestorTestBlockComments).toEqual<TestBlockDocComment[]>([
		{
			testFilePath: sourceFile.fileName,
			title: 'ancestor',
			testBlockName: 'describe',
			commentStartPosition: 1,
			commentEndPosition: 19,
			testBlockTags: {
				'@alpha': {
					kind: 'modifier',
					name: '@alpha',
					testBlockName: 'describe',
					testTitle: 'ancestor',
					type: 'standard',
				},
			},
		},
	]);
});

test('pass down parser options when parsing files', () => {
	const sourceFile = testFileFactory({
		fileName: 'basic.ts',
		options: [
			{
				testTitle: '@remarks',
				testBlockName: 'test',
				tags: [
					{
						tagName: '@remarks',
						tagContent: 'unit;acceptance',
					},
					{
						tagName: '@alpha',
					},
				],
			},
			{
				testTitle: 'ignored',
				testBlockName: 'it',
				tags: [
					{
						tagName: '@alpha',
					},
				],
			},
		],
	});
	const { testResults } = aggregatedResultFactory({
		testResults: [
			{
				testFilePath: 'basic.ts',
				testResults: [
					{
						ancestorTitles: [],
						fullName: '@remarks',
						title: '@remarks',
						numPassingAsserts: 1,
						status: 'passed',
						failureDetails: [],
						failureMessages: [],
					},
					{
						ancestorTitles: [],
						fullName: 'ignored',
						title: 'ignored',
						numPassingAsserts: 1,
						status: 'passed',
						failureDetails: [],
						failureMessages: [],
					},
				],
			},
		],
	});
	const result = parseTestFiles({
		applyTags: ['@remarks'],
		tagSeparator: ';',
		testBlockTagNames: ['test'],
		result: testResults,
		tsDocParser: new TSDocParser(),
		sourceFilesMap: {
			[sourceFile.fileName]: sourceFile,
		},
	});
	expect(result[0].testResults[0].testBlockComments).toEqual<TestBlockDocComment[]>([
		{
			testFilePath: sourceFile.fileName,
			title: '@remarks',
			testBlockName: 'test',
			commentStartPosition: 1,
			commentEndPosition: 47,
			testBlockTags: {
				'@remarks': {
					kind: 'block',
					name: '@remarks',
					testBlockName: 'test',
					testTitle: '@remarks',
					type: 'standard',
					tags: ['unit', 'acceptance'],
				},
			},
		},
	]);
});
