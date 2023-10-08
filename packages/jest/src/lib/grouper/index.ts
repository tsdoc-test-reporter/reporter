import type { TestBlockDocComment } from '@tsdoc-test-reporter/core';
import type { TestGroup, TestGrouperConfig } from '../types';
import { failed, passed, pending, skipped, todo } from '../utils/assertion.util';

export const groupTests = <CustomTag extends string>({
	testResult,
	schema,
}: TestGrouperConfig<CustomTag>): Map<string, TestGroup<CustomTag>> => {
	const grouped = new Map<string, TestGroup<CustomTag>>();
	for (const result of testResult.testResults) {
		for (const assertion of result.testResults) {
			const topLevelAncestortitle = assertion.ancestorTitles[0];
			const topLevelAncestorBlockTagComment = assertion.ancestorTestBlockComments?.find(
				(testBlockComment: TestBlockDocComment<CustomTag>) =>
					testBlockComment.title === topLevelAncestortitle,
			);
			const groupTag = topLevelAncestorBlockTagComment?.testBlockTags
				? topLevelAncestorBlockTagComment.testBlockTags[schema.tagName]
				: undefined;
			const groupKey = groupTag && groupTag.tags?.length ? groupTag.tags[0] : result.testFilePath;
			const existingTestGroup = grouped.get(groupKey);
			grouped.set(
				groupKey,
				existingTestGroup
					? {
							...existingTestGroup,
							numFailingTests: existingTestGroup.numFailingTests + +failed(assertion),
							numPassingTests: existingTestGroup.numPassingTests + +passed(assertion),
							numPendingTests: existingTestGroup.numPendingTests + +pending(assertion),
							numSkippedTests: existingTestGroup.numSkippedTests + +skipped(assertion),
							numTodoTests: existingTestGroup.numTodoTests + +todo(assertion),
							testResults: failed(assertion)
								? [assertion, ...(existingTestGroup.testResults ?? [])]
								: existingTestGroup.testResults?.concat([assertion]),
					  }
					: {
							groupTitle: groupKey,
							groupTagName: groupTag ? schema.tagName : 'fileName',
							numFailingTests: +failed(assertion),
							numPassingTests: +passed(assertion),
							numPendingTests: +pending(assertion),
							numTodoTests: +todo(assertion),
							numSkippedTests: +skipped(assertion),
							testResults: [assertion],
					  },
			);
		}
	}
	return new Map([...grouped].sort());
};
