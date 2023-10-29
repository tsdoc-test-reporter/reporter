import { formatTag } from './tag';
import { html } from './html';
import { UIAssertion } from '../../types';

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
				<div class="assertion-tags">${assertion.tags.map((tag) => formatTag({ tag })).join('')}</div>
			</div>
			<div class="assertion-secondary">
				<span aria-hidden="true" class="meta ${assertion.status}-tests">${statusMap[assertion.status]}</span>
				<span class="sr-only">${assertion.status}</span>
			</div>
		</div>
		${(assertion.errors?.length ?? 0) > 0
			? html`<details  ${expandErrorDetails ? 'open' : ''} class="assertion-error-details">
					<summary><p>Error details</p></summary>
					${assertion.errors
						?.map(
							(error) =>
								html`<div class="assertion-error-content">
									${toHTML
										? toHTML(error?.diff ?? error?.message ?? error?.name ?? '')
										: error?.name}
								</div>`,
						)
						.join('')}
			  </details>`
			: ''}
	</li>`;
