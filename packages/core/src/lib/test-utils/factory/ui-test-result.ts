import type { TestDataFactory } from './types';

import type { UITestResult } from '../../types';
import { uiTestResultMetaFactory } from './ui-test-result-meta';
import { uiTagFactory } from './ui-tag';
import { uiAssertionFactory } from './ui-assertion';
import { uiTestLogFactory } from './ui-log';

/**
 * @internal
 * @hidden
 * Factory function for creating a {@link UITestResult}
 */
export const uiTestResultFactory: TestDataFactory<UITestResult> = (overrides = {}) => ({
	title: 'test result title',
	...overrides,
	logs: overrides.logs?.map(uiTestLogFactory),
	meta: uiTestResultMetaFactory(overrides.meta),
	aggregatedTags: overrides.aggregatedTags?.map(uiTagFactory) ?? undefined,
	assertions: overrides.assertions?.map(uiAssertionFactory) ?? [],
});
