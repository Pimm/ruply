/**
 * The types which count as null-ish. Includes `void`, as a function without a return value results in `undefined`.
 */
type Nullish = null | undefined | void;
/**
 * Like `Extract` except that if `T` is a promise, the extraction logic is applied to the type of the values to which
 * the promise resolves instead of to `T` directly.
 *
 * Two things hold here and in every helper below. Any promise-like object (one whose `then` method takes the callbacks
 * a promise's does) counts as a promise, as it does at runtime: a chain which passes through one is typed as a
 * `Promise` from then on. And promises are written with a bare type parameter as their argument (`Promise<A>`, never
 * `Promise<Awaited<R>>`): TypeScript only recognises two promises of the same type as one and the same if they are
 * written that way, and would otherwise produce unions such as `Promise<null> | Promise<null>`.
 */
type ExtractAsynchronous<T, U> = T extends PromiseLike<infer A> ? A extends U ? Promise<A> : never : T extends U ? T : never;
/**
 * `T` without promises which always reject (`Promise<never>`) if `T` or `E` includes other promises: a promise which
 * always rejects adds nothing to a union which is asynchronous anyway, as any promise may reject. Inside a `runIf`
 * chain, a step which is always null-ish and one which always throws both end the chain, and once the chain is
 * asynchronous, both end it as a rejection; the former, though, has already contributed the promise of its null-ish
 * value (in `E`, the exits of the chain), next to which the rejection is redundant. Applied to `runIf` only, whose
 * own design puts the rejection there: one which a callback of `run` or `apply` itself may produce
 * (`number | Promise<never>`) stays next to the other promises of the result, which costs precision but not
 * soundness, and saves a consumer's declaration file spelling the result out three times.
 */
type DropRedundantRejection<T, E = never> = [Extract<T | E, PromiseLike<any>>] extends [PromiseLike<never>] ? T : Exclude<T, Promise<never>>;
/**
 * The states of a chain of callbacks: still synchronous, turned asynchronous, ended because a step never produces a
 * value (a callback which always throws, or a step no value ever reaches), or ended in a rejection: the asynchronous
 * form of that, once the chain has turned asynchronous (a step which never resolves is a rejection from the start). A
 * chain which is only sometimes asynchronous is in a union of states, over which everything below distributes. The
 * states are numbers rather than names, so that the table below is a tuple, which a consumer's declaration file
 * prints on one line where it would spell out an object over many; the aliases keep the names.
 */
type Sync = 0;
type Promised = 1;
type Ended = 2;
type Rejects = 3;
type State = Sync | Promised | Ended | Rejects;
/**
 * The state a chain enters through a single step which produces values of type `A`: a promise which never resolves
 * (`Promise<never>`, the result of an `async` callback which always throws) is a rejection.
 */
type StepState<A> =
	[A] extends [never] ? Ended
	: A extends PromiseLike<infer X> ? ([X] extends [never] ? Rejects : Promised)
	: Sync;
/**
 * The state of a chain in state `S` after a step in state `K`, looked up in a table rather than decided by
 * conditions on `S`, so that `S` is mentioned only once: a consumer's declaration file spells these types out for
 * every step of a chain, and would otherwise grow exponentially with the number of steps. Rows are the chain's state,
 * columns the step's.
 */
type Next<S extends State, K extends State> = [
	//             Sync      Promised  Ended     Rejects   ← the step
	/* Sync     */ [Sync    , Promised, Ended   , Rejects], // synchronous so far: the step decides
	/* Promised */ [Promised, Promised, Rejects , Rejects], // a promise stays a promise; a step which never produces a value rejects it
	/* Ended    */ [Ended   , Ended   , Ended   , Ended  ], // ended: stays ended
	/* Rejects  */ [Rejects , Rejects , Rejects , Rejects], // rejected: stays rejected
][S][K];
/**
 * The state of a chain in state `S` after the steps `U`.
 */
type Fold<U extends Array<unknown>, S extends State> =
	U extends [infer A, ...infer B] ? Fold<B, Next<S, StepState<A>>> : S;
/**
 * The result of a chain in state `S` whose last step produces values of type `R`. `A` is not meant to be passed: it
 * holds the values `R` resolves to, so that the promise is written with a bare type parameter (see
 * `ExtractAsynchronous`).
 */
type Result<S extends State, R, A = Awaited<R>> =
	S extends Promised ? Promise<A>
	: S extends Ended ? never
	: S extends Rejects ? Promise<never>
	: R;
/**
 * The step which stands in for callbacks spread from an array of type `U`: one which produces the return values of the
 * array's callbacks. An empty array (`[]` or `never[]`) contributes a step which produces nothing rather than one which
 * never produces a value.
 */
