/**
 * @jest-environment node
 */

import { runIf, apply } from '..';

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
		map => expect.assertions(map.size)
	)
	.forEach((nullish, value) => {
		var expectancy = expect(apply(
			jest.fn(),
			callback => runIf(value, callback)
		));
		if (nullish) {
			expectancy = expectancy.not;
		}
		expectancy.toBeCalled();
	});
});