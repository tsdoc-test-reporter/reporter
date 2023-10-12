import type { TestDataFactory } from './types';

import type { UITag } from '../../types';

/**
 * @internal
 * @hidden
 * Factory function for creating a {@link UITag}
 */
export const uiTagFactory: TestDataFactory<UITag> = (overrides = {}) => ({
  text: "tag",
  type: "test",
  icon: undefined,
  ...overrides,
});