type ArrayStep<U extends Array<(...a: Array<any>) => any>> = [U[number]] extends [never] ? void : ReturnType<U[number]>;
/**
 * The result of a chain which passes values through the steps `U` and ends with a step which produces values of type
 * `R`: `R` made asynchronous if any step is, `never` if a step never produces a value while the chain is synchronous,
 * a promise which rejects if that happens once it is asynchronous, and `R` itself otherwise.
 */
type Chain<U extends Array<unknown>, R> = Result<Fold<U, Sync>, R>;
/**
 * Like `Chain`, except that a null-ish value ends the chain: it becomes part of the result, and only non-null-ish values
 * are passed on to the next step. The exits of the chain (the null-ish values which end it) and its final result are
 * built separately, each from its own walk over the steps. (A step which is always null-ish ends an asynchronous chain
 * without a rejection next to its promise.)
 */
type ChainUntilNullish<U extends Array<unknown>, R> = NullishExits<U, Sync> | DropRedundantRejection<Result<FoldNullish<U, Sync>, R>, NullishExits<U, Sync>>;
/**
 * The exits of a `runIf` chain in state `S` through the steps `U`: what each step contributes to the result by ending
 * the chain with a null-ish value.
 */
type NullishExits<U extends Array<unknown>, S extends State> =
	U extends [infer A, ...infer B] ? NullishExit<S, A> | NullishExits<B, Next<S, NullishStepState<A>>> : never;
/**
 * Like `Fold`, for a `runIf` chain: the null-ish values a step produces end the chain rather than advance it.
 */
type FoldNullish<U extends Array<unknown>, S extends State> =
	U extends [infer A, ...infer B] ? FoldNullish<B, Next<S, NullishStepState<A>>> : S;
/**
 * The part of the result of a `runIf` chain in state `S` which a step producing values of type `A` contributes: the
 * null-ish values it may produce, which end the chain, as `ExtractAsynchronous<A, Nullish>` finds them; nothing if it
 * cannot produce any.
 */
type NullishExit<S extends State, A> = [ExtractAsynchronous<A, Nullish>] extends [never] ? never : ExitResult<S, ExtractAsynchronous<A, Nullish>>;
/**
 * `Result`, for the exit of a `runIf` chain: a chain which has ended contributes no exit, as its result already is the
 * rejection (or nothing) the exit would be.
 */
type ExitResult<S extends State, R, A = Awaited<R>> =
	S extends Promised ? Promise<A>
	: S extends Sync ? R
	: never;
/**
 * `StepState`, for a step of a `runIf` chain, read straight off the step's values: a step which only produces null-ish
 * values ends the chain, and the null-ish values of one which sometimes does are not what the chain continues with. A
 * promise which always resolves to null-ish values counts as a rejection: it ends the chain either way, and in the
 * result, the rejection is redundant next to the promise of the null-ish value that step contributes, and dropped.
 */
type NullishStepState<A> =
	[Exclude<A, Nullish>] extends [never] ? Ended
	: A extends PromiseLike<infer X> ? ([Exclude<X, Nullish>] extends [never] ? Rejects : Promised)
	: A extends Nullish ? never : Sync;
/**
 * The result of passing values of type `T` through the steps `U` and then returning those values themselves rather
 * than the result of the last step. `T` is not a step: if it is a promise, the steps run once it resolves, so the only
 * effect they can have on it is that one which never produces a value turns it into a promise which rejects. Otherwise
 * the steps make `T` asynchronous as they would any result.
 */
type ChainReturningValue<U extends Array<unknown>, T> = ChainReturningValueIn<Fold<U, Sync>, T>;
type ChainReturningValueIn<S extends State, T> =
	T extends PromiseLike<any> ? (S extends Ended | Rejects ? Promise<never> : T) : Result<S, T>;
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
declare function run<T, R, C>(this: C, value: T, callback: (this: C, value: Awaited<T>) => R):
	Chain<[T], R>;
declare function run<T, Z, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Awaited<T>) => Z, (this: C, value: Awaited<Z>) => R]):
	Chain<[T, Z], R>;
declare function run<T, Z, Y, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Awaited<T>) => Z, (this: C, value: Awaited<Z>) => Y, (this: C, value: Awaited<Y>) => R]):
	Chain<[T, Z, Y], R>;
declare function run<T, Z, Y, X, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Awaited<T>) => Z, (this: C, value: Awaited<Z>) => Y, (this: C, value: Awaited<Y>) => X, (this: C, value: Awaited<X>) => R]):
	Chain<[T, Z, Y, X], R>;
