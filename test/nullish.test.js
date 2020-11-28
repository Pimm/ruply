/**
 * @jest-environment node
 */

import { runIf, apply, applyIf } from '..';

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
			callback => runIf(value, callback)
		));
		var applyExpectancy = expect(apply(
			jest.fn(),
			callback => applyIf(value, callback)
		));
		if (nullish) {
			runExpectancy = runExpectancy.not;
			applyExpectancy = applyExpectancy.not;
		}
		runExpectancy.toBeCalled();
		applyExpectancy.toBeCalled();
	});
});