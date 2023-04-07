import { Config } from '@jest/reporters';
import {
	projectConfigFactory,
	testContextFactory,
} from '../../test-utils/factory';

export const reporterProjectConfig: Config.ProjectConfig =
	projectConfigFactory();
export const reporterTestContext = testContextFactory({
	config: reporterProjectConfig,
});
