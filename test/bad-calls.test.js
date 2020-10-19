/**
 * @jest-environment node
 */

import { run, apply } from '..';

test('bad-calls', () => {
	expect(() => run('value', 'not-a-function')).toThrow('is not a function');
	expect(() => apply('value', 'not-a-function')).toThrow('is not a function');
	expect(() => run('value')).toThrow('is not a function');
	expect(() => apply('value')).toThrow('is not a function');
});