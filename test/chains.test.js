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
	run([createIncrement(), createIncrement(), createIncrement()], ([increment1, increment2, increment3]) => {
		expect(
			run(5, increment1, increment2, increment3)
		).toBe(8);
		expect(increment1).toBeCalledWith(5);
		expect(increment2).toBeCalledWith(6);
		expect(increment3).toBeCalledWith(7);
	});
	run([createIncrement(), createIncrement(), createIncrement()], ([increment1, increment2, increment3]) => {
		expect(
			runIf(5, increment1, increment2, increment3)
		).toBe(8);
		expect(increment1).toBeCalledWith(5);
		expect(increment2).toBeCalledWith(6);
		expect(increment3).toBeCalledWith(7);
	});
	// apply with a complete chain.
	run([createIncrement(), createIncrement(), createIncrement()], ([increment1, increment2, increment3]) => {
		expect(
			apply(5, increment1, increment2, increment3)
		).toBe(5);
		expect(increment1).toBeCalledWith(5);
		expect(increment2).toBeCalledWith(5);
		expect(increment3).toBeCalledWith(5);
	});
	// run(If) with a broken chain.
	run([createIncrement(), createNullReturningCallback(), createIncrement()], ([increment1, returnNull, increment2]) => {
		expect(
			run(5, increment1, returnNull, increment2)
		).toBe(1);
		expect(increment1).toBeCalledWith(5);
		expect(returnNull).toBeCalledWith(6);
		expect(increment2).toBeCalledWith(null);
	});
	run([createIncrement(), createNullReturningCallback(), createIncrement()], ([increment1, returnNull, increment2]) => {
		expect(
			runIf(5, increment1, returnNull, increment2)
		).toBe(null);
		expect(increment1).toBeCalledWith(5);
		expect(returnNull).toBeCalledWith(6);
		expect(increment2).not.toBeCalled();
	});
	// apply with a broken chain.
	run([createIncrement(), createNullReturningCallback(), createIncrement()], ([increment1, returnNull, increment2]) => {
		expect(
			apply(5, increment1, returnNull, increment2)
		).toBe(5);
		expect(increment1).toBeCalledWith(5);
		expect(returnNull).toBeCalledWith(5);
		expect(increment2).toBeCalledWith(5);
	});
});