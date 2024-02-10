import type { TestDataFactory } from './types';

import type { UIAssertion } from '../../types';
import { uiTagFactory } from './ui-tag';
import { uiTestErrorFactory } from './ui-error';
import { uiTestLogFactory } from './ui-log';

/**
 * @internal
 * @hidden
 * Factory function for creating a {@link UIAssertion}
 */
export const uiAssertionFactory: TestDataFactory<UIAssertion> = (overrides = {}) => ({
	title: 'assertion title',
	status: 'pass',
	...overrides,
	logs: overrides.logs?.map(uiTestLogFactory),
	ancestorTitles: (overrides.ancestorTitles as string[]) ?? [],
	tags: overrides.tags?.map(uiTagFactory) ?? [],
	errors: overrides.errors?.map(uiTestErrorFactory) ?? [],
});
