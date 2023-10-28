import { BuildInfo } from '../../types';

type Props = {
	title: string;
	buildInfo?: BuildInfo;
};

const formatBuildInfo = (buildInfo?: BuildInfo) =>
	`${
		buildInfo
			? `
		<a class="build-info" href="${buildInfo.url}" rel="noreferrer" target="_blank">
			${buildInfo.text}
		</a>`
			: ''
	}`;

export const formatHeader = ({ title, buildInfo }: Props) =>
	`<header${buildInfo?.position === 'bottom' ? ' class="column"' : ''}>
		<h1>${title}</h1>${formatBuildInfo(buildInfo)}
	</header>`;
