/**
 * @jest-environment node
 */

import { run, apply } from '..';

test('nullish', () => {
	apply(
		new Map([
			[null, true],
			[undefined, true],
			[0, false],
			['', false],
			['null', false],
			['undefined', false],
			[NaN, false],
			[[], false],
			[{}, false],
			[() => {}, false]
		]),
		map => expect.assertions(map.size * 2)
	)
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