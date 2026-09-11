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
 * The type which results from passing values of type `U` on to a step which results in `T`:
 * - If `U` is `Thrown`, `Thrown`: the step is never taken.
 * - If `U` is `never` (there is no value from which the step is taken), `never`.
 * - If `U` is a `Promise`, `T` made asynchronous: `Promise<never>` if `T` is `Thrown` (the promise rejects), `T` itself
 *   if `T` is a `Promise`, and a `Promise` which resolves to values of type `T` otherwise.
 * - Otherwise `T` itself.
 */
type TransferAsynchronicity<U, T> =
	U extends Thrown ? Thrown
	: U extends Promise<any> ? T extends Thrown ? Promise<never> : T extends Promise<any> ? T : Promise<T>
	: T;
/**
 * Stands in for the result of a callback which always throws, so it can be told apart from other occurrences of
 * `never` (such as a value which can never be reached). Never part of a resulting type.
 */
declare class Thrown {
	private readonly thrown: never;
}
/**
 * `Thrown` if `T` is `never`. Otherwise `T` itself.
 */
type MarkThrown<T> = [T] extends [never] ? Thrown : T;
/**
 * `T` without `Thrown`.
 */
type UnmarkThrown<T> = Exclude<T, Thrown>;
/**
 * `T` without `Promise<never>` if `T` includes other promises: a promise which always rejects adds nothing to a union
 * which is asynchronous anyway.
 */
type DropRedundantRejection<T> =
	[Extract<Exclude<T, Promise<never>>, Promise<any>>] extends [never] ? T : Exclude<T, Promise<never>>;
/**
 * The type which results from passing values through the steps `U` on to a final step which results in `T`. If `U`
 * is an array rather than a tuple (callbacks spread from an array), its element type stands in for every step.
 */
type Chain<U extends Array<unknown>, T> = DropRedundantRejection<UnmarkThrown<ChainSteps<U, T>>>;
type ChainSteps<U extends Array<unknown>, T> =
	U extends [infer A, ...infer B] ? TransferAsynchronicity<MarkThrown<A>, ChainSteps<B, T>>
	: U extends [] ? MarkThrown<T>
	: U extends Array<infer A> ? TransferAsynchronicity<MarkThrown<A>, MarkThrown<T>>
	: MarkThrown<T>;
/**
 * Like `Chain`, except that a null-ish value ends the chain: it becomes part of the result, and only non-null-ish values
 * are passed on to the next step.
 */
type ChainUntilNullish<U extends Array<unknown>, T> = DropRedundantRejection<UnmarkThrown<ChainUntilNullishSteps<U, T>>>;
type ChainUntilNullishSteps<U extends Array<unknown>, T> =
	U extends [infer A, ...infer B]
		? ExtractAsynchronous<A, Nullish> | TransferAsynchronicity<ExcludeAsynchronous<MarkThrown<A>, Nullish>, ChainUntilNullishSteps<B, T>>
		: MarkThrown<T>;
/**
 * The type which results from passing values of type `T` through the steps `U` and then returning those values
 * themselves rather than the result of the last step. `T` is not a step: if it is a promise, the steps run once it
 * resolves, so the only effect they can have on it is that one which throws turns it into a promise which rejects.
 * Otherwise the steps make `T` asynchronous as they would any result.
 */
type ChainReturningValue<U extends Array<unknown>, T> =
	T extends Promise<any>
		? [Extract<MarkThrownEach<U>[number], Thrown>] extends [never] ? T : Promise<never>
		: Chain<U, T>;
type MarkThrownEach<U extends Array<unknown>> = { [K in keyof U]: MarkThrown<U[K]> };
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
	Chain<[T], R>;
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
	ChainReturningValue<[Z], T>;
// ↑ This overload is not strictly necessary. The one below is a generalised form of it.
declare function apply<T, U extends Array<(this: C, value: Resolve<T>) => any>, C>(this: C, value: T, ...callbacks: U):
	ChainReturningValue<ReturnTypes<U>, T>;

export {
	run, runIf,
	apply
};