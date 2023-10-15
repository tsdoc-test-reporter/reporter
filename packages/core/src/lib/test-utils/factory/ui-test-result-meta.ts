import type { TestDataFactory } from './types';

import type { UITestResultMeta } from '../../types';

/**
 * @internal
 * @hidden
 * Factory function for creating a {@link UITestResultMeta}
 */
export const uiTestResultMetaFactory: TestDataFactory<UITestResultMeta> = (overrides = {}) => ({
	passed: 0,
	skipped: 0,
	todo: 0,
	failed: 0,
	...overrides,
});
