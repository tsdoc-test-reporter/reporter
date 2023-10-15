# @tsdoc-test-reporter/core

@tsdoc-test-reporter/core contains the main logic for parsing comment tags from a TypeScript file. It requires a TypeScript `SourceFile` and the `TSDocParser` from `@microsoft/tsdoc`.

## Installing

```bash
npm install @tsdoc-test-reporter/core
```

## Testing

```bash
pnpm nx test core
```

## Minimal required setup

Below is a the minimal required setup to be able to parse a source file. You will need to load the source files yourself similar to the example.

```ts
import { TSDocParser } from '@microsoft/tsdoc';

import { CompilerOptions, createProgram, ScriptTarget, SourceFile } from 'typescript';

const program = createProgram(['myFileName.ts'], { target: ScriptTarget.Latest });

const sourceFile = program.getSourceFile('myFileName.ts');

const { testBlockDocComments } = new CommentTagParser({
	sourceFile,
	tsDocParser: new TSDocParser(),
});
```

## Custom tags

Example for parsing test files where you have custom TSDoc tags.

```ts
import {
	TSDocConfiguration,
	TSDocParser,
	TSDocTagDefinition,
	TSDocTagSyntaxKind,
} from '@microsoft/tsdoc';

import { CompilerOptions, createProgram, ScriptTarget, SourceFile } from 'typescript';

const program = createProgram(['myFileName.ts'], { target: ScriptTarget.Latest });

const sourceFile = program.getSourceFile('myFileName.ts');

const config = new TSDocConfiguration();
const customBlockDefinition = new TSDocTagDefinition({
	tagName: '@custom',
	syntaxKind: TSDocTagSyntaxKind.BlockTag,
});
config.addTagDefinition(customBlockDefinition);

const { testBlockDocComments } = new CommentTagParser<'@custom'>({
	sourceFile,
	tsDocParser: new TSDocParser(config),
	applyTags: ['@custom'],
});
```
