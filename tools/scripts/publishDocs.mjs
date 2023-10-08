import { publish } from 'gh-pages';
import { execSync } from 'child_process';

execSync('pnpm run docs');

publish('docs', function (err) {
	if (err) console.error(err);
});
