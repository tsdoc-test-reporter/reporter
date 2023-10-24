import type {
	AllTagsName,
	TestBlockDocComment,
	TestBlockTag,
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

const AT_SIGN = '@';

const removeAtSign = (name: string) => name.replace(AT_SIGN, '');

const formatText = (
	tag: TestBlockTag,
	tagText: string,
	options?: UIOptions,
): Pick<UITag, 'text'> => {
	const removeAtSigns = options?.removeAtSignOnTags;
	if (options?.tagTextAndIconFormatter) {
		return options.tagTextAndIconFormatter(tag, tagText);
	}
	let text = removeAtSigns && typeof removeAtSigns === 'boolean' ? removeAtSign(tagText) : tagText;
	text =
		removeAtSigns && Array.isArray(removeAtSigns)
			? removeAtSigns.includes(tag.kind)
				? removeAtSign(text)
				: text
			: text;
	return {
		text,
	};
};

export const getTagsFromTestBlockComments = (
	testBlockComments: TestBlockDocComment[] | undefined,
	options?: UIOptions,
): UITag[] => {
	return (
		testBlockComments?.flatMap((t) =>
			Object.values(t.testBlockTags ?? {}).flatMap((tag) => {
				if (!tag) return [];
				if (options?.hideAncestorTags && t.type === 'ancestor') return [];
				if (tag.tags?.length) {
					const showBlockTags = options?.showTagNameOnBlockTags ?? true;
					return tag.tags.map((blockTag) => ({
						type: t.type,
						name: tag.name as AllTagsName,
						...formatText(tag, showBlockTags ? `${tag.name}: ${blockTag}` : blockTag, options),
					}));
				}
				return {
					type: t.type,
					name: tag.name as AllTagsName,
					...formatText(tag, tag.name, options),
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

export const titleFormatter = (title: string, customFormatter?: (title: string) => string) => {
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
	const title = options?.htmlTitle ?? 'Test Results';
	const statusMap = {
		...statusToIconMap,
		...(options?.statusToIconMap ? options.statusToIconMap : {}),
	};
	return `<!doctype html>
			<html lang="en">
				${formatHead({ title, style: options?.style ?? '' })}
				<body>
					<main>${formatHeader({ title })} ${formatResults({
						results,
						statusMap,
						showTextOnMeta: options?.showTextOnTestSummaryMeta,
					})}</main>
				</body>
			</html>`;
};

export const getRenderOutput = <Type>(
	results: Type,
	getRenderData: (results: Type) => UITestResult[],
	options: TsDocTestReporterConfig<string>,
): string => {
	const onBeforeRender = options.onBeforeRender
		? options.onBeforeRender
		: (results: UITestResult[]) => results;
	switch (options.outputFileType) {
		case 'json':
			return JSON.stringify({
				results: options.outputJsonAs === 'raw' ? results : onBeforeRender(getRenderData(results)),
			});
		case 'html':
		default:
			return render(onBeforeRender(getRenderData(results)), options.uiOptions);
	}
};
