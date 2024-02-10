import { UIAssertion, UILog } from '../../types';
import { formatAssertion } from './assertion';
import { formatAssertionExpandableDetails } from './assertion-expandable-details';
import { html } from './html';
import { formatLogs } from './logs';

type Props = {
	assertions: UIAssertion[];
	statusMap: Record<string, string>;
	toHTML?: (content: string) => string;
	expandErrorDetails?: boolean;
	logs?: UILog[];
};

export const formatContent = ({
	assertions,
	statusMap,
	toHTML,
	expandErrorDetails,
	logs,
}: Props): string =>
	html`<div class="test-assertions">
		${(logs?.length ?? 0) > 0
			? html`<div class="assertion">${formatAssertionExpandableDetails({
				title: "Logs",
				content: formatLogs({ logs, toHTML }),
				open: expandErrorDetails,
			})}</div>`
			: ''}
		<ul>
			${assertions
			.map((assertion) => formatAssertion({ assertion, statusMap, toHTML, expandErrorDetails }))
			.join('')}
		</ul>
	</div>`;
