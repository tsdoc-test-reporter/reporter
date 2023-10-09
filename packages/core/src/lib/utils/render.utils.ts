import { TestBlockDocComment, TestBlockTag, UIOptions, WithTestDocBlockComments } from '../types';

export const renderTag = (options?: UIOptions) => (title: string, prefix?: string) => {
	const tagPrefix = prefix && options?.showTagNameOnBlockTags ? `${prefix}: ` : '';
	const formattedTagPrefix = options?.removeAtSignOnTags ? tagPrefix.replace('@', '') : tagPrefix;
	const formattedTitle =
		options?.removeAtSignOnTags && title.includes('@') ? title.replace('@', '') : title;
	if (!options?.tagTitleToIconMap) {
		return `<span class="tag">${formattedTagPrefix}${formattedTitle}</span>`;
	}
	const tagIcon = options?.tagTitleToIconMap[title];
	if (tagIcon) {
		return `<span class="tag" aria-hidden="true">${formattedTagPrefix}${tagIcon}</span><span class="sr-only">${formattedTagPrefix}${formattedTitle}</span>`;
	}
	return `<span class="tag">${formattedTagPrefix} ${formattedTitle}</span>`;
};

export const renderTags = (options?: UIOptions) => (testBlockTag?: TestBlockTag) => {
	if (!testBlockTag) return undefined;
	const formatter = renderTag(options);
	return testBlockTag.tags?.length
		? testBlockTag.tags?.map((t) => formatter(t, testBlockTag.name)).join('')
		: formatter(testBlockTag.name);
};

const getTagsFromComment = (comment: TestBlockDocComment) =>
	Object.values(comment.testBlockTags ?? {});

export const aggregateTags =
	(options?: UIOptions) =>
		<Type extends object = object>(result: WithTestDocBlockComments<Type>) => {
			if (!options?.aggregateTagsToFileHeading) {
				return '';
			}
			if (!result.testBlockComments && !result.ancestorTestBlockComments) {
				return '';
			}
			const testBlockComments = [
				...(result.ancestorTestBlockComments &&
					options.aggregateTagsToFileHeading !== 'withoutAncestors'
					? result.ancestorTestBlockComments
					: []),
				...(result.testBlockComments && options.aggregateTagsToFileHeading !== 'onlyAncestors'
					? result.testBlockComments
					: []),
			];
			if (!testBlockComments.length) {
				return '';
			}
			const allTags = testBlockComments.flatMap(getTagsFromComment);
			const filterByTagName = Array.isArray(options.aggregateTagsToFileHeading);
			const filteredTags = filterByTagName
				? allTags.filter((testBlockTag) =>
					filterByTagName && testBlockTag
						? (options.aggregateTagsToFileHeading as string[]).includes(testBlockTag?.name)
						: true,
				)
				: allTags;
			return filteredTags.map(renderTags(options)).join('');
		};
