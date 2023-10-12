import type { UITag } from '../../types';

type Props = {
	tag: UITag;
};

export const formatTag = ({ tag }: Props): string =>
	`${
		tag.icon
			? `<span class="sr-only">${tag.text}</span><span class="tag" aria-hidden="true">${tag.icon}</span>`
			: `<span class="tag">${tag.text}</span>`
	}`;
