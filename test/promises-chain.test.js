/**
 * @jest-environment node
 */

import { run } from '..';

test('promises-chain', () => {
	expect.assertions(4);
	return run(
		[jest.fn(input => Promise.resolve(input + 1)), jest.fn(input => Promise.resolve(input * 2)), jest.fn(input => Promise.resolve(Math.pow(input, 2)))],
		([increment, double, square]) => {
			return expect(
				run(2, increment, double, square)
			).resolves.toBe(36)
			.then(() => expect(increment).toBeCalledWith(2))
			.then(() => expect(double).toBeCalledWith(3))
			.then(() => expect(square).toBeCalledWith(6));
		}
	);
});