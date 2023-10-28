import { UITag, UITestResultMeta } from '../../types';
import { formatMeta } from './meta';
import { openInNewTabIcon } from './openInNewTabIcon';
import { formatTag } from './tag';

type Props = {
	title: string;
	meta: UITestResultMeta;
	tags?: UITag[];
	showTextOnMeta?: boolean;
	rootDirReplacer?: (fileName: string) => string;
};

export const formatSummary = ({
	title,
	meta,
	tags,
	showTextOnMeta,
	rootDirReplacer,
}: Props): string =>
	`<summary class="test-summary">
		<div class="test-summary-inner">
${
	rootDirReplacer
		? `<h2><a href="${rootDirReplacer(
				title,
		  )}" rel="noreferrer" target="_blank">${title}</a>${openInNewTabIcon}</h2>`
		: `<h2>${title}</h2>`
}	<div>
				${
					tags?.length
						? `<div class="assertion-tags">${tags.map((tag) => formatTag({ tag })).join('')}`
						: ''
				}
				${formatMeta({ meta, showText: showTextOnMeta })}
			</div>
		</div>
	</summary>`;
