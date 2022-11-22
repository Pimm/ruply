/**
 * @jest-environment node
 */

import { run, runIf, apply } from '..';

function createCallback() {
	return jest.fn(() => 'result');
}

test('basics', () => {
	expect.assertions(21);
	// run[If] with non-null-ish argument.
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
	// apply with non-null-ish argument.
	run(createCallback(), callback => {
		expect(
			apply('value', callback)
		).toBe('value');
		expect(callback).toBeCalledWith('value');
	});
	// run[If] with null argument.
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
	// apply with null argument.
	run(createCallback(), callback => {
		expect(
			apply(null, callback)
		).toBe(null);
		expect(callback).toBeCalledWith(null);
	});
	// run[If] with undefined argument.
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
	// apply with undefined argument.
	run(createCallback(), callback => {
		expect(
			apply(undefined, callback)
		).toBe(undefined);
		expect(callback).toBeCalledWith(undefined);
	});
	// apply with object, which has a then getter which throws.
	run(createCallback(), callback => {
		const throwingGetter = {
			get then() { throw new Error() }
		}
		expect(
			() => apply(throwingGetter, callback)
		).not.toThrow();
		expect(callback).toHaveBeenCalledWith(throwingGetter);
	});
	// apply with object, where any getter throws.
	run(createCallback(), callback => {
		const throwingGetter = new Proxy({}, {
			get then() { throw new Error() }
		});
		expect(
			() => apply(throwingGetter, callback)
		).not.toThrow();
	});
});