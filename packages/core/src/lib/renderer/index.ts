import type {
	AllTagsName,
	GetRenderOutputConfig,
	TestBlockDocComment,
	TestBlockTag,
	UIAssertion,
	UIOptions,
	UITag,
	UITestResult,
	UITestResultMeta,
} from '../types';
import { AnsiToHtmlConverter } from '../utils/ansi-to-html';
import { escapeHtml } from '../utils/ansi-to-html/escapeHTML';
import { removeAtSign } from '../utils/string.utils';
import { customColorMap, statusToIconMap } from './defaultValues';
import { formatHead, formatHeader } from './templates';
import { html } from './templates/html';
import { formatResults } from './templates/results';
export * from './templates';
export * from './defaultValues';

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
		if (assertion.logs && assertion.logs.length > 0) {
			meta.hasLogs = true;
		}
	});
	return meta;
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

export const render = (
	results: UITestResult[],
	options?: UIOptions,
	rootDirReplacer?: (string: string) => string,
) => {
	const title = options?.htmlTitle ?? 'Test Results';
	const statusMap = {
		...statusToIconMap,
		...(options?.statusToIconMap ? options.statusToIconMap : {}),
	};
	const ansiToHtmlConverter = new AnsiToHtmlConverter({
		newline: true,
		colors: {
			...customColorMap,
			...options?.ansiCustomColorMap,
		},
	});
	const toHTML = (content: string) => ansiToHtmlConverter.toHtml(escapeHtml(content));
	return html`<!doctype html>
		<html lang="en">
			${formatHead({ title, style: options?.style ?? '' })}
			<body>
				<main>
					${formatHeader({ title, buildInfo: options?.buildInfo })}
					${formatResults({
						results,
						statusMap,
						showTextOnMeta: options?.showTextOnTestSummaryMeta,
						toHTML,
						expandErrorDetails: options?.expandErrorDetails,
						rootDirReplacer,
						includeLogs: options?.includeLogs ?? true,
					})}
				</main>
			</body>
		</html>`;
};

export const getRenderOutput = <Type>({
	options,
	results,
	getRenderData,
	rootDirReplacer,
}: GetRenderOutputConfig<Type>): string => {
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
			return render(onBeforeRender(getRenderData(results)), options.uiOptions, rootDirReplacer);
	}
};
