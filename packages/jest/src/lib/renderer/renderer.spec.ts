import * as fs from 'node:fs';

import { writeToFile } from '../utils/io.util';

import { render } from '.';
import { taggedAggregatedResultFactory } from '../test-utils/factory';

jest.mock('node:fs');

afterEach(jest.resetAllMocks);

test('renders result', () => {
	writeToFile({
		buffer: render(taggedAggregatedResultFactory()),
		outputFileName: 'output',
		outputFileType: 'html',
	});
	expect(fs.writeFileSync).toHaveBeenCalledWith('output.html', expect.anything(), 'utf-8');
});
