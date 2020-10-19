/**
 * @jest-environment node
 */

import { run, apply } from '..';

test('properties', () => {
	expect(run.name).toBe('run');
	expect(run.length).toBe(2);
	expect(apply.name).toBe('apply');
	expect(apply.length).toBe(2);
});