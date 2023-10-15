import type { TestDataFactory } from './types';

import type { UIAssertion } from '../../types';
import { uiTagFactory } from './ui-tag';

/**
 * @internal
 * @hidden
 * Factory function for creating a {@link UIAssertion}
 */
export const uiAssertionFactory: TestDataFactory<UIAssertion> = (overrides = {}) => ({
	title: 'assertion title',
	status: 'pass',
	...overrides,
	ancestorTitles: (overrides.ancestorTitles as string[]) ?? [],
	tags: overrides.tags?.map(uiTagFactory) ?? [],
});
