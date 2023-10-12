import { UITestResultMeta } from '../../types';
import { formatMeta } from './meta';

type Props = {
	title: string;
	meta: UITestResultMeta;
};

export const formatSummary = ({ title, meta }: Props): string =>
	`<summary class="test-summary">
		<div class="test-summary-inner">
			<h2>${title}</h2>
			${formatMeta(meta)}
		</div>
	</summary>`;
