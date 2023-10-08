import {
	ITSDocTagDefinitionParameters,
	TSDocConfiguration,
	TSDocTagDefinition,
} from '@microsoft/tsdoc';

export const getTsDocParserConfig = (
	customTags?: ITSDocTagDefinitionParameters[],
): TSDocConfiguration | undefined => {
	if (!customTags?.length) {
		return undefined;
	}
	const config = new TSDocConfiguration();
	for (const tag of customTags) {
		const definition = new TSDocTagDefinition({
			tagName: tag.tagName,
			syntaxKind: tag.syntaxKind,
			allowMultiple: tag.allowMultiple,
		});
		config.addTagDefinition(definition);
	}
	return config;
};
