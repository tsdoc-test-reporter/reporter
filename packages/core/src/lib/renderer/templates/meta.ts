import { UITestResultMeta } from '../../types';
import { html } from './html';

type Props = {
	meta: UITestResultMeta;
	showText?: boolean;
};

export const formatMeta = ({ meta, showText = true }: Props): string =>
	html`<div class="test-summary-status">
		${meta.skipped > 0
			? html`<div class="meta skip-tests"><span aria-hidden="true"
						>${showText ? 'Skip:' : ''} ${meta.skipped}
					</span>
					<span class="sr-only">Skipped tests: ${meta.skipped}, </span></div>`
			: ''}
		${meta.todo > 0
			? html`<div class="meta todo-tests"><span aria-hidden="true"
						>${showText ? 'Todo:' : ''} ${meta.todo}
					</span>
					<span class="sr-only">Todo tests: ${meta.todo}, </span></div>`
			: ''}
		${meta.failed > 0
			? html`<div class="meta fail-tests"><span aria-hidden="true"
						>${showText ? 'Fail:' : ''} ${meta.failed}
					</span>
					<span class="sr-only">Failing tests: ${meta.failed}, </span></div>`
			: ''}
		${meta.passed > 0
			? html`<div class="meta pass-tests"><span aria-hidden="true"
						>${showText ? 'Pass:' : ''} ${meta.passed}
					</span>
					<span class="sr-only">Passing tests: ${meta.passed}, </span></div>`
			: ''}
	</div>`;
