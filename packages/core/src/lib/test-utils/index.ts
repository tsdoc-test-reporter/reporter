import { inspect } from 'node:util';
import type { TypeChecker } from 'typescript';
export * from './factory';

export const getTypeChecker = () => ({}) as TypeChecker;

export const logger = (content: unknown, type: 'log' | 'warn' | 'error' = 'log') => {
	console.group('\x1b[35m@logger:\x1b[37m');
	console[type](inspect(content, { showHidden: false, depth: null, colors: true }));
	console.groupEnd();
};
