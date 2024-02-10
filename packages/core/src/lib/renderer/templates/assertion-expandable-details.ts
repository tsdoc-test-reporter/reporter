import { html } from './html';

type Props = {
	title: string;
	content: string;
	open?: boolean;
};

export const formatAssertionExpandableDetails = ({ content, title, open }: Props) =>
	html`<details ${open ? 'open' : ''} class="assertion-expandable-details">
		<summary><p>${title}</p></summary>
		${content}
	</details>`;
