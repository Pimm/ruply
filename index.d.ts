type Nullish = null | undefined;
/**
 * If `T` is a `Promise`, the type of the values to which the promise resolves. Otherwise `T` itself.
 */
type Resolve<T> = T extends Promise<infer A> ? A : T;
/**
 * Like `Exclude` except that if `T` is a `Promise`, the exclusion logic is applied to the type of the values to which
 * the promise resolves instead of to `T` directly.
 */
type ExcludeAsynchronous<T, U> = T extends Promise<infer A> ? A extends U ? never : Promise<A> : T extends U ? never : T;
/**
 * Like `Extract` except that if `T` is a `Promise`, the extraction logic is applied to the type of the values to which
 * the promise resolves instead of to `T` directly.
 */
type ExtractAsynchronous<T, U> = T extends Promise<infer A> ? A extends U ? Promise<A> : never : T extends U ? T : never;
/**
 * If `T` is a `Promise` and `U` is not a `Promise`, a `Promise` which resolves to values of type `U`. Otherwise `U`
 * itself.
 */
type TransferAsynchronicity<U, T> = T extends Promise<any> ? T : U extends Promise<any> ? Promise<T> : T;
/**
 * Calls the passed callback, forwarding the first argument and routing back whatever is returned.
 *
 * This is a simplified implementation of `run`:
 * ```
 * function run(value, callback) {
 *   return callback(value);
 * }
 * ```
 *
 * #### Promises
 *
 * If the first argument is a promise, the value to which that promise resolves is forwarded to the passed callback
 * instead of the promise itself. As a result, the call to the passed callback is delayed until the promise resolves.
 * If the promise rejects, the passed callback is skipped.
 *
 * #### Chains
 *
 * If multiple callbacks are passed, they are called subsequently. `run(x, a, b)` is equivalent to `run(run(x, a), b)`.
 */
declare function run<T, R, C>(this: C, value: T, callback: (this: C, value: Resolve<T>) => R):
	TransferAsynchronicity<T, R>;
declare function run<T, Z, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => Z, (this: C, value: Resolve<Z>) => R]):
	TransferAsynchronicity<T & Z, R>;
declare function run<T, Z, Y, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => Z, (this: C, value: Resolve<Z>) => Y, (this: C, value: Resolve<Y>) => R]):
	TransferAsynchronicity<T & Z & Y, R>;
declare function run<T, Z, Y, X, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => Z, (this: C, value: Resolve<Z>) => Y, (this: C, value: Resolve<Y>) => X, (this: C, value: Resolve<X>) => R]):
	TransferAsynchronicity<T & Z & Y & X, R>;
declare function run<T, Z, Y, X, W, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => Z, (this: C, value: Resolve<Z>) => Y, (this: C, value: Resolve<Y>) => X, (this: C, value: Resolve<X>) => W, (this: C, value: Resolve<W>) => R]):
	TransferAsynchronicity<T & Z & Y & X & W, R>;
/**
 * Calls the passed callback ‒ forwarding the argument and routing back whatever is returned ‒ if the first argument is
 * not null-ish. If the first argument is null-ish, it is returned directly and the passed callback is skipped.
 *
 * This is a simplified implementation of `runIf`:
 * ```
 * function runIf(value, callback) {
 *   return value != null ? callback(value) : value;
 * }
 * ```
 *
 * #### Promises
 *
 * If the first argument is a promise, the value to which that promise resolves is forwarded to the passed callback
 * instead of the promise itself. As a result, the call to the passed callback is delayed until the promise resolves.
 * If the value to which the promise resolves is null-ish or the promise rejects, the passed callback is skipped.
 *
 * #### Chains
 *
 * If multiple callbacks are passed, they are called subsequently—respecting the logic regarding null-ish values.
 * `runIf(x, a, b)` is equivalent to `runIf(runIf(x, a), b)`
 */
declare function runIf<T, R, C>(this: C, value: T, callback: (this: C, value: Exclude<Resolve<T>, Nullish>) => R):
	  ExtractAsynchronous<T, Nullish>
	| TransferAsynchronicity<ExcludeAsynchronous<T, Nullish>, R>;
declare function runIf<T, Z, R, C>(this: C, value: T, ...callback: [(this: C, value: Exclude<Resolve<T>, Nullish>) => Z, (this: C, value: Exclude<Resolve<Z>, Nullish>) => R]):
	  ExtractAsynchronous<T, Nullish>
	| TransferAsynchronicity<ExcludeAsynchronous<T, Nullish>, ExtractAsynchronous<Z, Nullish>>
	| TransferAsynchronicity<ExcludeAsynchronous<T & Z, Nullish>, R>;
