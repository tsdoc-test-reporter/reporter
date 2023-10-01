export const unquoteString = (string: string): string => {
	return string.replace(/"/g, '').replace(/'/g, '');
};

export const trim = (s: string) => s.trim();