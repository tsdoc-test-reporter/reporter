import { aggregateTagsForResults } from './utils';
import { taggedAssertionResultFactory } from '../test-utils/factory';

test('do not aggregate duplicates', () => {
	const result = taggedAssertionResultFactory({
		title: 'test',
		status: 'passed',
		ancestorTitles: ['ancestor'],
		testBlockComments: [
			{
				title: 'test',
				testFilePath: 'test.ts',
				testBlockName: 'test',
				testBlockTags: {
					'@beta': {
						name: '@beta',
						testBlockName: 'test',
						testTitle: 'test',
						type: 'standard',
						kind: 'modifier',
					},
				},
			},
		],
		ancestorTestBlockComments: [
			{
				title: 'ancestor',
				testFilePath: 'test.ts',
				testBlockName: 'describe',
				testBlockTags: {
					'@alpha': {
						name: '@alpha',
						testBlockName: 'describe',
						testTitle: 'ancestor',
						type: 'standard',
						kind: 'modifier',
					},
				},
			},
		],
	});
	expect(aggregateTagsForResults([result, result], { aggregateTagsToFileHeading: true })).toEqual(
		'<span class="tag">@alpha</span><span class="tag">@beta</span>',
	);
});
