import { UILog } from '../../types';
import { html } from './html';

type Props = {
	logs?: UILog[];
	toHTML?: (string: string) => string;
};

export const formatLogs = ({ logs, toHTML }: Props) =>
	logs
		?.map(
			(log) =>
				html`<p class="console-type console-type-${log.type}">console.${log.type}</p>
					<div class="assertion-code-content">${toHTML ? toHTML(log.content) : log.content}</div>`,
		)
		.join('') ?? '';
