import { UITag, UITestResultMeta } from '../../types';
import { formatMeta } from './meta';
import { formatTag } from './tag';

type Props = {
	title: string;
	meta: UITestResultMeta;
	tags?: UITag[];
	showTextOnMeta?: boolean;
};

export const formatSummary = ({ title, meta, tags, showTextOnMeta }: Props): string =>
	`<summary class="test-summary">
		<div class="test-summary-inner">
			<h2>${title}</h2>
			<div>
				${
					tags?.length
						? `<div class="assertion-tags">${tags.map((tag) => formatTag({ tag })).join('')}`
						: ''
				}
				${formatMeta({ meta, showText: showTextOnMeta })}
			</div>
		</div>
	</summary>`;
