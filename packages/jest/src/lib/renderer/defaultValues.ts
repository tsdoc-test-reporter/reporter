import { StatusToIconMap } from '../types';

export const statusToIconMap: StatusToIconMap = {
	passed: '✅',
	failed: '❌',
	skipped: '⏭️',
	pending: '⌛',
	todo: '🔖',
	disabled: '⛔',
	focused: ''
};

export const customColorMap: Record<number, string> = {
	1: '#ec5f67',
	2: '#99C794',
};
