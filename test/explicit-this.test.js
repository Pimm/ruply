/**
 * @jest-environment node
 */

import { run, runIf, apply, applyIf } from '..';

function pause() {
	return new Promise(resolve => void setTimeout(resolve, 10));
}

function resolveShortly(value) {
	return pause().then(Promise.resolve.bind(Promise, value));
}

test('explicit-this', () => {
	expect.assertions(16);
	// run(If).
	(() => {
		var context;
		expect(
			run.call('context', 'value', function() {
				context = this;
				return 'result';
			})
		).toBe('result');
		expect(context).toBe('context');
	})();
	(() => {
		var context;
		expect(
			runIf.call('context', 'value', function() {
				context = this;
				return 'result';
			})
		).toBe('result');
		expect(context).toBe('context');
	})();
	// apply(If).
	(() => {
		var context;
		expect(
			apply.call('context', 'value', function() {
				context = this;
				return 'result';
			})
		).toBe('value');
		expect(context).toBe('context');
	})();
	(() => {
		var context;
		expect(
			applyIf.call('context', 'value', function() {
				context = this;
				return 'result';
			})
		).toBe('value');
		expect(context).toBe('context');
	})();
	return Promise.all([
		// run(If) with promise.
		(() => {
			var context;
			return expect(
				run.call('context', resolveShortly('value'), function() {
					context = this;
					return 'result';
				})
			).resolves.toBe('result')
			.then(() => expect(context).toBe('context'));
		})(),
		(() => {
			var context;
			return expect(
				runIf.call('context', resolveShortly('value'), function() {
					context = this;
					return 'result';
				})
			).resolves.toBe('result')
			.then(() => expect(context).toBe('context'));
		})(),
		// apply(If) with promise.
		(() => {
			var context;
			return expect(
				apply.call('context', resolveShortly('value'), function() {
					context = this;
					return 'result';
				})
			).resolves.toBe('value')
			.then(() => expect(context).toBe('context'));
		})(),
		(() => {
			var context;
			return expect(
				applyIf.call('context', resolveShortly('value'), function() {
					context = this;
					return 'result';
				})
			).resolves.toBe('value')
			.then(() => expect(context).toBe('context'));
		})()
	]);
});