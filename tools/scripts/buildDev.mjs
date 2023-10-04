import pkg from '@nrwl/devkit';
const { readCachedProjectGraph } = pkg;
import { execSync } from 'child_process';
import fs from 'fs';

const graph = readCachedProjectGraph();
const jestProject = graph.nodes["jest"];

const outputPath = jestProject.data?.targets?.build?.options?.outputPath;

execSync(`nx run core:build`);
execSync(`nx run jest:build`);

process.chdir(outputPath);

try {
	const jsonRaw = fs.readFileSync(`package.json`)
		.toString()
		.replace('workspace:', 'file:../core')
		.replace("^0.0.1", "")
	const json = JSON.parse(jsonRaw);
	json.version = "13.3.7"
	fs.writeFileSync(`package.json`, JSON.stringify(json, null, 2));
} catch (e) {
	console.log(e);
}

execSync("npm install");

process.chdir("../core")

execSync("npm install");
