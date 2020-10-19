/**
 * @jest-environment node
 */

import { run, apply } from '..';

test('nullish', () => {
	expect.assertions(16);
	new Map([
		[null, true],
		[undefined, true],
		[0, false],
		['', false],
		[NaN, false],
		[[], false],
		[{}, false],
		[() => {}, false]
	])
	.forEach((nullish, value) => {
		var runExpectancy = expect(apply(
			jest.fn(),
			callback => run(value, callback)
		));
		var applyExpectancy = expect(apply(
			jest.fn(),
			callback => apply(value, callback)
		));
		if (nullish) {
			runExpectancy = runExpectancy.not;
			applyExpectancy = applyExpectancy.not;
		}
		runExpectancy.toBeCalled();
		applyExpectancy.toBeCalled();
	});
});