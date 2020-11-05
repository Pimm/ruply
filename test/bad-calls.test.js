/**
 * @jest-environment node
 */

import { run, apply } from '..';

test('bad-calls', () => {
	expect(() => run('value', 'not-a-function')).toThrow('is not a function');
	expect(() => apply('value', 'not-a-function')).toThrow('is not a function');
	expect(() => run('value')).toThrow('is not a function');
	expect(() => apply('value')).toThrow('is not a function');
	expect(() => run('value', () => 'result', 'garbage')).toThrow('is not a boolean value nor a function');
	expect(() => apply('value', () => 'result', 'garbage')).toThrow('is not a boolean value nor a function');
});