/**
 * @jest-environment node
 */

import { run, apply } from '..';

function pause() {
	return new Promise(resolve => void setTimeout(resolve, 10));
}

function createCallback() {
	return jest.fn(() => 'result');
}

function createAsyncCallback() {
	return jest.fn(() => pause().then(() => 'result'));
}

function resolveShortly(value) {
	return pause().then(Promise.resolve.bind(Promise, value));
}

test('async-callback', () => {
	expect.assertions(12);
	return Promise.all([
		// run with non-null-ish argument.
		run(createAsyncCallback(), callback => {
			return expect(
				run('value', callback)
			).resolves.toBe('result')
			.then(() => expect(callback).toBeCalledWith('value'));
		}),
		// apply with non-null-ish argument.
		run(createAsyncCallback(), callback => {
			return expect(
				apply('value', callback)
			).resolves.toBe('value')
			.then(() => expect(callback).toBeCalledWith('value'));
		}),
		// run with null argument.
		run(createAsyncCallback(), callback => {
			expect(
				run(null, callback)
			).toBe(null);
			expect(callback).not.toBeCalled();
		}),
		// apply with null argument.
		run(createAsyncCallback(), callback => {
			expect(
				apply(null, callback)
			).toBe(null);
			expect(callback).not.toBeCalled();
		}),
		// run with undefined argument.
		run(createAsyncCallback(), callback => {
			expect(
				run(undefined, callback)
			).toBe(undefined);
			expect(callback).not.toBeCalled();
		}),
		// apply with undefined argument.
		run(createAsyncCallback(), callback => {
			expect(
				apply(undefined, callback)
			).toBe(undefined);
			expect(callback).not.toBeCalled();
		})
	]);
});

test('promise-value', () => {
	expect.assertions(13);
	return Promise.all([
		// run with promise which resolves to non-null-ish value.
		run(createCallback(), callback => {
			return expect(
				run(resolveShortly('value'), callback)
			).resolves.toBe('result')
			.then(() => expect(callback).toBeCalledWith('value'));
		}),
		// apply with promise which resolves to non-null-ish value.
		run(createCallback(), callback => {
			const startTime = Date.now();
			return expect(
				apply(resolveShortly('value'), callback)
			).resolves.toBe('value')
			// The returned promise should not be resolved until the one returned by the callback has.
			.then(() => expect(Date.now() - startTime).toBeGreaterThanOrEqual(10))
			.then(() => expect(callback).toBeCalledWith('value'));
		}),
		// run with promise which resolves to null.
		run(createCallback(), callback => {
			return expect(
				run(resolveShortly(null), callback)
			).resolves.toBe(null)
			.then(() => expect(callback).not.toBeCalled());
		}),
		// apply with promise which resolves to null.
		run(createCallback(), callback => {
			return expect(
				apply(resolveShortly(null), callback)
			).resolves.toBe(null)
			.then(() => expect(callback).not.toBeCalled());
		}),
		// run with promise which resolves to undefined.
		run(createCallback(), callback => {
			return expect(
				run(resolveShortly(undefined), callback)
			).resolves.toBe(undefined)
			.then(() => expect(callback).not.toBeCalled());
		}),
		// apply with promise which resolves to undefined.
		run(createCallback(), callback => {
			return expect(
				apply(resolveShortly(undefined), callback)
			).resolves.toBe(undefined)
			.then(() => expect(callback).not.toBeCalled());
		})
	]);
});

test('promise-value-async-callback', () => {
	expect.assertions(13);
	return Promise.all([
		// run with promise which resolves to non-null-ish value.
		run(createAsyncCallback(), callback => {
			return expect(
				run(resolveShortly('value'), callback)
			).resolves.toBe('result')
			.then(() => expect(callback).toBeCalledWith('value'));
		}),
		// apply with promise which resolves to non-null-ish value.
		run(createAsyncCallback(), callback => {
			const startTime = Date.now();
			return expect(
				apply(resolveShortly('value'), callback)
			).resolves.toBe('value')
			// The returned promise should not be resolved until the one returned by the callback has.
			.then(() => expect(Date.now() - startTime).toBeGreaterThanOrEqual(20))
			.then(() => expect(callback).toBeCalledWith('value'));
		}),
		// run with promise which resolves to null.
		run(createAsyncCallback(), callback => {
			return expect(
				run(resolveShortly(null), callback)
			).resolves.toBe(null)
			.then(() => expect(callback).not.toBeCalled());
		}),
		// apply with promise which resolves to null.
		run(createAsyncCallback(), callback => {
			return expect(
				apply(resolveShortly(null), callback)
			).resolves.toBe(null)
			.then(() => expect(callback).not.toBeCalled());
		}),
		// run with promise which resolves to undefined.
		run(createAsyncCallback(), callback => {
			return expect(
				run(resolveShortly(undefined), callback)
			).resolves.toBe(undefined)
			.then(() => expect(callback).not.toBeCalled());
		}),
		// apply with promise which resolves to undefined.
		run(createAsyncCallback(), callback => {
			return expect(
				apply(resolveShortly(undefined), callback)
			).resolves.toBe(undefined)
			.then(() => expect(callback).not.toBeCalled());
		})
	]);
});