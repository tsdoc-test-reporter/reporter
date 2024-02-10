import { formatTag } from './tag';
import { html } from './html';
import { UIAssertion } from '../../types';
import { formatAssertionExpandableDetails } from './assertion-expandable-details';
import { formatErrors } from './errors';
import { formatLogs } from './logs';
import { spacing } from './spacing';

type Props = {
	assertion: UIAssertion;
	statusMap: Record<string, string>;
	toHTML?: (content: string) => string;
	expandErrorDetails?: boolean;
};

export const formatAssertion = ({
	assertion,
	statusMap,
	toHTML,
	expandErrorDetails,
}: Props): string =>
	html`<li class="assertion status-${assertion.status}">
		<div class="assertion-details">
			<div class="assertion-primary">
				<span class="assertion-title">
					${assertion.ancestorTitles?.length ? `${assertion.ancestorTitles.join('»')} » ` : ''}
					${assertion.title}
				</span>
				<div class="assertion-tags">
					${assertion.tags.map((tag) => formatTag({ tag })).join('')}
				</div>
			</div>
			<div class="assertion-secondary">
				<span aria-hidden="true" class="meta ${assertion.status}-tests"
					>${statusMap[assertion.status]}</span
				>
				<span class="sr-only">${assertion.status}</span>
			</div>
		</div>
		${(assertion.errors?.length ?? 0) > 0
			? formatAssertionExpandableDetails({
					title: 'Errors',
					content: formatErrors({ errors: assertion.errors, toHTML }),
					open: expandErrorDetails,
			  })
			: ''}
		${(assertion.logs?.length ?? 0) > 0
			? html`${spacing()}${spacing()}<hr />${spacing()}${formatAssertionExpandableDetails({
					title: 'Logs',
					content: formatLogs({ logs: assertion.logs, toHTML }),
					open: expandErrorDetails,
			  })}`
			: ''}
	</li>`;
