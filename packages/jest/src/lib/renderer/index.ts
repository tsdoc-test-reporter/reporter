import { AssertionResult } from '@jest/test-result';
import * as Handlebars from 'handlebars';

import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';

import { customColorMap, statusToIconMap } from './defaultValues';

import { TaggedAggregatedResult, TestGroup, UIOptions } from '../types';
import { AnsiToHtmlConverter } from '../utils/ansi-to-html';
import type { TestBlockTag } from '@tsdoc-test-reporter/core';

function formatTag(title: string, prefix?: string, options?: UIOptions) {
	const tagPrefix = prefix && options?.showTagNameOnBlockTags ? `${prefix}:` : '';
	const formattedTagPrefix = options?.removeAtSignOnTags ? tagPrefix.replace('@', '') : tagPrefix;
	const formattedTitle =
		options?.removeAtSignOnTags && title.includes('@') ? title.replace('@', '') : title;
	if (!options?.tagTitleToIconMap) {
		return `<span class="tag">${formattedTagPrefix} ${formattedTitle}</span>`;
	}
	const tagIcon = options?.tagTitleToIconMap[title];
	if (tagIcon) {
		return `<span class="tag" aria-hidden="true">${formattedTagPrefix}${tagIcon}</span><span class="sr-only">${formattedTagPrefix}${formattedTitle}</span>`;
	}
	return `<span class="tag">${formattedTagPrefix} ${formattedTitle}</span>`;
}

export const render = (
	result: Map<string, TestGroup<string>> | TaggedAggregatedResult,
	options?: UIOptions,
) => {
	const templateName =
		result instanceof Map ? 'grouped-result-template.hbs' : 'aggregated-result-template.hbs';

	const handlesbarsTemplate = resolve(dirname(__filename), 'templates', templateName);

	const currentDirectory = process.cwd();

	const templateFile = readFileSync(handlesbarsTemplate, 'utf-8');

	const ansiConverter = new AnsiToHtmlConverter({
		newline: true,
		colors: options?.ansiCustomColorMap ?? customColorMap,
	});

	Handlebars.registerHelper('ansiToHTML', function (message: string) {
		return ansiConverter.toHtml(message);
	});

	Handlebars.registerHelper('statusToIcon', function (status: AssertionResult['status']) {
		return options?.statusToIconMap ? options?.statusToIconMap[status] : statusToIconMap[status];
	});

	Handlebars.registerHelper('formatTag', function (tag: string) {
		return formatTag(tag, undefined, options);
	});

	Handlebars.registerHelper('formatTags', function (tag: TestBlockTag) {
		return tag.tags?.map((t) => formatTag(t, tag.name, options)).join('');
	});

	Handlebars.registerHelper('formatTitle', function (title: string) {
		return title.replace(currentDirectory, '');
	});

	const template = Handlebars.compile(templateFile);
	const renderableResult = result instanceof Map ? Object.fromEntries(result) : result;
	return template({
		result: renderableResult,
		...options,
		title: options?.title ?? 'Test results',
	});
};
