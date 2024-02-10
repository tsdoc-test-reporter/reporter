import { UITestResult } from '../../types';

export const exampleTestResult: UITestResult[] = [
	{
		title: 'common/handlesDifferentTestBlocks.vitest.spec.ts',
		meta: { failed: 0, passed: 2, skipped: 2, todo: 0 },
		aggregatedTags: [{ type: 'ancestor', name: '@remarks', text: 'unit' }],
		assertions: [
			{
				title: 'test.each',
				ancestorTitles: [],
				tags: [{ type: 'test', name: '@remarks', text: 'unit' }],
				status: 'pass',
				errors: undefined,
			},
			{
				title: 'test.each',
				ancestorTitles: [],
				tags: [{ type: 'test', name: '@remarks', text: 'unit' }],
				status: 'pass',
				errors: undefined,
			},
			{
				title: 'test.skipIf.each: sum 1 + 1 = 2',
				ancestorTitles: ['describe.concurrent'],
				tags: [{ type: 'ancestor', name: '@remarks', text: 'unit' }],
				status: 'skip',
				errors: undefined,
			},
			{
				title: 'test.skipIf.each: sum 3 + 2 = 5',
				ancestorTitles: ['describe.concurrent'],
				tags: [{ type: 'ancestor', name: '@remarks', text: 'unit' }],
				status: 'skip',
				errors: undefined,
			},
		],
	},
	{
		title: 'Custom title formatting supported',
		meta: { failed: 0, passed: 1, skipped: 0, todo: 0, hasLogs: true },
		aggregatedTags: [
			{
				type: 'ancestor',
				name: '@remarks',
				text: 'aggregate tags for display in title summary',
			},
		],
		logs: [
			{
				type: 'log',
				content: 'Hello',
			},
			{
				type: 'error',
				content: 'Could not do the thing',
			},
			{
				type: 'warn',
				content: 'Could not do the thing',
			},
		],
		assertions: [
			{
				title: 'map object so keys are the same as values',
				ancestorTitles: ['common types'],
				tags: [
					{
						type: 'ancestor',
						name: '@remarks',
						text: 'aggregate tags for display in title summary',
					},
				],
				status: 'pass',
				errors: undefined,
				logs: [
					{
						type: 'log',
						content: 'Hello',
					},
					{
						type: 'error',
						content: 'Could not do the thing',
					},
					{
						type: 'warn',
						content: 'Could not do the thing',
					},
				],
			},
		],
	},
	{
		title: 'js/commonjs.vitest.spec.cjs',
		meta: { failed: 0, passed: 1, skipped: 0, todo: 0 },
		aggregatedTags: [],
		assertions: [
			{
				title: 'spec.cjs',
				ancestorTitles: [],
				tags: [{ type: 'test', name: '@remarks', text: 'unit' }],
				status: 'pass',
				errors: undefined,
			},
		],
	},
	{
		title: 'js/javascript.vitest.spec.js',
		meta: { failed: 0, passed: 1, skipped: 0, todo: 0 },
		aggregatedTags: [],
		assertions: [
			{
				title: 'spec.js',
				ancestorTitles: [],
				tags: [{ type: 'test', name: '@remarks', text: 'unit' }],
				status: 'pass',
				errors: undefined,
			},
		],
	},
	{
		title: 'js/module.vitest.spec.mjs',
		meta: { failed: 0, passed: 1, skipped: 0, todo: 0 },
		aggregatedTags: [],
		assertions: [
			{
				title: 'spec.mjs',
				ancestorTitles: [],
				tags: [{ type: 'test', name: '@remarks', text: 'unit' }],
				status: 'pass',
				errors: undefined,
			},
		],
	},
	{
		title: 'components/App/FilenameAsTitleByDefault.vitest.spec.tsx',
		meta: { failed: 2, passed: 0, skipped: 1, todo: 1 },
		aggregatedTags: [],
		assertions: [
			{
				title: 'render h1 title',
				ancestorTitles: ['App'],
				tags: [
					{ type: 'test', name: '@remarks', text: 'accessibility' },
					{ type: 'test', name: '@remarks', text: 'ui' },
				],
				status: 'fail',
				errors: [
					{
						name: 'TestingLibraryElementError',
						message:
							'Unable to find an accessible element with the role "heading"\n' +
							'\n' +
							'Here are the accessible roles:\n' +
							'\n' +
							'  heading:\n' +
							'\n' +
							'  Name "@ test":\n' +
							'  \x1B[36m<h1 />\x1B[39m\n' +
							'\n' +
							'  --------------------------------------------------\n' +
							'\n' +
							'Ignored nodes: comments, script, style\n' +
							'\x1B[36m<body>\x1B[39m\n' +
							'  \x1B[36m<div>\x1B[39m\n' +
							'    \x1B[36m<h1>\x1B[39m\n' +
							'      \x1B[36m<span\x1B[39m\n' +
							'        \x1B[33mstyle\x1B[39m=\x1B[32m"color: rgb(80, 165, 165);"\x1B[39m\n' +
							'      \x1B[36m>\x1B[39m\n' +
							'        \x1B[0m@\x1B[0m\n' +
							'      \x1B[36m</span>\x1B[39m\n' +
							'      \x1B[0mtest\x1B[0m\n' +
							'    \x1B[36m</h1>\x1B[39m\n' +
							'  \x1B[36m</div>\x1B[39m\n' +
							'\x1B[36m</body>\x1B[39m',
						expected: 'undefined',
						actual: 'undefined',
						diff: undefined,
					},
				],
			},
			{
				title: 'this is a skipped test',
				ancestorTitles: ['App'],
				tags: [
					{
						type: 'test',
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						name: '@parsesCustomTagsLikeThis' as any,
						text: '@parsesCustomTagsLikeThis',
					},
				],
				status: 'skip',
				errors: undefined,
			},
			{
				title: 'this is a todo test',
				ancestorTitles: ['App'],
				tags: [],
				status: 'todo',
				errors: undefined,
			},
			{
				title: 'this is a failing test',
				ancestorTitles: ['App'],
				tags: [
					{
						type: 'test',
						name: '@remarks',
						text: 'convert this to icon',
						icon: '🤷🏼',
					},
				],
				status: 'fail',
				errors: [
					{
						name: 'AssertionError',
						message: 'expected true to be falsy',
						expected: 'true',
						actual: 'false',
						diff:
							'\x1B[32m- Expected\x1B[39m\n' +
							'\x1B[31m+ Received\x1B[39m\n' +
							'\n' +
							'\x1B[32m- true\x1B[39m\n' +
							'\x1B[31m+ false\x1B[39m',
					},
				],
			},
		],
	},
];
