import type { UITag } from '../../types';
import { html } from './html';

type Props = {
	tag: UITag;
};

export const formatTag = ({ tag }: Props): string =>
	html`${tag.icon
		? html`<span class="sr-only">${tag.text}</span
				><span class="tag" aria-hidden="true">${tag.icon}</span>`
		: html`<span class="tag">${tag.text}</span>`}`;
