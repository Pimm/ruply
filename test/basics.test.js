/**
 * @jest-environment node
 */

import { run, apply } from '..';

function createCallback() {
	return jest.fn(() => 'result');
}

test('basics', () => {
	expect.assertions(12);
	// run with non-null-ish argument.
	run(createCallback(), callback => {
		expect(
			run('value', callback)
		).toBe('result');
		expect(callback).toBeCalledWith('value');
	});
	// apply with non-null-ish argument.
	run(createCallback(), callback => {
		expect(
			apply('value', callback)
		).toBe('value');
		expect(callback).toBeCalledWith('value');
	});
	// run with null argument.
	run(createCallback(), callback => {
		expect(
			run(null, callback)
		).toBe(null);
		expect(callback).not.toBeCalled();
	});
	// apply with null argument.
	run(createCallback(), callback => {
		expect(
			apply(null, callback)
		).toBe(null);
		expect(callback).not.toBeCalled();
	});
	// run with undefined argument.
	run(createCallback(), callback => {
		expect(
			run(undefined, callback)
		).toBe(undefined);
		expect(callback).not.toBeCalled();
	});
	// apply with undefined argument.
	run(createCallback(), callback => {
		expect(
			apply(undefined, callback)
		).toBe(undefined);
		expect(callback).not.toBeCalled();
	});
});