declare function run<T, Z, Y, X, W, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Awaited<T>) => Z, (this: C, value: Awaited<Z>) => Y, (this: C, value: Awaited<Y>) => X, (this: C, value: Awaited<X>) => W, (this: C, value: Awaited<W>) => R]):
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
declare function runIf<T, R, C>(this: C, value: T, callback: (this: C, value: Exclude<Awaited<T>, Nullish>) => R):
	ChainUntilNullish<[T], R>;
declare function runIf<T, Z, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Exclude<Awaited<T>, Nullish>) => Z, (this: C, value: Exclude<Awaited<Z>, Nullish>) => R]):
	ChainUntilNullish<[T, Z], R>;
declare function runIf<T, Z, Y, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Exclude<Awaited<T>, Nullish>) => Z, (this: C, value: Exclude<Awaited<Z>, Nullish>) => Y, (this: C, value: Exclude<Awaited<Y>, Nullish>) => R]):
	ChainUntilNullish<[T, Z, Y], R>;
declare function runIf<T, Z, Y, X, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Exclude<Awaited<T>, Nullish>) => Z, (this: C, value: Exclude<Awaited<Z>, Nullish>) => Y, (this: C, value: Exclude<Awaited<Y>, Nullish>) => X, (this: C, value: Exclude<Awaited<X>, Nullish>) => R]):
	ChainUntilNullish<[T, Z, Y, X], R>;
declare function runIf<T, Z, Y, X, W, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Exclude<Awaited<T>, Nullish>) => Z, (this: C, value: Exclude<Awaited<Z>, Nullish>) => Y, (this: C, value: Exclude<Awaited<Y>, Nullish>) => X, (this: C, value: Exclude<Awaited<X>, Nullish>) => W, (this: C, value: Exclude<Awaited<W>, Nullish>) => R]):
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
declare function apply<T, Z, C>(this: C, value: T, callback: (this: C, value: Awaited<T>) => Z):
	ChainReturningValue<[Z], T>;
declare function apply<T, Z, Y, C>(this: C, value: T, ...callbacks: [(this: C, value: Awaited<T>) => Z, (this: C, value: Awaited<T>) => Y]):
	ChainReturningValue<[Z, Y], T>;
declare function apply<T, Z, Y, X, C>(this: C, value: T, ...callbacks: [(this: C, value: Awaited<T>) => Z, (this: C, value: Awaited<T>) => Y, (this: C, value: Awaited<T>) => X]):
	ChainReturningValue<[Z, Y, X], T>;
declare function apply<T, Z, Y, X, W, C>(this: C, value: T, ...callbacks: [(this: C, value: Awaited<T>) => Z, (this: C, value: Awaited<T>) => Y, (this: C, value: Awaited<T>) => X, (this: C, value: Awaited<T>) => W]):
	ChainReturningValue<[Z, Y, X, W], T>;
declare function apply<T, Z, Y, X, W, V, C>(this: C, value: T, ...callbacks: [(this: C, value: Awaited<T>) => Z, (this: C, value: Awaited<T>) => Y, (this: C, value: Awaited<T>) => X, (this: C, value: Awaited<T>) => W, (this: C, value: Awaited<T>) => V]):
	ChainReturningValue<[Z, Y, X, W, V], T>;
// ↓ Callbacks spread from an array, possibly around fixed callbacks. The spread array is typed as a whole and its
// element type stands in for every step it contributes, so that an array holding callbacks of several types (two
// spread arrays, say) counts as possibly asynchronous. Only one fixed callback on either side of the spread is told
// apart; further fixed callbacks are absorbed into the array, which costs precision but not soundness. (The fixed
// callback before a spread is a parameter of its own rather than part of the tuple, so that a generic array forwarded
// after it keeps its type instead of being inferred from its constraint.)
declare function apply<T, Z, U extends Array<(this: C, value: Awaited<T>) => any>, X, C>(this: C, value: T, ...callbacks: [(this: C, value: Awaited<T>) => Z, ...U, (this: C, value: Awaited<T>) => X]):
	ChainReturningValue<[Z, ArrayStep<U>, X], T>;
declare function apply<T, Z, U extends Array<(this: C, value: Awaited<T>) => any>, C>(this: C, value: T, callback: (this: C, value: Awaited<T>) => Z, ...callbacks: U):
	ChainReturningValue<[Z, ArrayStep<U>], T>;
declare function apply<T, U extends Array<(this: C, value: Awaited<T>) => any>, Y, C>(this: C, value: T, ...callbacks: [...U, (this: C, value: Awaited<T>) => Y]):
	ChainReturningValue<[ArrayStep<U>, Y], T>;
declare function apply<T, U extends Array<(this: C, value: Awaited<T>) => any>, C>(this: C, value: T, ...callbacks: U):
	ChainReturningValue<[ArrayStep<U>], T>;

export {
	run, runIf,
	apply
};