import { BuildInfo } from '../../types';
import { html } from './html';
import { openInNewTabIcon } from './openInNewTabIcon';

type Props = {
	title: string;
	buildInfo?: BuildInfo;
};

const formatBuildInfo = (buildInfo?: BuildInfo) =>
	buildInfo
		? html`<a class="info build-info" href="${buildInfo.url}" rel="noreferrer" target="_blank"
				>${buildInfo.text}${openInNewTabIcon}</a
		  >`
		: '';

export const formatHeader = ({ title, buildInfo }: Props) =>
	html`<header class="${buildInfo?.position === 'bottom' ? 'column' : ''}">
		<h1>${title}</h1>
		${formatBuildInfo(buildInfo)}
	</header>`;
