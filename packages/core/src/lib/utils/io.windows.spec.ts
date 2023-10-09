import * as fs from 'node:fs';

import { writeToFile } from './io.utils';

jest.mock('node:fs');

beforeEach(jest.resetModules);

afterEach(jest.resetAllMocks);

jest.mock('node:path', () => {
	return {
		__esModule: true,
		posix: {
			sep: '/',
		},
		sep: '\\',
	};
});

test('writes to nested folder on windows where sep is posix', () => {
	writeToFile({
		buffer: 'buffer',
		outputFileType: 'json',
		outputFileName: 'reports/nested/output',
	});
	expect(fs.writeFileSync).toBeCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(
		'reports\\nested\\output.json',
		expect.anything(),
		'utf-8',
	);
	expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
	expect(fs.mkdirSync).toHaveBeenCalledWith('reports\\nested', {
		recursive: true,
	});
});
