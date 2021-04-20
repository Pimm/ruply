/**
 * @jest-environment node
 */

import { run, runIf, apply } from '..';

test('properties', () => {
	new Map([
		['run', run],
		['runIf', runIf],
		['apply', apply]
	])
	.forEach((implementation, name) => {
		expect(implementation.name).toBe(name);
		expect(implementation.length).toBe(2);
	});
});