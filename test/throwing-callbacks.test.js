/**
 * @jest-environment node
 */

import { run, runIf, apply } from '..';

function pause() {
	return new Promise(resolve => void setTimeout(resolve, 10));
}

function createThrowingCallback() {
	return jest.fn(() => {
		throw 'error';
	});
}

function createAsyncThrowingCallback() {
	return jest.fn(() => pause().then(() => {
		throw 'error';
	}));
}

function resolveShortly(value) {
	return pause().then(Promise.resolve.bind(Promise, value));
}

test('throwing-callbacks', () => {
	expect.assertions(24);
	// Simple run[If].
	run(createThrowingCallback(), throwingCallback => {
		expect(() => run('value', throwingCallback)).toThrow('error');
		expect(throwingCallback).toHaveBeenCalledWith('value');
	});
	run(createThrowingCallback(), throwingCallback => {
		expect(() => runIf('value', throwingCallback)).toThrow('error');
		expect(throwingCallback).toHaveBeenCalledWith('value');
	});
	// Simple apply.
	run(createThrowingCallback(), throwingCallback => {
		expect(() => apply('value', throwingCallback)).toThrow('error');
		expect(throwingCallback).toHaveBeenCalledWith('value');
	});
	return Promise.all([
		// run[If] with async callback.
		run(createAsyncThrowingCallback(), throwingCallback => {
			return expect(run('value', throwingCallback)).rejects.toBe('error')
			.then(() => expect(throwingCallback).toHaveBeenCalledWith('value'));
		}),
		run(createAsyncThrowingCallback(), throwingCallback => {
			return expect(runIf('value', throwingCallback)).rejects.toBe('error')
			.then(() => expect(throwingCallback).toHaveBeenCalledWith('value'));
		}),
		// apply with async callback.
		run(createAsyncThrowingCallback(), throwingCallback => {
			return expect(apply('value', throwingCallback)).rejects.toBe('error')
			.then(() => expect(throwingCallback).toHaveBeenCalledWith('value'));
		}),
		// run[If] with promise.
		run(createThrowingCallback(), throwingCallback => {
			return expect(run(resolveShortly('value'), throwingCallback)).rejects.toBe('error')
			.then(() => expect(throwingCallback).toHaveBeenCalledWith('value'));
		}),
		run(createThrowingCallback(), throwingCallback => {
			return expect(runIf(resolveShortly('value'), throwingCallback)).rejects.toBe('error')
			.then(() => expect(throwingCallback).toHaveBeenCalledWith('value'));
		}),
		// apply with promise.
		run(createThrowingCallback(), throwingCallback => {
			return expect(apply(resolveShortly('value'), throwingCallback)).rejects.toBe('error')
			.then(() => expect(throwingCallback).toHaveBeenCalledWith('value'));
		}),
		// run[If] with promise and async callback.
		run(createAsyncThrowingCallback(), throwingCallback => {
			return expect(run(resolveShortly('value'), throwingCallback)).rejects.toBe('error')
			.then(() => expect(throwingCallback).toHaveBeenCalledWith('value'));
		}),
		run(createAsyncThrowingCallback(), throwingCallback => {
			return expect(runIf(resolveShortly('value'), throwingCallback)).rejects.toBe('error')
			.then(() => expect(throwingCallback).toHaveBeenCalledWith('value'));
		}),
		// apply with promise and async callback.
		run(createAsyncThrowingCallback(), throwingCallback => {
			return expect(apply(resolveShortly('value'), throwingCallback)).rejects.toBe('error')
			.then(() => expect(throwingCallback).toHaveBeenCalledWith('value'));
		})
	]);
});