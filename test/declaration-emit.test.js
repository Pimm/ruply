/**
 * @jest-environment node
 */

import path from 'path';
import ts from 'typescript';

/**
 * Compiles the passed TypeScript source ‒ a consumer of this package ‒ with declaration emit, returning the
 * diagnostics and the emitted declaration file.
 */
function compileWithDeclarations(source) {
	const fileName = path.join(__dirname, 'consumer.ts');
	const options = {
		strict: true,
		declaration: true,
		emitDeclarationOnly: true,
		target: ts.ScriptTarget.ES2017,
		module: ts.ModuleKind.CommonJS,
		moduleResolution: ts.ModuleResolutionKind.NodeJs,
		skipLibCheck: true,
		types: []
	};
	const host = ts.createCompilerHost(options);
	const readFile = host.readFile;
	host.readFile = name => name == fileName ? source : readFile(name);
	host.fileExists = name => name == fileName || ts.sys.fileExists(name);
	let declaration = '';
	host.writeFile = (name, text) => {
		declaration = text;
	};
	const program = ts.createProgram([fileName], options, host);
	const emitted = program.emit();
	return {
		diagnostics: ts.getPreEmitDiagnostics(program).concat(emitted.diagnostics),
		declaration
	};
}

test('declaration-emit', () => {
	// Consumers wrap the functions in generic helpers of their own. Building declaration files for those spells out
	// the helper types of this package, as they are not exported. That must stay possible for chains of every
	// supported length ‒ TypeScript refuses to write out types beyond a certain size ‒ and for a generic tuple of
	// callbacks passed on to apply, and the result must stand on its own, without references into this package.
	const { diagnostics, declaration } = compileWithDeclarations(`
		import { run, runIf, apply } from '..';
		export function wrapRun<T>(value: T) {
			return run(value, value => value);
		}
		export function wrapRunIf<T>(value: T) {
			return runIf(value, value => value);
		}
		export function wrapApply<T>(value: T) {
			return apply(value, () => {});
		}
		export function wrapLongRun<T>(value: T) {
			return run(value, value => value, value => value, value => value, value => value, value => value, value => value, value => value, value => value, value => value, value => value);
		}
		export function wrapLongRunIf<T>(value: T) {
			return runIf(value, value => value, value => value, value => value, value => value, value => value, value => value, value => value, value => value, value => value, value => value);
		}
		declare const value: number;
		export function forwardCallbacks<U extends Array<(value: number) => any>>(...callbacks: U) {
			return apply(value, ...callbacks);
		}
	`);
	expect(diagnostics.map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))).toEqual([]);
	for (const name of ['wrapRun', 'wrapRunIf', 'wrapApply', 'wrapLongRun', 'wrapLongRunIf']) {
		expect(declaration).toMatch(new RegExp(`${name}<T>`));
	}
	expect(declaration).toMatch(/forwardCallbacks<U extends .*>\(\.\.\.callbacks: U\)/);
	expect(declaration).not.toMatch(/import\(/);
});
