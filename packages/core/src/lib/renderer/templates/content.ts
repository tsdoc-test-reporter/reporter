import { UIAssertion } from '../../types';
import { formatAssertion } from './assertion';

type Props = {
	assertions: UIAssertion[];
	statusMap: Record<string, string>;
	toHTML?: (content: string) => string;
	expandErrorDetails?: boolean;
};

export const formatContent = ({
	assertions,
	statusMap,
	toHTML,
	expandErrorDetails,
}: Props): string =>
	`<div class="test-assertions">
		<ul>
			${assertions
				.map((assertion) => formatAssertion({ assertion, statusMap, toHTML, expandErrorDetails }))
				.join('')}
		</ul>
	</div>`;
