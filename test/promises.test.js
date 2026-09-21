/**
 * @jest-environment node
 */

import { run, runIf, apply } from '..';

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
		// run[If] with non-null-ish argument.
		run(createAsyncCallback(), callback => {
			return expect(
				run('value', callback)
			).resolves.toBe('result')
			.then(() => expect(callback).toHaveBeenCalledWith('value'));
		}),
		run(createAsyncCallback(), callback => {
			return expect(
				runIf('value', callback)
			).resolves.toBe('result')
			.then(() => expect(callback).toHaveBeenCalledWith('value'));
		}),
		// apply with non-null-ish argument.
		run(createAsyncCallback(), callback => {
			return expect(
				apply('value', callback)
			).resolves.toBe('value')
			.then(() => expect(callback).toHaveBeenCalledWith('value'));
		}),
		// run[If] with null argument.
		run(createAsyncCallback(), callback => {
			return expect(
				run(null, callback)
			).resolves.toBe('result')
			.then(() => expect(callback).toHaveBeenCalledWith(null));
		}),
		run(createAsyncCallback(), callback => {
			expect(
				runIf(null, callback)
			).toBe(null);
			expect(callback).not.toHaveBeenCalled();
		}),
		// apply with null argument.
		run(createAsyncCallback(), callback => {
			return expect(
				apply(null, callback)
			).resolves.toBe(null)
			.then(() => expect(callback).toHaveBeenCalledWith(null));
		})
	]);
});

test('promise-value', () => {
	expect.assertions(13);
	return Promise.all([
		// run[If] with promise which resolves to non-null-ish value.
		run(createCallback(), callback => {
			return expect(
				run(resolveShortly('value'), callback)
			).resolves.toBe('result')
			.then(() => expect(callback).toHaveBeenCalledWith('value'));
		}),
		run(createCallback(), callback => {
			return expect(
				runIf(resolveShortly('value'), callback)
			).resolves.toBe('result')
			.then(() => expect(callback).toHaveBeenCalledWith('value'));
		}),
		// apply with promise which resolves to non-null-ish value.
		run(createCallback(), callback => {
			const startTime = Date.now();
			return expect(
				apply(resolveShortly('value'), callback)
			).resolves.toBe('value')
			// The returned promise should not be resolved until the one returned by the callback has.
			.then(() => expect(Date.now() - startTime).toBeGreaterThanOrEqual(10))
			.then(() => expect(callback).toHaveBeenCalledWith('value'));
		}),
		// run[If] with promise which resolves to null.
		run(createCallback(), callback => {
			return expect(
				run(resolveShortly(null), callback)
			).resolves.toBe('result')
			.then(() => expect(callback).toHaveBeenCalledWith(null));
		}),
		run(createCallback(), callback => {
			return expect(
				runIf(resolveShortly(null), callback)
			).resolves.toBe(null)
			.then(() => expect(callback).not.toHaveBeenCalled());
		}),
		// apply with promise which resolves to null.
		run(createCallback(), callback => {
			return expect(
				apply(resolveShortly(null), callback)
			).resolves.toBe(null)
			.then(() => expect(callback).toHaveBeenCalledWith(null));
		})
	]);
});

test('promise-value-async-callback', () => {
	expect.assertions(13);
	return Promise.all([
		// run[If] with promise which resolves to non-null-ish value.
		run(createAsyncCallback(), callback => {
			return expect(
				run(resolveShortly('value'), callback)
			).resolves.toBe('result')
			.then(() => expect(callback).toHaveBeenCalledWith('value'));
		}),
		run(createAsyncCallback(), callback => {
			return expect(
				runIf(resolveShortly('value'), callback)
			).resolves.toBe('result')
			.then(() => expect(callback).toHaveBeenCalledWith('value'));
		}),
		// apply with promise which resolves to non-null-ish value.
		run(createAsyncCallback(), callback => {
			const startTime = Date.now();
			return expect(
				apply(resolveShortly('value'), callback)
			).resolves.toBe('value')
			// The returned promise should not be resolved until the one returned by the callback has.
			.then(() => expect(Date.now() - startTime).toBeGreaterThanOrEqual(20))
			.then(() => expect(callback).toHaveBeenCalledWith('value'));
		}),
		// run[If] with promise which resolves to null.
		run(createAsyncCallback(), callback => {
			return expect(
				run(resolveShortly(null), callback)
			).resolves.toBe('result')
			.then(() => expect(callback).toHaveBeenCalledWith(null));
		}),
		run(createAsyncCallback(), callback => {
			return expect(
				runIf(resolveShortly(null), callback)
			).resolves.toBe(null)
			.then(() => expect(callback).not.toHaveBeenCalled());
		}),
		// apply with promise which resolves to null.
		run(createAsyncCallback(), callback => {
			return expect(
				apply(resolveShortly(null), callback)
			).resolves.toBe(null)
			.then(() => expect(callback).toHaveBeenCalledWith(null));
		})
	]);
});