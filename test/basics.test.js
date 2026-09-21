/**
 * @jest-environment node
 */

import { run, runIf, apply } from '..';

function createCallback() {
	return jest.fn(() => 'result');
}

test('basics', () => {
	expect.assertions(18);
	// run[If] with non-null-ish argument.
	run(createCallback(), callback => {
		expect(
			run('value', callback)
		).toBe('result');
		expect(callback).toHaveBeenCalledWith('value');
	});
	run(createCallback(), callback => {
		expect(
			runIf('value', callback)
		).toBe('result');
		expect(callback).toHaveBeenCalledWith('value');
	});
	// apply with non-null-ish argument.
	run(createCallback(), callback => {
		expect(
			apply('value', callback)
		).toBe('value');
		expect(callback).toHaveBeenCalledWith('value');
	});
	// run[If] with null argument.
	run(createCallback(), callback => {
		expect(
			run(null, callback)
		).toBe('result');
		expect(callback).toHaveBeenCalledWith(null);
	});
	run(createCallback(), callback => {
		expect(
			runIf(null, callback)
		).toBe(null);
		expect(callback).not.toHaveBeenCalled();
	});
	// apply with null argument.
	run(createCallback(), callback => {
		expect(
			apply(null, callback)
		).toBe(null);
		expect(callback).toHaveBeenCalledWith(null);
	});
	// run[If] with undefined argument.
	run(createCallback(), callback => {
		expect(
			run(undefined, callback)
		).toBe('result');
		expect(callback).toHaveBeenCalledWith(undefined);
	});
	run(createCallback(), callback => {
		expect(
			runIf(undefined, callback)
		).toBe(undefined);
		expect(callback).not.toHaveBeenCalled();
	});
	// apply with undefined argument.
	run(createCallback(), callback => {
		expect(
			apply(undefined, callback)
		).toBe(undefined);
		expect(callback).toHaveBeenCalledWith(undefined);
	});
});