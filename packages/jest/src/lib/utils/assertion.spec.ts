import { Status } from '@jest/test-result';

import { isStatus } from './assertion.util';

import { assertionResultFactory } from '../test-utils/factory/results';

const assertionStatuses: Status[] = [
	'disabled',
	'failed',
	'passed',
	'pending',
	'skipped',
	'todo',
];

test.each(assertionStatuses)('status %s', (status) => {
	const result = assertionResultFactory({ status });
	expect(isStatus(status)(result));
});
