import { ansiColors } from './ansi-colors';

type ConverterOptions = {
	/** The default foreground color used when reset color codes are encountered. */
	fg?: string;
	/** The default background color used when reset color codes are encountered. */
	bg?: string;
	/** Convert newline characters to `<br/>`. */
	newline?: boolean;
	/** Can override specific colors or the entire ANSI palette. */
	colors?: { [code: string]: string };
};

type Handler = {
	pattern: RegExp;
	sub: (m?: string | undefined) => string;
};

const defaults = {
	fg: '#FFF',
	bg: '#000',
	newline: false,
	escapeXML: false,
	stream: false,
	colors: getDefaultColors(),
};

function getDefaultColors() {
	const colors = { ...ansiColors };

	range(0, 5).forEach((red) => {
		range(0, 5).forEach((green) => {
			range(0, 5).forEach((blue) => setStyleColor(red, green, blue, colors));
		});
	});

	range(0, 23).forEach((gray) => {
		const c = gray + 232;
		const l = toHexString(gray * 10 + 8);

		colors[c] = '#' + l + l + l;
	});

	return colors;
}

function setStyleColor(
	red: number,
	green: number,
	blue: number,
	colors: Record<string, string>
) {
	const c = 16 + red * 36 + green * 6 + blue;
	const r = red > 0 ? red * 40 + 55 : 0;
	const g = green > 0 ? green * 40 + 55 : 0;
	const b = blue > 0 ? blue * 40 + 55 : 0;

	colors[c] = toColorHexString([r, g, b]);
}

/**
 * Converts from a number like 15 to a hex string like 'F'
 */
function toHexString(num: number): string {
	let str = num.toString(16);

	while (str.length < 2) {
		str = '0' + str;
	}

	return str;
}

/**
 * Converts from an array of numbers like [15, 15, 15] to a hex string like 'FFF'
 */
function toColorHexString(ref: [number, number, number]): string {
	const results = [];
	for (const r of ref) {
		results.push(toHexString(r));
	}
	return '#' + results.join('');
}

function generateOutput(
	stack: string[],
	token: string,
	data: string,
	options: ConverterOptions
) {
	let result;

	if (token === 'text') {
		result = pushText(data);
	} else if (token === 'display') {
		result = handleDisplay(stack, data, options);
	} else if (token === 'xterm256Foreground') {
		result = pushForegroundColor(
			stack,
			options.colors ? options.colors[data] : ''
		);
	} else if (token === 'xterm256Background') {
		result = pushBackgroundColor(
			stack,
			options.colors ? options.colors[data] : ''
		);
	} else if (token === 'rgb') {
		result = handleRgb(stack, data);
	}

	return result;
}

function handleRgb(stack: string[], data: string): string {
	data = data.substring(2).slice(0, -1);
	const operation = +data.substr(0, 2);

	const color = data.substring(5).split(';');
	const rgb = color
		.map(function (value) {
			return ('0' + Number(value).toString(16)).substr(-2);
		})
		.join('');

	return pushStyle(
		stack,
		(operation === 38 ? 'color:#' : 'background-color:#') + rgb
	);
}

function handleDisplay(
	stack: string[],
	code: number | string,
	options: ConverterOptions
): string {
	code = parseInt('' + code, 10);

	const codeMap: Record<string | number, () => string | undefined> = {
		'-1': () => '<br/>',
		0: () => (stack.length ? resetStyles(stack) : undefined),
		1: () => pushTag(stack, 'b'),
		3: () => pushTag(stack, 'i'),
		4: () => pushTag(stack, 'u'),
		8: () => pushStyle(stack, 'display:none'),
		9: () => pushTag(stack, 'strike'),
		22: () =>
			pushStyle(
				stack,
				'font-weight:normal;text-decoration:none;font-style:normal'
			),
		23: () => closeTag(stack, 'i'),
		24: () => closeTag(stack, 'u'),
		39: () => pushForegroundColor(stack, options.fg ?? ''),
		49: () => pushBackgroundColor(stack, options.bg ?? ''),
		53: () => pushStyle(stack, 'text-decoration:overline'),
	};

	let result;
	if (codeMap[code]) {
		result = codeMap[code]();
	} else if (4 < code && code < 7) {
		result = pushTag(stack, 'blink');
	} else if (29 < code && code < 38) {
		result = pushForegroundColor(
			stack,
			options.colors ? options.colors[code - 30] : ''
		);
	} else if (39 < code && code < 48) {
		result = pushBackgroundColor(
			stack,
			options.colors ? options.colors[code - 40] : ''
		);
	} else if (89 < code && code < 98) {
		result = pushForegroundColor(
			stack,
			options.colors ? options.colors[8 + (code - 90)] : ''
		);
	} else if (99 < code && code < 108) {
		result = pushBackgroundColor(
			stack,
			options.colors ? options.colors[8 + (code - 100)] : ''
		);
	}

	return result ?? '';
}

/**
 * Clear all the styles
 */
function resetStyles(stack: string[]): string {
	const stackClone = stack.slice(0);
	stack.length = 0;
	return stackClone
		.reverse()
		.map((tag) => '</' + tag + '>')
		.join('');
}

/**
 * Creates an array of numbers ranging from low to high
 * @example range(3, 7); // creates [3, 4, 5, 6, 7]
 */
function range(low: number, high: number): number[] {
	const results = [];
	for (let j = low; j <= high; j++) {
		results.push(j);
	}
	return results;
}

function pushText(text: string): string {
	return text;
}

