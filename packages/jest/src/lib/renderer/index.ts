import { AssertionResult } from '@jest/test-result';
import * as Handlebars from 'handlebars';

import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';

import { customColorMap, statusToIconMap } from './defaultValues';

import { TaggedAggregatedResult, TaggedAssertionResult, UIOptions } from '../types';
import { AnsiToHtmlConverter } from '../utils/ansi-to-html';
import type { TestBlockTag } from '@tsdoc-test-reporter/core';
import { aggregateTagsForResults, formatTestBlockTag } from './utils';

export const render = (result: TaggedAggregatedResult, options?: UIOptions) => {
	const templateName = 'aggregated-result-template.hbs';

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

	Handlebars.registerHelper('aggregateTagsToTitle', function (result: TaggedAssertionResult[]) {
		return aggregateTagsForResults(result, options);
	});

	Handlebars.registerHelper('statusToIcon', function (status: AssertionResult['status']) {
		return options?.statusToIconMap ? options?.statusToIconMap[status] : statusToIconMap[status];
	});

	Handlebars.registerHelper('formatTags', function (testBlockTag: TestBlockTag) {
		return formatTestBlockTag(options)(testBlockTag);
	});

	Handlebars.registerHelper('formatTitle', function (title: string) {
		return title.replace(currentDirectory, '');
	});

	const template = Handlebars.compile(templateFile);
	return template({
		result,
		...options,
		title: options?.title ?? 'Test results',
	});
};
