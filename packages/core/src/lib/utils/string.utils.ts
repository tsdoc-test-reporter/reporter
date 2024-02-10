export const unquoteString = (string: string): string => {
	return string.replace(/"/g, '').replace(/'/g, '');
};

export const trim = (s: string) => s.trim();

export const stripTabsAndNewlines = (s: string): string => {
	return s.replace(/\t/g, '').replace(/\r/g, '').replace(/\n/g, '');
};

const AT_SIGN = '@';

export const removeAtSign = (name: string) => name.replace(AT_SIGN, '');

export const rootDirReplacer =
	(root: string | undefined, replacer: string | undefined) => (filepath: string) => {
		if (!root || !replacer) {
			return filepath;
		}
		return filepath.replace(root, replacer);
	};

export const titleFormatter =
	(rootDir?: string) =>
	(title: string): string =>
		rootDir && rootDir !== '.' ? title.replace(rootDir, '') : title;
