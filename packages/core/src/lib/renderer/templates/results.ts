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
	includeLogs?: boolean;
	rootDirReplacer?: (fileName: string) => string;
};

export const formatResults = ({
	results,
	statusMap,
	showTextOnMeta,
	toHTML,
	expandErrorDetails,
	rootDirReplacer,
	includeLogs
}: Props): string =>
	`${results
		.map(
			(result) =>
				html` <details class="test-details">
					${formatSummary({
						title: result.title,
						meta: {
							...result.meta,
							hasLogs: includeLogs ? result.meta.hasLogs : false,
						},
						tags: result.aggregatedTags,
						filePath: result.filePath ?? result.title,
						showTextOnMeta,
						rootDirReplacer,
					})}
					${formatContent({
						assertions: result.assertions,
						logs: includeLogs ? result.logs : undefined,
						statusMap,
						toHTML,
						expandErrorDetails,
					})}
				</details>`,
		)
		.join('')}`;
