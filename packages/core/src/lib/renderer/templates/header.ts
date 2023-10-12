type Props = {
	title: string;
};

export const formatHeader = ({ title }: Props) =>
	`<header>
		<h1>${title}</h1>
	</header>`;
