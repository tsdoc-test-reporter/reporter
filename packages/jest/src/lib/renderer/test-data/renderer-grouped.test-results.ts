import { TestGroup } from '../../types';

export const testGroup: TestGroup<string> = {
	groupTitle: 'tag title',
	groupTagName: '@remarks',
	numFailingTests: 0,
	numPassingTests: 0,
	numPendingTests: 0,
	numTodoTests: 0,
	numSkippedTests: 0,
	testResults: [
		{
			ancestorTitles: ['ancestor title'],
			failureDetails: [
				{
					matcherResult: {
						actual: 'undefined',
						expected: 'swish_number_required',
						message:
							'\u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).\u001b[22mnot\u001b[2m.\u001b[22mtoEqual\u001b[2m(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m) // deep equality\u001b[22m\n\nExpected: not \u001b[32m"swish_number_required"\u001b[39m\n',
						name: 'toEqual',
						pass: true,
					},
				},
			],
			failureMessages: [],
			fullName: 'test title',
			numPassingAsserts: 0,
			status: 'failed',
			title: 'test title',
			ancestorTestBlockComments: [
				{
					testFilePath: 'renderer-basic.source-file.ts',
					title: 'describe title',
					testBlockType: 'describe',
					testBlockTags: {
						'@remarks': {
							type: 'standard',
							tags: ['tag title'],
							tagName: '@remarks',
							testBlockType: 'describe',
							testTitle: 'describe title',
						},
					},
					commentStartPosition: 1,
					commentEndPosition: 97,
				},
				{
					testFilePath: 'renderer-basic.source-file.ts',
					title: 'nested describe title',
					testBlockType: 'describe',
					testBlockTags: {
						'@remarks': {
							type: 'standard',
							tags: ['nested describe tag'],
							tagName: '@remarks',
							testBlockType: 'describe',
							testTitle: 'nested describe title',
						},
					},
					commentStartPosition: 134,
					commentEndPosition: 224,
				},
			],
			testBlockComments: [
				{
					testFilePath: 'rendered-basic.source-file.ts',
					title: 'test title',
					testBlockType: 'test',
					testBlockTags: {
						'@remarks': {
							type: 'standard',
							tags: ['test tag'],
							tagName: '@remarks',
							testBlockType: 'test',
							testTitle: 'test title',
						},
					},
					commentStartPosition: 270,
					commentEndPosition: 348,
				},
			],
		},
	],
};

export const groupedResult = new Map<string, TestGroup<string>>([
	['tag title', testGroup],
]);
