/**
 * @jest-environment node
 */

import { run } from '..';

test('promises-rejection', () => {
	expect.assertions(2);
	return run(
		jest.fn(input => Promise.resolve(input + 1)),
		increment => {
			return expect(
				run(Promise.reject(new Error('Could not get the number')), increment)
			).rejects.toThrow('Could not get the number')
			.then(() => expect(increment).not.toBeCalled());
		}
	);
});