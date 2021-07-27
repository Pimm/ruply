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
 * Calls the passed callback, forwarding the value and routing back whatever is returned.
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
 * Calls the passed callback ‒ forwarding the value and routing back whatever is returned ‒ if the passed value is not
 * null-ish. If the passed value is null-ish, it is returned directly and the passed callback is skipped.
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
 * Calls the passed callback, forwarding the value and returning it afterwards.
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