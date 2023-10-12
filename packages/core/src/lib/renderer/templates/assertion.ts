import { formatTag } from './tag';
import { UIAssertion } from '../../types';

type Props = {
	assertion: UIAssertion;
	statusMap: Record<string, string>;
};

export const formatAssertion = ({ assertion, statusMap }: Props): string =>
	`<li class="assertion status-${assertion.status}">
		<span class="assertion-title">
			${assertion.ancestorTitles?.length ? `${assertion.ancestorTitles.join('»')} » ` : ''}
			${assertion.title}
		</span>
		<div class="assertion-tags">${assertion.tags.map((tag) => formatTag({ tag })).join('')}</div>
		<span aria-hidden="true">${statusMap[assertion.status]}</span>
		<span class="sr-only">${assertion.status}</span>
	</li>`;
