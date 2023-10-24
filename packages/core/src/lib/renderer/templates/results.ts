import { UITestResult } from '../../types';
import { formatSummary } from './summary';
import { formatContent } from './content';

type Props = {
	results: UITestResult[];
	statusMap: Record<string, string>;
	showTextOnMeta?: boolean;
	toHTML?: (content: string) => string;
};

export const formatResults = ({ results, statusMap, showTextOnMeta, toHTML }: Props): string =>
	`${results
		.map(
			(result) =>
				` <details class="test-details">
				${formatSummary({
					title: result.title,
					meta: result.meta,
					tags: result.aggregatedTags,
					showTextOnMeta,
				})}
				${formatContent({ assertions: result.assertions, statusMap, toHTML })}
			</details>`,
		)
		.join('')}`;
