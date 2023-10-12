import { UITestResultMeta } from '../../types';

export const formatMeta = (meta: UITestResultMeta): string =>
	`<div class="test-summary-status">
		${
			meta.skipped > 0
				? `<span aria-hidden="true" class="test-summary-skipped-tests"> ${meta.skipped} </span>
					<span class="sr-only">Skipped tests: ${meta.skipped}, </span>`
				: ''
		}
		${
			meta.todo > 0
				? `<span aria-hidden="true" class="test-summary-todo-tests"> ${meta.todo} </span>
					<span class="sr-only">Todo tests: ${meta.todo}, </span>`
				: ''
		}
		${
			meta.failed > 0
				? `<span aria-hidden="true" class="test-summary-failing-tests"> ${meta.failed} </span>
					<span class="sr-only">Failing tests: ${meta.failed}, </span>`
				: ''
		}
		${
			meta.passed > 0
				? `<span aria-hidden="true" class="test-summary-passing-tests"> ${meta.passed} </span>
					<span class="sr-only">Passing tests: ${meta.passed}, </span>`
				: ''
		}
	</div>`;
