import { UITestResult } from '../../types';
import { formatSummary } from './summary';
import { formatContent } from './content';

type Props = {
	results: UITestResult[];
	statusMap: Record<string, string>;
};

export const formatResults = ({ results, statusMap }: Props): string =>
	`${results
		.map(
			(result) =>
				` <details class="test-details">
				${formatSummary({ title: result.title, meta: result.meta })}
				${formatContent({ assertions: result.assertions, statusMap })}
			</details>`,
		)
		.join('')}`;
