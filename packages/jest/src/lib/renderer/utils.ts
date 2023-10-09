import { TaggedAssertionResult } from '../types';
import { UIOptions, aggregateTags } from '@tsdoc-test-reporter/core';

export const aggregateTagsForResults = (results: TaggedAssertionResult[], options?: UIOptions) => {
	return [...new Set(results.map(aggregateTags(options)))].join('');
};
