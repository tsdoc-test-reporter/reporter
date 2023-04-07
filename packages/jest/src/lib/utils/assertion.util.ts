import { AssertionResult, Status } from '@jest/test-result';

export const isStatus =
	(status: Status) =>
	(assertion: AssertionResult): boolean => {
		return assertion.status === status;
	};

export const failed = (assertion: AssertionResult) =>
	isStatus('failed')(assertion);
export const passed = (assertion: AssertionResult) =>
	isStatus('passed')(assertion);
export const pending = (assertion: AssertionResult) =>
	isStatus('pending')(assertion);
export const todo = (assertion: AssertionResult) => isStatus('todo')(assertion);
export const skipped = (assertion: AssertionResult) =>
	isStatus('skipped')(assertion);
