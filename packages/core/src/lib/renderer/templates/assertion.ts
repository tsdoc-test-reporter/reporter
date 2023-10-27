import { formatTag } from './tag';
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
	`<li class="assertion status-${assertion.status}">
		<span class="assertion-title">
			${assertion.ancestorTitles?.length ? `${assertion.ancestorTitles.join('»')} » ` : ''}
			${assertion.title}
		</span>
		<div class="assertion-tags">${assertion.tags.map((tag) => formatTag({ tag })).join('')}</div>
		<span aria-hidden="true">${statusMap[assertion.status]}</span>
		<span class="sr-only">${assertion.status}</span>
${
	(assertion.errors?.length ?? 0) > 0
		? `<details ${expandErrorDetails ? 'open' : ''} class="assertion-error-details">
 <summary><p>Error details</p></summary>
${assertion.errors
	?.map(
		(error) => `<div class="assertion-error-content">
${toHTML ? toHTML(error?.diff ?? error?.message ?? error?.name ?? '') : error?.name}
</div>`,
	)
	.join('')}
</details>`
		: ''
}
	</li>`;
