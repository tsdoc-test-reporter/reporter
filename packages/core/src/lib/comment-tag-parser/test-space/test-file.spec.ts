import { createProgram } from 'typescript';
import { expect, test } from 'vitest';
import { defaultCompilerOptions } from '../../utils/ts.utils';
import { CommentTagParser } from '..';
import {
	TSDocConfiguration,
	TSDocParser,
	TSDocTagDefinition,
	TSDocTagSyntaxKind,
} from '@microsoft/tsdoc';
import { mockedGetTestTitleFromExpression } from '../../test-utils';

test.skip('test file', () => {
	const program = createProgram([`${__dirname}/test-file.ts`], defaultCompilerOptions);
	const sourceFile = program.getSourceFile(`${__dirname}/test-file.ts`);
	const config = new TSDocConfiguration();
	const customBlockDefinition = new TSDocTagDefinition({
		tagName: '@custom',
		syntaxKind: TSDocTagSyntaxKind.BlockTag,
	});
	config.addTagDefinition(customBlockDefinition);
	if (sourceFile) {
		const { testBlockDocComments } = new CommentTagParser({
			tsDocParser: new TSDocParser(config),
			sourceFile,
			getTestTitleFromExpression: mockedGetTestTitleFromExpression,
		});
		expect(testBlockDocComments).toBeDefined();
	}
});
