/// <reference types='vitest' />
import { defineConfig } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
	cacheDir: '../../node_modules/.vite/vitest',
	plugins: [nxViteTsPaths()],
	test: {
		cache: {
			dir: '../../node_modules/.vitest',
		},
		environment: 'node',
		include: ['src/lib/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
	},
});
