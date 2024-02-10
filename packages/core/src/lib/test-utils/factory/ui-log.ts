import type { TestDataFactory } from './types';

import type { UILog } from '../../types';

/**
 * @internal
 * @hidden
 * Factory function for creating a {@link UIe}
 */
export const uiTestLogFactory: TestDataFactory<UILog> = (overrides = {}) => ({
  content: "log info",
  type: "info",
	...overrides,
});
