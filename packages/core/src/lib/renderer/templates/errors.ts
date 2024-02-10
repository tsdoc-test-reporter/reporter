import { UITestError } from '../../types';
import { html } from './html';

type Props = {
	errors?: UITestError[];
	toHTML?: (string: string) => string;
};

export const formatErrors = ({ errors, toHTML }: Props) =>
	errors
		?.map(
			(error) =>
				html`<div class="assertion-code-content">
					${toHTML ? toHTML(error?.diff ?? error?.message ?? error?.name ?? '') : error?.name}
				</div>`,
		)
		.join('') ?? '';
