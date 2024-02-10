/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
	transform: {
		'^.+\\.(t|j)sx?$': '@swc/jest',
	},
	testMatch: ['<rootDir>/src/test-output/**/*.spec.ts'],
	moduleNameMapper: {
		'@tsdoc-test-reporter/core': '<rootDir>/../core/src/index.ts',
	},
	verbose: false,
	reporters: ['default', '<rootDir>/src/test-output/reporter.cjs'],
};
