import { UIAssertion } from '../../types';
import { formatAssertion } from './assertion';

type Props = {
	assertions: UIAssertion[];
	statusMap: Record<string, string>;
	toHTML?: (content: string) => string;
};

export const formatContent = ({ assertions, statusMap, toHTML }: Props): string =>
	`<div class="test-assertions">
		<ul>
			${assertions.map((assertion) => formatAssertion({ assertion, statusMap, toHTML })).join('')}
		</ul>
	</div>`;
