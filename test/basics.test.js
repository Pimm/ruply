/**
 * @jest-environment node
 */

import { run, runIf, apply, applyIf } from '..';

function createCallback() {
	return jest.fn(() => 'result');
}

test('basics', () => {
	expect.assertions(24);
	// run(If) with non-null-ish argument.
	run(createCallback(), callback => {
		expect(
			run('value', callback)
		).toBe('result');
		expect(callback).toBeCalledWith('value');
	});
	run(createCallback(), callback => {
		expect(
			runIf('value', callback)
		).toBe('result');
		expect(callback).toBeCalledWith('value');
	});
	// apply(If) with non-null-ish argument.
	run(createCallback(), callback => {
		expect(
			apply('value', callback)
		).toBe('value');
		expect(callback).toBeCalledWith('value');
	});
	run(createCallback(), callback => {
		expect(
			applyIf('value', callback)
		).toBe('value');
		expect(callback).toBeCalledWith('value');
	});
	// run(If) with null argument.
	run(createCallback(), callback => {
		expect(
			run(null, callback)
		).toBe('result');
		expect(callback).toBeCalledWith(null);
	});
	run(createCallback(), callback => {
		expect(
			runIf(null, callback)
		).toBe(null);
		expect(callback).not.toBeCalled();
	});
	// apply(If) with null argument.
	run(createCallback(), callback => {
		expect(
			apply(null, callback)
		).toBe(null);
		expect(callback).toBeCalledWith(null);
	});
	run(createCallback(), callback => {
		expect(
			applyIf(null, callback)
		).toBe(null);
		expect(callback).not.toBeCalled();
	});
	// run(If) with undefined argument.
	run(createCallback(), callback => {
		expect(
			run(undefined, callback)
		).toBe('result');
		expect(callback).toBeCalledWith(undefined);
	});
	run(createCallback(), callback => {
		expect(
			runIf(undefined, callback)
		).toBe(undefined);
		expect(callback).not.toBeCalled();
	});
	// apply(If) with undefined argument.
	run(createCallback(), callback => {
		expect(
			apply(undefined, callback)
		).toBe(undefined);
		expect(callback).toBeCalledWith(undefined);
	});
	run(createCallback(), callback => {
		expect(
			applyIf(undefined, callback)
		).toBe(undefined);
		expect(callback).not.toBeCalled();
	});
});