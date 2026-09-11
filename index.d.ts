type Nullish = null | undefined;
/**
 * If `T` is a tuple of functions, a tuple of the return types of those functions.
 */
type ReturnTypes<T extends Array<(...a: Array<any>) => any>> = { [K in keyof T]: T[K] extends (...a: Array<any>) => infer R ? R : never };
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
 * If `U` is a `Promise` and `T` is not a `Promise`, a `Promise` which resolves to values of type `T`. If `U` is
 * `never` (there is no value from which `T` could be reached), `never`. Otherwise `T` itself.
 */
type TransferAsynchronicity<U, T> = U extends Promise<any> ? T extends Promise<any> ? T : Promise<T> : T;
/**
 * `TransferAsynchronicity` applied for every type in the tuple `U`: if any type in `U` is a `Promise` and `T` is not a
 * `Promise`, a `Promise` which resolves to values of type `T`. If any type in `U` is `never`, `never`. Otherwise `T`
 * itself. If `U` is an array rather than a tuple (callbacks spread from an array), its element type stands in for every
 * step.
 */
type Chain<U extends Array<unknown>, T> =
	U extends [infer A, ...infer B] ? TransferAsynchronicity<A, Chain<B, T>>
	: U extends [] ? T
	: U extends Array<infer A> ? TransferAsynchronicity<A, T>
	: T;
/**
 * Like `Chain`, except that a null-ish value ends the chain: it becomes part of the result, and only non-null-ish values
 * are passed on to the next step.
 */
type ChainUntilNullish<U extends Array<unknown>, T> =
	U extends [infer A, ...infer B]
		? ExtractAsynchronous<A, Nullish> | TransferAsynchronicity<ExcludeAsynchronous<A, Nullish>, ChainUntilNullish<B, T>>
		: T;
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
	Chain<[T, Z], R>;
declare function run<T, Z, Y, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => Z, (this: C, value: Resolve<Z>) => Y, (this: C, value: Resolve<Y>) => R]):
	Chain<[T, Z, Y], R>;
declare function run<T, Z, Y, X, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => Z, (this: C, value: Resolve<Z>) => Y, (this: C, value: Resolve<Y>) => X, (this: C, value: Resolve<X>) => R]):
	Chain<[T, Z, Y, X], R>;
declare function run<T, Z, Y, X, W, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => Z, (this: C, value: Resolve<Z>) => Y, (this: C, value: Resolve<Y>) => X, (this: C, value: Resolve<X>) => W, (this: C, value: Resolve<W>) => R]):
	Chain<[T, Z, Y, X, W], R>;
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
	ChainUntilNullish<[T], R>;
declare function runIf<T, Z, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Exclude<Resolve<T>, Nullish>) => Z, (this: C, value: Exclude<Resolve<Z>, Nullish>) => R]):
	ChainUntilNullish<[T, Z], R>;
declare function runIf<T, Z, Y, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Exclude<Resolve<T>, Nullish>) => Z, (this: C, value: Exclude<Resolve<Z>, Nullish>) => Y, (this: C, value: Exclude<Resolve<Y>, Nullish>) => R]):
	ChainUntilNullish<[T, Z, Y], R>;
declare function runIf<T, Z, Y, X, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Exclude<Resolve<T>, Nullish>) => Z, (this: C, value: Exclude<Resolve<Z>, Nullish>) => Y, (this: C, value: Exclude<Resolve<Y>, Nullish>) => X, (this: C, value: Exclude<Resolve<X>, Nullish>) => R]):
	ChainUntilNullish<[T, Z, Y, X], R>;
declare function runIf<T, Z, Y, X, W, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Exclude<Resolve<T>, Nullish>) => Z, (this: C, value: Exclude<Resolve<Z>, Nullish>) => Y, (this: C, value: Exclude<Resolve<Y>, Nullish>) => X, (this: C, value: Exclude<Resolve<X>, Nullish>) => W, (this: C, value: Exclude<Resolve<W>, Nullish>) => R]):
	ChainUntilNullish<[T, Z, Y, X, W], R>;
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
declare function apply<T, Z, C>(this: C, value: T, callback: (this: C, value: Resolve<T>) => Z):
	TransferAsynchronicity<Z, T>;
// ↑ This overload is not strictly necessary. The one below is a generalised form of it.
declare function apply<T, U extends Array<(this: C, value: Resolve<T>) => any>, C>(this: C, value: T, ...callbacks: U):
	Chain<ReturnTypes<U>, T>;

export {
	run, runIf,
	apply
};