function pushTag(stack: string[], tag: string, style?: string): string {
	if (!style) {
		style = '';
	}
	stack.push(tag);
	return `<${tag}${style ? ` style="${style}"` : ''}>`;
}

function pushStyle(stack: string[], style: string): string {
	return pushTag(stack, 'span', style);
}

function pushForegroundColor(stack: string[], color: string): string {
	return pushTag(stack, 'span', 'color:' + color);
}

function pushBackgroundColor(stack: string[], color: string): string {
	return pushTag(stack, 'span', 'background-color:' + color);
}

function closeTag(stack: string[], style: string): string | undefined {
	let last;

	if (stack.slice(-1)[0] === style) {
		last = stack.pop();
	}

	if (last) {
		return '</' + style + '>';
	}
	return undefined;
}

function tokenize(
	text: string,
	options: ConverterOptions,
	callback: (one: string, two: string | number) => void
): string[] {
	let ansiMatch = false;
	const ansiHandler = 3;

	function remove() {
		return '';
	}

	function removeXterm256Foreground(_m: string, g1: string) {
		callback('xterm256Foreground', g1);
		return '';
	}

	function removeXterm256Background(_m: string, g1: string) {
		callback('xterm256Background', g1);
		return '';
	}

	function newline(m: string) {
		if (options.newline) {
			callback('display', -1);
		} else {
			callback('text', m);
		}

		return '';
	}

	function ansiMess(_m: string, g1: string | string[]) {
		ansiMatch = true;
		if (typeof g1 === 'string' && g1.trim().length === 0) {
			g1 = '0';
		}

		if (typeof g1 === 'string') {
			g1 = g1.trimEnd().split(';');
		}

		for (const g of g1) {
			callback('display', g);
		}

		return '';
	}

	function realText(m: string) {
		callback('text', m);

		return '';
	}

	function rgb(m: string) {
		callback('rgb', m);
		return '';
	}

	/* eslint no-control-regex:0 */
	const tokens = [
		{
			pattern: /^\x08+/,
			sub: remove,
		},
		{
			pattern: /^\x1b\[[012]?K/,
			sub: remove,
		},
		{
			pattern: /^\x1b\[\(B/,
			sub: remove,
		},
		{
			pattern: /^\x1b\[[34]8;2;\d+;\d+;\d+m/,
			sub: rgb,
		},
		{
			pattern: /^\x1b\[38;5;(\d+)m/,
			sub: removeXterm256Foreground,
		},
		{
			pattern: /^\x1b\[48;5;(\d+)m/,
			sub: removeXterm256Background,
		},
		{
			pattern: /^\n/,
			sub: newline,
		},
		{
			pattern: /^\r+\n/,
			sub: newline,
		},
		{
			pattern: /^\r/,
			sub: newline,
		},
		{
			pattern: /^\x1b\[((?:\d{1,3};?)+|)m/,
			sub: ansiMess,
		},
		{
			// CSI n J
			// ED - Erase in Display Clears part of the screen.
			// If n is 0 (or missing), clear from cursor to end of screen.
			// If n is 1, clear from cursor to beginning of the screen.
			// If n is 2, clear entire screen (and moves cursor to upper left on DOS ANSI.SYS).
			// If n is 3, clear entire screen and delete all lines saved in the scrollback buffer
			//   (this feature was added for xterm and is supported by other terminal applications).
			pattern: /^\x1b\[\d?J/,
			sub: remove,
		},
		{
			// CSI n ; m f
			// HVP - Horizontal Vertical Position Same as CUP
			pattern: /^\x1b\[\d{0,3};\d{0,3}f/,
			sub: remove,
		},
		{
			// catch-all for CSI sequences?
			pattern: /^\x1b\[?[\d;]{0,3}/,
			sub: remove,
		},
		{
			/**
			 * extracts real text - not containing:
			 * - `\x1b' - ESC - escape (Ascii 27)
			 * - '\x08' - BS - backspace (Ascii 8)
			 * - `\n` - Newline - linefeed (LF) (ascii 10)
			 * - `\r` - Windows Carriage Return (CR)
			 */
			pattern: /^(([^\x1b\x08\r\n])+)/,
			sub: realText,
		},
	];

	function process(handler: Handler, i: number) {
		if (i > ansiHandler && ansiMatch) {
			return;
		}

		ansiMatch = false;

		text = text.replace(handler.pattern, handler.sub);
	}

	const results1 = [];
	let { length } = text;

	outer: while (length > 0) {
		for (let i = 0, o = 0, len = tokens.length; o < len; i = ++o) {
			const handler = tokens[i];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			process(handler as any, i);

			if (text.length !== length) {
				// We matched a token and removed it from the text. We need to
				// start matching *all* tokens against the new text.
				length = text.length;
				continue outer;
			}
		}

		if (text.length === length) {
			break;
		}
		results1.push(0 + '');

		length = text.length;
	}

	return results1;
}

export class AnsiToHtmlConverter {
	private readonly options: ConverterOptions;
	private readonly stack: string[];

	constructor(options: ConverterOptions = {}) {
		if (options.colors) {
			options.colors = { ...defaults.colors, ...options.colors };
		}

		this.options = { ...defaults, ...options };
		this.stack = [];
	}

	public toHtml(input: string | string[]): string {
		input = typeof input === 'string' ? [input] : input;
		const { stack, options } = this;
		const buf = [];

		tokenize(input.join(''), options, (token, data) => {
			const output = generateOutput(stack, token, data + '', options);

			if (output) {
				buf.push(output);
			}
		});

		if (stack.length) {
			buf.push(resetStyles(stack));
		}

		return buf.join('');
	}
}
