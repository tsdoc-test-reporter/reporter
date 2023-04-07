import * as fs from 'node:fs';

import { groupedResult } from './test-data/renderer-grouped.test-results';
import { reporterBasicAggregatedResult } from './test-data/renderer.test-results';

import { writeToFile } from '../utils/io.util';

import { render } from '.';

jest.mock('node:fs');

afterEach(jest.resetAllMocks);

test('renders grouped result', () => {
	writeToFile({
		buffer: render(groupedResult, {
			tagTitleToIconMap: {
				'test tag': '🙌',
			},
		}),
		outputFileName: 'output',
		outputFileType: 'html',
	});
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'output.html',
		expect.anything(),
		'utf-8'
	);
});

test('renders result', () => {
	writeToFile({
		buffer: render(reporterBasicAggregatedResult),
		outputFileName: 'output',
		outputFileType: 'html',
	});
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'output.html',
		expect.anything(),
		'utf-8'
	);
});
