import { AssertionResult } from '@jest/test-result';
import * as Handlebars from 'handlebars';

import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';

import { customColorMap, statusToIconMap } from './defaultValues';

import { TaggedAggregatedResult, TestGroup, UIOptions } from '../types';
import { AnsiToHtmlConverter } from '../utils/ansi-to-html';

export const render = (
	result: Map<string, TestGroup<string>> | TaggedAggregatedResult,
	options?: UIOptions
) => {
	const templateName =
		result instanceof Map
			? 'grouped-result-template.hbs'
			: 'aggregated-result-template.hbs';

	const handlesbarsTemplate = resolve(
		dirname(__filename),
		'templates',
		templateName
	);

	const templateFile = readFileSync(handlesbarsTemplate, 'utf-8');

	const ansiConverter = new AnsiToHtmlConverter({
		newline: true,
		colors: options?.ansiCustomColorMap ?? customColorMap,
	});

	Handlebars.registerHelper('ansiToHTML', function (message: string) {
		return ansiConverter.toHtml(message);
	});

	Handlebars.registerHelper(
		'statusToIcon',
		function (status: AssertionResult['status']) {
			return options?.statusToIconMap
				? options?.statusToIconMap[status]
				: statusToIconMap[status];
		}
	);

	Handlebars.registerHelper('formatTag', function (title: string) {
		if (!options?.tagTitleToIconMap) return `<span class="tag">${title}</span>`;
		const tagIcon = options?.tagTitleToIconMap[title];
		if (tagIcon) {
			return `<span class="tag" aria-hidden="true">${tagIcon}</span><span class="sr-only">${title}</span>`;
		}
		return title;
	});

	const template = Handlebars.compile(templateFile);
	const renderableResult =
		result instanceof Map ? Object.fromEntries(result) : result;
	return template({
		result: renderableResult,
		...options,
		title: options?.title ?? 'Test results',
	});
};
