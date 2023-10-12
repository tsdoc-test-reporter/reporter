import { UIAssertion } from '../../types';
import { formatAssertion } from './assertion';

type Props = {
	assertions: UIAssertion[];
	statusMap: Record<string, string>;
};

export const formatContent = ({ assertions, statusMap }: Props): string =>
	`<div class="test-assertions">
		<ul>
			${assertions.map((assertion) => formatAssertion({ assertion, statusMap })).join('')}
		</ul>
	</div>`;
