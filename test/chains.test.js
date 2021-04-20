/**
 * @jest-environment node
 */

import { run, runIf, apply } from '..';

function createIncrement() {
	return jest.fn(input => input + 1);
}

function createNullReturningCallback() {
	return jest.fn(() => null);
}

test('chains', () => {
	expect.assertions(24);
	// run(If) with a complete chain.
	run([createIncrement(), createIncrement(), createIncrement()], callbacks => {
		expect(
			run(5, ...callbacks)
		).toBe(8);
		expect(callbacks[0]).toBeCalledWith(5);
		expect(callbacks[1]).toBeCalledWith(6);
		expect(callbacks[2]).toBeCalledWith(7);
	});
	run([createIncrement(), createIncrement(), createIncrement()], callbacks => {
		expect(
			runIf(5, ...callbacks)
		).toBe(8);
		expect(callbacks[0]).toBeCalledWith(5);
		expect(callbacks[1]).toBeCalledWith(6);
		expect(callbacks[2]).toBeCalledWith(7);
	});
	// apply with a complete chain.
	run([createIncrement(), createIncrement(), createIncrement()], callbacks => {
		expect(
			apply(5, ...callbacks)
		).toBe(5);
		expect(callbacks[0]).toBeCalledWith(5);
		expect(callbacks[1]).toBeCalledWith(5);
		expect(callbacks[2]).toBeCalledWith(5);
	});
	// run(If) with a broken chain.
	run([createIncrement(), createNullReturningCallback(), createIncrement()], callbacks => {
		expect(
			run(5, ...callbacks)
		).toBe(1);
		expect(callbacks[0]).toBeCalledWith(5);
		expect(callbacks[1]).toBeCalledWith(6);
		expect(callbacks[2]).toBeCalledWith(null);
	});
	run([createIncrement(), createNullReturningCallback(), createIncrement()], callbacks => {
		expect(
			runIf(5, ...callbacks)
		).toBe(null);
		expect(callbacks[0]).toBeCalledWith(5);
		expect(callbacks[1]).toBeCalledWith(6);
		expect(callbacks[2]).not.toBeCalled();
	});
	// apply with a broken chain.
	run([createIncrement(), createNullReturningCallback(), createIncrement()], callbacks => {
		expect(
			apply(5, ...callbacks)
		).toBe(5);
		expect(callbacks[0]).toBeCalledWith(5);
		expect(callbacks[1]).toBeCalledWith(5);
		expect(callbacks[2]).toBeCalledWith(5);
	});
});