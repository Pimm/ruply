/**
 * @jest-environment node
 */

import { run, apply } from '..';

function createCallback() {
	return jest.fn(() => 'result');
}

function createAlternativeCallback() {
	return jest.fn(() => 'alternative');
}

test('true-null-behavior', () => {
	expect.assertions(12);
	// run with non-null-ish argument.
	run(createCallback(), callback => {
		expect(
			run('value', callback, true)
		).toBe('result');
		expect(callback).toBeCalledWith('value');
	});
	// apply with non-null-ish argument.
	run(createCallback(), callback => {
		expect(
			apply('value', callback, true)
		).toBe('value');
		expect(callback).toBeCalledWith('value');
	});
	// run with null argument.
	run(createCallback(), callback => {
		expect(
			run(null, callback, true)
		).toBe('result');
		expect(callback).toBeCalledWith(null);
	});
	// apply with null argument.
	run(createCallback(), callback => {
		expect(
			apply(null, callback, true)
		).toBe(null);
		expect(callback).toBeCalledWith(null);
	});
	// run with undefined argument.
	run(createCallback(), callback => {
		expect(
			run(undefined, callback, true)
		).toBe('result');
		expect(callback).toBeCalledWith(undefined);
	});
	// apply with undefined argument.
	run(createCallback(), callback => {
		expect(
			apply(undefined, callback, true)
		).toBe(undefined);
		expect(callback).toBeCalledWith(undefined);
	});
});

test('alternative-null-behavior', () => {
	expect.assertions(18);
	// run with non-null-ish argument.
	run([createCallback(), createAlternativeCallback()], ([callback, alternativeCallback]) => {
		expect(
			run('value', callback, alternativeCallback)
		).toBe('result');
		expect(callback).toBeCalledWith('value');
		expect(alternativeCallback).not.toBeCalled();
	});
	// apply with non-null-ish argument.
	run([createCallback(), createAlternativeCallback()], ([callback, alternativeCallback]) => {
		expect(
			apply('value', callback, alternativeCallback)
		).toBe('value');
		expect(callback).toBeCalledWith('value');
		expect(alternativeCallback).not.toBeCalled();
	});
	// run with null argument.
	run([createCallback(), createAlternativeCallback()], ([callback, alternativeCallback]) => {
		expect(
			run(null, callback, alternativeCallback)
		).toBe('alternative');
		expect(callback).not.toBeCalled();
		expect(alternativeCallback).toBeCalledWith(null);
	});
	// apply with null argument.
	run([createCallback(), createAlternativeCallback()], ([callback, alternativeCallback]) => {
		expect(
			apply(null, callback, alternativeCallback)
		).toBe(null);
		expect(callback).not.toBeCalled();
		expect(alternativeCallback).toBeCalledWith(null);
	});
	// run with undefined argument.
	run([createCallback(), createAlternativeCallback()], ([callback, alternativeCallback]) => {
		expect(
			run(undefined, callback, alternativeCallback)
		).toBe('alternative');
		expect(callback).not.toBeCalled();
		expect(alternativeCallback).toBeCalledWith(undefined);
	});
	// apply with null argument.
	run([createCallback(), createAlternativeCallback()], ([callback, alternativeCallback]) => {
		expect(
			apply(undefined, callback, alternativeCallback)
		).toBe(undefined);
		expect(callback).not.toBeCalled();
		expect(alternativeCallback).toBeCalledWith(undefined);
	});
});