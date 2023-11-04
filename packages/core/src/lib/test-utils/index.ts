import { inspect } from 'node:util';
import type { TypeChecker } from 'typescript';
export * from './factory';

export const getTypeChecker = () => ({}) as TypeChecker;

export const logger = (content: unknown) =>  {
  console.group('\x1b[35m@logger:\x1b[37m');
  console.log(inspect(content, { showHidden: false, depth: null, colors: true }));
  console.groupEnd();
}