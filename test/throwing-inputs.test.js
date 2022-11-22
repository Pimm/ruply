/**
 * @jest-environment node
 */

import { run, runIf, apply } from '..';

function createCallback() {
	return jest.fn(() => 'result');
}

const hostileObject = {
	get then() {
		throw 'error';
	}
};

const hostileProxy = new Proxy({}, {
	get(_, name) {
		if ('then' == name) {
			throw 'error';
		}
	}
});

test('throwing-inputs', () => {
	expect.assertions(12);
	// run with hostile object.
	run(createCallback(), callback => {
		expect(
			() => run(hostileObject, callback)
		).not.toThrow();
		expect(callback).toHaveBeenCalledWith(hostileObject);
	});
	// runIf with hostile object.
	run(createCallback(), callback => {
		expect(
			() => runIf(hostileObject, callback)
		).not.toThrow();
		expect(callback).toHaveBeenCalledWith(hostileObject);
	});
	// apply with hostile object.
	run(createCallback(), callback => {
		expect(
			() => apply(hostileObject, callback)
		).not.toThrow();
		expect(callback).toHaveBeenCalledWith(hostileObject);
	});
	// run with hostile proxy.
	run(createCallback(), callback => {
		expect(
			() => run(hostileProxy, callback)
		).not.toThrow();
		expect(callback).toHaveBeenCalledWith(hostileProxy);
	});
	// runIf with hostile proxy.
	run(createCallback(), callback => {
		expect(
			() => runIf(hostileProxy, callback)
		).not.toThrow();
		expect(callback).toHaveBeenCalledWith(hostileProxy);
	});
	// apply with hostile proxy.
	run(createCallback(), callback => {
		expect(
			() => apply(hostileProxy, callback)
		).not.toThrow();
		expect(callback).toHaveBeenCalledWith(hostileProxy);
	});
});