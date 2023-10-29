import { UITestResult } from '../../types';
import { formatSummary } from './summary';
import { formatContent } from './content';
import { html } from './html';

type Props = {
	results: UITestResult[];
	statusMap: Record<string, string>;
	showTextOnMeta?: boolean;
	toHTML?: (content: string) => string;
	expandErrorDetails?: boolean;
	rootDirReplacer?: (fileName: string) => string;
};

export const formatResults = ({
	results,
	statusMap,
	showTextOnMeta,
	toHTML,
	expandErrorDetails,
	rootDirReplacer,
}: Props): string =>
	`${results
		.map(
			(result) =>
				html` <details class="test-details">
					${formatSummary({
						title: result.title,
						meta: result.meta,
						tags: result.aggregatedTags,
						showTextOnMeta,
						rootDirReplacer,
					})}
					${formatContent({ assertions: result.assertions, statusMap, toHTML, expandErrorDetails })}
				</details>`,
		)
		.join('')}`;
