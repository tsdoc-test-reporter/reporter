import { html } from './html';

type Props = {
	title: string;
	style?: string;
};

export const formatHead = ({ title, style }: Props) =>
	html`<head>
		<title>${title}</title>
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<style>
			:root {
				--light-red: hsl(357, 100%, 92%);
				--red: hsl(357, 79%, 65%);
				--dark-red: hsl(357, 79%, 26%);

				--light-green: hsl(114, 31%, 80%);
				--dark-green: hsl(138, 89%, 10%);

				--light-blue: hsl(208, 100%, 97%);
				--dark-blue:  hsl(207, 46%, 32%);
				--darker-blue: hsl(202, 32%, 15%);
				--darkest-blue: hsl(202, 13%, 12%);

				--dark-purple: hsl(300, 79%, 26%);
				--light-purple: hsl(299, 100%, 92%);

				--dark-yellow: hsl(53, 79%, 26%);
				--light-yellow: hsl(50, 100%, 92%);

				--darkest-black: hsl(0, 0%, 10%);
				--dark-black: hsl(0, 0%, 15%);
				--black: hsl(0, 0%, 25%);
				--light-black: hsl(0, 0%, 33%);
				--lighter-black: hsl(0, 0%, 40%);
				--light-gray: hsl(0, 0%, 98%);
				--pale-gray: hsl(0, 0%, 83%);
				--gray:	hsl(0, 0%, 93%);
				--white: hsl(0, 100%, 100%);

				--background-color: var(--white);
				--text-color: var(--light-black);

				--font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
					'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
				--code-font-family: monospace;
				--heading-margin: 0 0 1rem 0;
				--box-shadow:  1px 1px 3px 1px rgba(0, 0, 0, 0.05);

				--test-summary-background-color: var(--white);

				--assertion-border-color: var(--pale-gray);
				--assertion-text-color: var(--light-black);
				--assertion-background-color: var(--light-gray);

				--pass-color: var(--dark-green);
				--pass-background: var(--light-green);

				--fail-color: var(--dark-red);
				--fail-background: var(--light-red);

				--todo-color: var(--dark-purple);
				--todo-background: var(--light-purple);

				--skip-color: var(--dark-yellow);
				--skip-background: var(--light-yellow);

				--code-background-color: var(--darker-blue);
				--code-text-color: var(--white);

				--tag-background-color: var(--light-blue);
				--tag-text-color: var(--dark-blue);
				--tag-border-color: var(--dark-blue);

				--info-background-color: var(--gray);
				--info-text-color: var(--black);
			}

			@media (prefers-color-scheme: dark) {
				:root {
					--background-color: var(--darkest-black);
					--text-color: var(--gray);

					--info-text-color: var(--black);

					--test-summary-background-color: var(--darkest-blue);

					--assertion-background-color: var(--dark-black);
					--assertion-border-color: var(--black);
					--assertion-text-color: var(--gray);
				}
			}

			body,
			html {
				margin: 0;
				padding: 1rem;
				color: var(--text-color);
				background-color: var(--background-color);
				font-family: var(--font-family);
			}

			*,
			*::after,
			*::before {
				box-sizing: border-box;
			}

			h1 {
				margin: 0;
			}

			h2, h3, h4, h5, h6 {
				margin: var(--heading-margin);
			}

			a {
				color: var(--text-color);
			}

			ul {
				padding: 0;
				margin: 0;
				list-style: none;
			}

			* {
				box-sizing: border-box;
			}

			header {
				display: flex;
				align-items: flex-end;
				gap: 0.5rem;
				margin-bottom: 1rem;
			}

			hr {
				display: block;
				height: 1px;
				border: 0;
				border-top: 1px solid #ccc;
				margin: 0;
				padding: 0;
			}

			.info {
				display: inline-flex;
				align-items: center;
				border-radius: 4px;
				padding: 4px;
				color: var(--info-text-color);
				background-color: var(--info-background-color);
			}

			.build-info svg {
				margin-left: 4px;
				margin-bottom: 2px;
			}

			.open-file svg {
				margin: 0 0 4px 4px;
			}

			.column {
				flex-direction: column;
				align-items: flex-start;
			}

			details summary {
				cursor: pointer;
				list-style: none;
			}

			details summary::-webkit-details-marker,
			details summary::marker {
			 	display: none;
			}

			summary:before {
				position: absolute;
				content: "►";
				margin-top: 4px;
				font-size: 0.85rem;
				transition: all 250ms;
			}

			details[open] > summary:before {
				transform: rotate(90deg);
			}

			.test-details:first-of-type .test-summary {
				border-radius: 4px 4px 0 0;
			}

			.test-details:last-of-type .test-summary {
				border-radius: 0 0 4px 4px;
				border-bottom-width: 1px;
			}

			details[open].test-details .test-summary {
				border-bottom-width: 1px;
				border-bottom-left-radius: 4px;
			}

			.test-summary {
				position: relative;
				cursor: pointer;
				padding: 0.5rem;
				background-color: var(--test-summary-background-color);
				border: 1px solid var(--assertion-border-color);
				border-bottom-width: 0;
			}

			.test-summary-inner {
				display: inline-flex;
				align-items: center;
				width: 100%;
				padding-left: 1.25rem;
				justify-content: space-between;
				gap: 0.5rem;
				flex-wrap: wrap;
			}

			.test-summary-primary {
				display: flex;
				flex-direction: column;
				gap: 0.25rem;
			}

			.test-summary-title {
				display: flex;
				gap: 0.25rem;
				align-items: baseline;
				flex-wrap: wrap;
			}

			.test-summary-secondary {
				display: flex;
				flex-direction: row;
				gap: 0.25rem;
			}

			.test-summary h2  {
				display: inline;
				margin: 0;
				font-size: 1.1rem;
				word-break: break-word;
			}

			.aggregated-tags {
				margin-left: auto;
				margin-right: 1rem;
				display: inline-flex;
				justify-content: flex-end;
				gap: 0.5rem;
				margin-right: 0.5rem;
			}

			.test-summary-status {
				display: flex;
				border-radius: 4px;
				box-shadow: var(--box-shadow);
			}

			.meta {
				padding: 0.25rem 0.5rem;
				border-style: solid;
				border-width: 1px 1px 1px 0;
			}

			.test-summary .meta:first-of-type {
				border-radius: 4px 0 0 4px;
				border-left-width: 1px;
			}

			.test-summary .meta:last-of-type {
				border-radius: 0 4px 4px 0;
			}

			.test-summary .meta:only-of-type {
				border-radius: 4px;
			}

			.assertion-secondary .meta {
				border-left-width: 1px;
				border-radius: 4px;
			}

			.pass-tests {
				border-color: var(--pass-color);
				background-color:  var(--pass-background);
				color: var(--pass-color);
			}

			.fail-tests {
				border-color: var(--fail-color);
				background-color:  var(--fail-background);
				color: var(--fail-color);
			}

			.todo-tests {
				border-color: var(--todo-color);
				background-color:  var(--todo-background);
				color: var(--todo-color);
			}

			.skip-tests {
				border-color: var(--skip-color);
				background-color:  var(--skip-background);
				color: var(--skip-color);
			}

			.assertion {
				padding: 0.5rem;
				padding-left: 1.5rem;
				color: var(--assertion-text-color);
				border-left: 1px solid var(--assertion-border-color);
				border-right: 1px solid var(--assertion-border-color);
				margin-left: 0.25rem;
				background-color: var(--assertion-background-color)
			}

			.assertion-details {
				display: flex;
				justify-content: space-between;
				align-items: center;
				min-height: 1.75rem;
			}

			.assertion-primary {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				gap: 0.5rem;
				align-items: center;
			}

			.assertion:not(:last-child) {
				border-bottom: 1px solid var(--assertion-border-color);
			}

			.assertion-tags {
				display: inline-flex;
				gap: 0.5rem;
			}

			.tag {
				display: inline-flex;
				align-items: center;
				border-radius: 4px;
				padding: 4px;
				border: 1px solid var(--tag-border-color);
				background-color: var(--tag-background-color);
				color: var(--tag-text-color);
			}

			.assertion-expandable-details {
				width: 100%;
				position: relative;
				margin: 0.5rem 0;
			}

			details[open].assertion-expandable-details > summary {
				margin-bottom: 0.5rem;
			}

			.assertion-expandable-details summary:before {
				margin-top: -2px;
			}

			.assertion-expandable-details summary p {
				padding-left: 1.25rem;
				margin: 0;
			}

			.assertion-code-content {
				padding: 0.5rem;
				font-family: var(--code-font-family);
				background-color: var(--code-background-color);
				color: var(--code-text-color);
				border-radius: 0 4px 4px 4px;
				margin-bottom: 0.5rem;
			}

			.assertion-code-content p {
				margin: 0;
			}

			.console-type {
				display: inline;
				border: 1px solid var(--code-background-color);
				border-radius: 4px 4px 0 0;
				background-color: var(--tag-background-color);
				color: var(--tag-text-color);
				font-family: var(--code-font-family);
				margin: 0;
				padding: 0 4px 0 4px;
			}

			.console-type-error {
				background-color: var(--fail-background);
				color: var(--fail-color)
			}

			.console-type-warn {
				background-color: var(--skip-background);
				color: var(--skip-color)
			}

			.sr-only {
				clip: rect(1px, 1px, 1px, 1px) !important;
				-webkit-clip-path: inset(50%) !important;
					clip-path: inset(50%) !important;
				height: 1px !important;
				margin: -1px !important;
				overflow: hidden !important;
				padding: 0 !important;
				position: absolute !important;
				width: 1px !important;
				white-space: nowrap !important;
			}

			.spacing {
				padding-bottom: 0.5rem;
			}
			${style}
		</style>
	</head>`;
