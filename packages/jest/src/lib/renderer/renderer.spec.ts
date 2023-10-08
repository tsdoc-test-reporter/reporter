// import * as fs from 'node:fs';

import { writeToFile } from '../utils/io.util';

import { render } from '.';
import { taggedAggregatedResultFactory } from '../test-utils/factory';

test.skip('renders result', () => {
	writeToFile({
		buffer: render(
			taggedAggregatedResultFactory({
				testResults: [
					{
						testFilePath: 'basic.ts',
						testResults: [
							{
								ancestorTitles: ['ancestor'],
								title: 'basic',
								fullName: 'basic',
								ancestorTestBlockComments: [
									{
										testBlockName: 'describe',
										title: 'ancestor',
										testFilePath: 'basic.ts',
										testBlockTags: {
											'@alpha': {
												testTitle: 'basic',
												name: '@alpha',
												testBlockName: 'describe',
												type: 'standard',
												kind: 'modifier',
											},
										},
									},
								],
								testBlockComments: [
									{
										testBlockName: 'test',
										testFilePath: 'basic.ts',
										title: 'test',
										testBlockTags: {
											'@remarks': {
												testTitle: 'basic',
												testBlockName: 'test',
												tags: ['hej'],
												type: 'standard',
												kind: 'block',
												name: '@remarks',
											},
										},
									},
								],
							},
						],
					},
				],
			}),
			{ aggregateTagsToFileHeading: 'onlyAncestors' },
		),
		outputFileName: 'output',
		outputFileType: 'html',
	});
});
