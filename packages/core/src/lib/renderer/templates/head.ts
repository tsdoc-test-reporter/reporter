type Props = {
	title: string;
	style?: string;
};

export const formatHead = ({ title, style }: Props): string =>
	`<head>
		<title>${title}</title>
		<style>
			:root {
				--light-red: hsl(357, 100%, 92%);
				--red: hsl(357, 79%, 65%);
				--dark-red: hsl(357, 79%, 26%);

				--light-green: hsl(114, 31%, 80%);
				--dark-green: hsl(138, 89%, 10%);

				--light-blue: hsl(222, 100%, 98%);
				--dark-blue: hsl(202, 32%, 15%);

				--dark-purple: hsl(300, 79%, 26%);
				--light-purple: hsl(299, 100%, 92%);

				--dark-yellow: hsl(53, 79%, 26%);
				--light-yellow: hsl(50, 100%, 92%);

				--black: hsl(0, 0%, 25%);
				--light-black: hsl(0, 0%, 33%);
				--lighter-black: hsl(0, 0%, 40%);
				--pale-gray: hsl(0, 0%, 83%);
				--white: hsl(0, 100%, 100%);

				--test-summary-border-color: var(--pale-gray);
				--list-even-odd-background-color: var(--light-blue);
				--list-border-color: var(--light-blue);
				--list-text-color: var(--light-black);
				--list-ancestor-text-color: var(--lighter-black);

				--passing-tests-summary-color: var(--dark-green);
				--passing-tests-summary-background-color: var(--light-green);
				--failing-tests-summary-color: var(--dark-red);
				--failing-tests-summary-background-color: var(--light-red);
				--todo-tests-summary-color: var(--dark-purple);
				--todo-tests-summary-background-color: var(--light-purple);
				--skipped-tests-summary-color: var(--dark-yellow);
				--skipped-tests-summary-background-color: var(--light-yellow);

				--code-background-color: var(--dark-blue);

				--tag-background-color: var(--white);
				--tag-text-color: var(--black);
				--tag-border-color: var(--pale-gray);

				--background-color: var(--white);
				--text-color: var(--black);

				--font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
					'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
				--font-family-code: monospace;
				--heading-margin: 0 0 1rem 0;
				--box-shadow:  1px 1px 3px 1px rgba(0, 0, 0, 0.05);
			}
			body,
			html {
				margin: 0;
				padding: 1rem;
				color: var(--text-color);
				background-color: var(--white);
				font-family: var(--font-family);
			}

			*,
			*::after,
			*::before {
				box-sizing: border-box;
			}

			h1, h2, h3, h4, h5, h6 {
				margin: var(--heading-margin);
			}

			ul {
				padding: 0;
				margin: 0;
				list-style: none;
			}

			* {
				box-sizing: border-box;
			}

			main {
				border-bottom: 1px solid var(--test-summary-border-color);
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
			}

			details[open] > summary:before {
			 	content: "▼";
			}

			details[open] .test-summary {
				border-bottom-width: 1px;
			}

			.test-summary {
				position: relative;
				cursor: pointer;
				padding: 0.5rem;
				border: 1px solid var(--test-summary-border-color);
				border-bottom-width: 0;
			}

			.test-summary:before {
				margin-top: 2px;
			}

			.test-summary-inner {
				display: inline-flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				padding-left: 1.25rem;
				justify-content: space-between;
			}

			.test-summary h2  {
				display: inline;
				margin: 0;
				font-size: 1rem;
			}
			.aggregated-tags {
				margin-left: auto;
				margin-right: 1rem;
				display: inline-flex;
				justify-content: flex-end;
				gap: 0.5rem;
			}
			.test-summary-status span {
				padding: 0.25rem 0.5rem;
				border-style: solid;
				border-width: 1px 1px 1px 0;
			}
			.test-summary-status {
				display: flex;
				border-radius: 4px;
				box-shadow: var(--box-shadow);
			}
			.test-summary-status .meta:first-of-type {
				border-radius: 4px 0 0 4px;
				border-left-width: 1px;
			}
			
			.test-summary-passing-tests {
				border-color: var(--passing-tests-summary-color);
				background-color:  var(--passing-tests-summary-background-color);
				color: var(--passing-tests-summary-color);
			}

			.test-summary-failing-tests {
				border-color: var(--failing-tests-summary-color);
				background-color:  var(--failing-tests-summary-background-color);
				color: var(--failing-tests-summary-color);
			}

			.test-summary-todo-tests {
				border-color: var(--todo-tests-summary-color);
				background-color:  var(--todo-tests-summary-background-color);
				color: var(--todo-tests-summary-color);
			}

			.test-summary-skipped-tests {
				border-color: var(--skipped-tests-summary-color);
				background-color:  var(--skipped-tests-summary-background-color);
				color: var(--skipped-tests-summary-color);
			}
			.assertion {
				padding: 0.5rem;
				padding-left: 1.5rem;
				display: grid;
				align-items: center;
				grid-template-columns: 3fr 1fr 1.15rem;
				gap: 0.5rem;
				color: var(--list-text-color);
				border-left: 1px solid var(--list-border-color);
				border-right: 1px solid var(--list-border-color);
			}
			.assertion-ancestor {
				color: var(--list-ancestor-text-color);
			}
			.assertion.status-failed .assertion-ancestor {
				color: var(--list-text-color);
			}
			.assertion:nth-of-type(odd) {
				background-color: var(--list-even-odd-background-color);
			}
			.assertion:not(:last-child) {
				border-bottom: 1px solid var(--list-border-color);
			}
			.assertion.status-failed {
				background-color: var(--light-red);
			}
			.assertion-tags {
				display: inline-flex;
				justify-content: flex-end;
				gap: 0.5rem;
			}
			.tag {
				display: inline-flex;
				align-items: center;
				border-radius: 4px;
				padding: 4px;
				border: 1px solid var(--tag-border-color);
				background-color: var(--tag-background-color);
			}
			.assertion-error-content {
				padding: 0.5rem;
				margin: 0.5rem 0;
				font-family: var(--font-family-code);
				background-color: var(--code-background-color);
				color: var(--white);
				border-radius: 4px;
			}
			.assertion-error-details {
				grid-column: 1/3;
				width: 100%;
				position: relative;
			}

			.assertion-error-details summary:before {
				margin-top: -2px;
			}

			.assertion-error-details summary p {
				padding-left: 1.25rem;
				margin: 0;
			}

			.assertion-error-content p {
				margin: 0;
				margin-bottom: 1rem;
			}
			.expected {
				color: var(--green);
			}
			.actual {
				color: var(--red);
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
			${style}
		</style>
	</head>`;
