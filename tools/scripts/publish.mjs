import devKit from '@nx/devkit';
import packageJsonFetcher from 'package-json';
import semver from 'semver';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import chalk from 'chalk';

function invariant(condition, message) {
	if (!condition) {
		console.error(chalk.red.bold(message));
		process.exit(1);
	}
}

const [, , name, tagFromCLI] = process.argv;

const tag = !tagFromCLI || tagFromCLI === 'undefined' ? 'latest' : tagFromCLI;

invariant(
	tag,
	`No valid tag supplied, got: ${tag}`,
);

let npmPackageJsonVersion;

try {
	const npmPackageJson = await packageJsonFetcher(`@tsdoc-test-reporter/${name}`, {
		version: tag,
	});
	npmPackageJsonVersion = npmPackageJson.version;
} catch (error) {
	if(error.name === "VersionNotFoundError") {
		npmPackageJsonVersion = "0.0.0";
	} else {
		console.error(chalk.red.bold(error));
		process.exit(1);
	}
}

const graph = devKit.readCachedProjectGraph();
const project = graph.nodes[name];

const localPackageJson = JSON.parse(
	readFileSync(path.resolve(project.data.root, 'package.json')).toString(),
);

invariant(
	semver.valid(localPackageJson.version) &&
	semver.valid(npmPackageJsonVersion) &&
	semver.gt(localPackageJson.version, npmPackageJsonVersion),
	`Expected version to be higher than:${npmPackageJsonVersion}, is: ${localPackageJson.version}. Bump version in local package.json`,
);

invariant(
	project,
	`Could not find project "${name}" in the workspace. Is the project.json configured correctly?`,
);

const outputPath = project.data?.targets?.build?.options?.outputPath;
invariant(
	outputPath,
	`Could not find "build.options.outputPath" of project "${name}". Is project.json configured correctly?`,
);

execSync(`nx run ${name}:build`);

process.chdir(outputPath);

try {
	const jsonRaw = readFileSync(`package.json`).toString().replace('workspace:', '');
	const json = JSON.parse(jsonRaw);
	writeFileSync(`package.json`, JSON.stringify(json, null, 2));
} catch (e) {
	console.error(chalk.bold.red(`Error reading package.json file from library build output.`));
}

execSync(`npm publish --access public --tag ${tag}`);
