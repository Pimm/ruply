/**
 * @jest-environment node
 */

import { run, runIf, apply, applyIf } from '..';

test('bad-calls', () => {
	const implementations = [run, runIf, apply, applyIf];
	implementations.forEach(implementation => expect(() => implementation('value', 'not-a-function')).toThrow('is not a function'));
	implementations.forEach(implementation => expect(() => implementation('value')).toThrow('is not a function'));
	implementations.forEach(implementation => expect(() => implementation('value', () => 'result', 'garbage')).toThrow('is not a function'));
});