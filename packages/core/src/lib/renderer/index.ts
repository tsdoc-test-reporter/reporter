import type {
	AllTagsName,
	TestBlockDocComment,
	TsDocTestReporterConfig,
	UIAssertion,
	UIOptions,
	UITag,
	UITestResult,
	UITestResultMeta,
} from '../types';
import { statusToIconMap } from './defaultValues';
import { formatHead, formatHeader } from './templates';
import { formatResults } from './templates/results';
export * from './templates';
export * from './defaultValues';

export const getTagsFromTestBlockComments = (
	testBlockComments: TestBlockDocComment[] | undefined,
	options?: UIOptions,
): UITag[] => {
	return (
		testBlockComments?.flatMap((t) =>
			Object.values(t.testBlockTags ?? {}).flatMap((tag) => {
				if (!tag) return [];
				if (tag.tags?.length) {
					return tag.tags.map((blockTag) => ({
						type: t.type,
						name: tag.name as AllTagsName,
						text: options?.showTagNameOnBlockTags ? `${tag.name}: ${blockTag}` : blockTag,
						icon: options?.tagTitleToIconMap ? options.tagTitleToIconMap[blockTag] : undefined,
					}));
				}
				return {
					type: t.type,
					name: tag.name as AllTagsName,
					text: options?.removeAtSignOnTags ? tag.name.replace('@', '') : tag.name,
					icon: options?.tagTitleToIconMap ? options.tagTitleToIconMap[tag.name] : undefined,
				};
			}),
		) ?? []
	);
};

export const aggregateMeta = (assertions: UIAssertion[]) => {
	const meta: UITestResultMeta = {
		failed: 0,
		passed: 0,
		skipped: 0,
		todo: 0,
	};
	if (!assertions.length) return meta;
	assertions.forEach((assertion) => {
		if (assertion.status === 'fail') {
			meta.failed++;
		}
		if (assertion.status === 'pass') {
			meta.passed++;
		}
		if (assertion.status === 'skip') {
			meta.skipped++;
		}
		if (assertion.status === 'todo') {
			meta.todo++;
		}
	});
	return meta;
};

export const formatTitle = (title: string, customFormatter?: (title: string) => string) => {
	return customFormatter ? customFormatter(title) : title.replace(process.cwd(), '');
};

/**
 * Extracts all tags from assertions and remove duplicates
 */
export const aggregateTags = (
	assertions: UIAssertion[],
	option: UIOptions['aggregateTagsToFileHeading'],
): UITag[] => {
	return [
		...new Map(
			assertions
				.flatMap((a) => a.tags)
				.filter((t) => {
					if (option === 'onlyAncestors') {
						return t.type === 'ancestor';
					}
					if (option === 'withoutAncestors') {
						return t.type === 'test';
					}
					if (Array.isArray(option)) {
						return option.includes(t.name);
					}
					return true;
				})
				.map((t) => [t.text, t]),
		).values(),
	];
};

export const render = (results: UITestResult[], options?: UIOptions) => {
	const title = options?.title ?? 'Test Results';
	const statusMap = {
		...statusToIconMap,
		...(options?.statusToIconMap ? options.statusToIconMap : {}),
	};
	return `<!doctype html>
			<html lang="en">
				${formatHead({ title, style: options?.style ?? '' })}
				<body>
					<main>${formatHeader({ title })} ${formatResults({ results, statusMap })}</main>
				</body>
			</html>`;
};

export const getRenderOutput = <Type>(
	results: Type,
	getRenderData: (results: Type) => UITestResult[],
	options: TsDocTestReporterConfig<string>,
): string => {
	switch (options.outputFileType) {
		case 'json':
			return JSON.stringify({
				results: options.outputJsonAs === 'raw' ? results : getRenderData(results),
			});
		case 'html':
		default:
			return render(getRenderData(results), options.uiOptions);
	}
};