declare function runIf<T, Z, Y, R, C>(this: C, value: T, ...callback: [(this: C, value: Exclude<Resolve<T>, Nullish>) => Z, (this: C, value: Exclude<Resolve<Z>, Nullish>) => Y, (this: C, value: Exclude<Resolve<Y>, Nullish>) => R]):
	  ExtractAsynchronous<T, Nullish>
	| TransferAsynchronicity<ExcludeAsynchronous<T, Nullish>, ExtractAsynchronous<Z, Nullish>>
	| TransferAsynchronicity<ExcludeAsynchronous<T & Z, Nullish>, ExtractAsynchronous<Y, Nullish>>
	| TransferAsynchronicity<ExcludeAsynchronous<T & Z & Y, Nullish>, R>;
declare function runIf<T, Z, Y, X, R, C>(this: C, value: T, ...callback: [(this: C, value: Exclude<Resolve<T>, Nullish>) => Z, (this: C, value: Exclude<Resolve<Z>, Nullish>) => Y, (this: C, value: Exclude<Resolve<Y>, Nullish>) => X, (this: C, value: Exclude<Resolve<X>, Nullish>) => R]):
	  ExtractAsynchronous<T, Nullish>
	| TransferAsynchronicity<ExcludeAsynchronous<T, Nullish>, ExtractAsynchronous<Z, Nullish>>
	| TransferAsynchronicity<ExcludeAsynchronous<T & Z, Nullish>, ExtractAsynchronous<Y, Nullish>>
	| TransferAsynchronicity<ExcludeAsynchronous<T & Z & Y, Nullish>, ExtractAsynchronous<X, Nullish>>
	| TransferAsynchronicity<ExcludeAsynchronous<T & Z & Y & X, Nullish>, R>;
declare function runIf<T, Z, Y, X, W, R, C>(this: C, value: T, ...callback: [(this: C, value: Exclude<Resolve<T>, Nullish>) => Z, (this: C, value: Exclude<Resolve<Z>, Nullish>) => Y, (this: C, value: Exclude<Resolve<Y>, Nullish>) => X, (this: C, value: Exclude<Resolve<X>, Nullish>) => W, (this: C, value: Exclude<Resolve<W>, Nullish>) => R]):
	  ExtractAsynchronous<T, Nullish>
	| TransferAsynchronicity<ExcludeAsynchronous<T, Nullish>, ExtractAsynchronous<Z, Nullish>>
	| TransferAsynchronicity<ExcludeAsynchronous<T & Z, Nullish>, ExtractAsynchronous<Y, Nullish>>
	| TransferAsynchronicity<ExcludeAsynchronous<T & Z & Y, Nullish>, ExtractAsynchronous<X, Nullish>>
	| TransferAsynchronicity<ExcludeAsynchronous<T & Z & Y & X, Nullish>, ExtractAsynchronous<W, Nullish>>
	| TransferAsynchronicity<ExcludeAsynchronous<T & Z & Y & X & W, Nullish>, R>;
/**
 * Calls the passed callback, forwarding the first argument and returning that argument afterwards.
 *
 * This is a simplified implementation of `apply`:
 * ```
 * function apply(value, callback) {
 *   callback(value);
 *   return value;
 * }
 * ```
 * #### Promises
 *
 * If the first argument is a promise, the value to which that promise resolves is forwarded to the passed callback
 * instead of the promise itself. As a result, the call to the passed callback is delayed until the promise resolves.
 * If the promise rejects, the passed callback is skipped.
 *
 * #### Chains
 *
 * If multiple callbacks are passed, they are called subsequently. `apply(x, a, b)` is equivalent to
 * `apply(apply(x, a), b)`.
 */
declare function apply<T, Z, C>(this: C, value: T, ...callbacks: Array<(this: C, value: Resolve<T>) => Z>):
	TransferAsynchronicity<Z, T>;
declare function apply<T, Z, Y, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => Z, (this: C, value: Resolve<T>) => Y]):
	TransferAsynchronicity<Z & Y, T>;
declare function apply<T, Z, Y, X, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => Z, (this: C, value: Resolve<T>) => Y, (this: C, value: Resolve<T>) => X]):
	TransferAsynchronicity<Z & Y & X, T>;
declare function apply<T, Z, Y, X, W, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => Z, (this: C, value: Resolve<T>) => Y, (this: C, value: Resolve<T>) => X, (this: C, value: Resolve<T>) => W]):
	TransferAsynchronicity<Z & Y & X & W, T>;
declare function apply<T, Z, Y, X, W, V, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => Z, (this: C, value: Resolve<T>) => Y, (this: C, value: Resolve<T>) => X, (this: C, value: Resolve<T>) => W, (this: C, value: Resolve<T>) => V]):
	TransferAsynchronicity<Z & Y & X & W & V, T>;

export {
	run, runIf,
	apply
};