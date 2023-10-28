export const unquoteString = (string: string): string => {
	return string.replace(/"/g, '').replace(/'/g, '');
};

export const trim = (s: string) => s.trim();

export const stripTabsAndNewlines = (s: string): string => {
	return s.replace(/\t/g, '').replace(/\r/g, '').replace(/\n/g, '');
};

export const addRootDir = (root: string | undefined) => (filepath: string) => {
	if (!root) {
		return filepath;
	}
	return `${root}${filepath}`;
};
