import { UITag, UITestResultMeta } from '../../types';
import { formatMeta } from './meta';
import { openInNewTabIcon } from './openInNewTabIcon';
import { formatTag } from './tag';
import { html } from './html';

type Props = {
	title: string;
	filePath: string;
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
	filePath,
}: Props): string =>
	html`<summary class="test-summary">
		<div class="test-summary-inner">
			<div class="test-summary-primary">
				<div class="test-summary-title">
					<h2>${title}</h2>
					${rootDirReplacer
						? html`<span class="open-file"
								><a href="${rootDirReplacer(filePath)}" rel="noreferrer" target="_blank"
									>Open file</a
								>
								${openInNewTabIcon}</span
						  >`
						: ''}
				</div>
				${tags?.length
					? html`<div class="assertion-tags">
							${tags.map((tag) => formatTag({ tag })).join('')}
					  </div>`
					: ''}
			</div>
			<div class="test-summary-secondary">${formatMeta({ meta, showText: showTextOnMeta })}</div>
		</div>
	</summary>`;
