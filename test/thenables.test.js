/**
 * @jest-environment node
 */

import { run, runIf, apply } from '..';

/**
 * A minimal promise-like which is not a promise: its `then` calls back synchronously and returns another `Box`.
 */
class Box {
	constructor(value) {
		this.value = value;
	}
	then(onFulfilled) {
		return new Box(onFulfilled(this.value));
	}
}

test('thenables', () => {
	expect.assertions(8);
	// Callbacks receive the value to which the promise-like resolves, not the promise-like itself.
	run(new Box(1), value => expect(value).toBe(1));
	runIf(new Box(1), value => expect(value).toBe(1));
	apply(new Box(1), value => expect(value).toBe(1));
	// What is returned is whatever the promise-like's then returns.
	expect(run(new Box(1), value => value + 1)).toBeInstanceOf(Box);
	expect(run(new Box(1), value => value + 1).value).toBe(2);
	// A promise-like returned by a callback is unwrapped for the next callback.
	expect(run(1, value => new Box(value + 1), value => value * 10).value).toBe(20);
	// A null-ish resolution ends a runIf chain.
	expect(runIf(new Box(null), () => 'called').value).toBe(null);
	// The guarantees about errors depend on then: one which calls back synchronously makes a throwing callback throw.
	expect(() => run(new Box(1), () => {
		throw new Error('boom');
	})).toThrow('boom');
});
