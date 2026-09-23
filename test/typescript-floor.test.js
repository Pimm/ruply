/**
 * @jest-environment node
 */

import path from 'path';
import checkTypes from 'tsd-floor';

test('typescript-floor', async () => {
	// The typings require TypeScript 4.5 (for Awaited), the oldest version which they support. The type tests are run
	// with a release of tsd which bundles that version, so that a change which only works with a newer TypeScript is
	// caught here rather than by a consumer.
	const diagnostics = await checkTypes({ cwd: __dirname });
	expect(diagnostics.map(({ fileName, line, column, message }) => `${path.basename(fileName)}:${line}:${column} ${message}`)).toEqual([]);
}, 60000);
