import type { TestDataFactory } from './types';

import type { UITestError } from '../../types';

/**
 * @internal
 * @hidden
 * Factory function for creating a {@link UIe}
 */
export const uiTestErrorFactory: TestDataFactory<UITestError> = (overrides = {}) => ({
	message: 'message',
	name: 'name',
	...overrides,
});
