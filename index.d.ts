type Nullish = null | undefined;
type Resolve<T> = T extends Promise<infer A> ? A : T;
type ExcludeAsynchronous<T, U> = T extends Promise<infer A> ? A extends U ? never : Promise<A> : T extends U ? never : T;
type ExtractAsynchronous<T, U> = T extends Promise<infer A> ? A extends U ? Promise<A> : never : T extends U ? T : never;
type TransferAsynchronicity<X, T> = T extends Promise<any> ? T : X extends Promise<any> ? Promise<T> : T;
/**
 * Calls the passed callback, forwarding the value and routing back whatever is returned.
 */
declare function run<T, R, C>(this: C, value: T, callback: (this: C, value: Resolve<T>) => R):
	TransferAsynchronicity<T, R>;
declare function run<T, A, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => A, (this: C, value: Resolve<A>) => R]):
	TransferAsynchronicity<T & A, R>;
declare function run<T, A, B, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => A, (this: C, value: Resolve<A>) => B, (this: C, value: Resolve<B>) => R]):
	TransferAsynchronicity<T & A & B, R>;
/**
 * Calls the passed callback ‒ forwarding the value and routing back whatever is returned ‒ if the passed value is not
 * null-ish. If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
declare function runIf<T, R, C>(this: C, value: T, callback: (this: C, value: Exclude<Resolve<T>, Nullish>) => R):
	ExtractAsynchronous<T, Nullish>
	| TransferAsynchronicity<ExcludeAsynchronous<T, Nullish>, R>;
declare function runIf<T, A, R, C>(this: C, value: T, ...callback: [(this: C, value: Exclude<Resolve<T>, Nullish>) => A, (this: C, value: Exclude<Resolve<A>, Nullish>) => R]):
	ExtractAsynchronous<T, Nullish>
	| TransferAsynchronicity<ExcludeAsynchronous<T, Nullish>, ExtractAsynchronous<A, Nullish>>
	| TransferAsynchronicity<ExcludeAsynchronous<T & A, Nullish>, R>;
declare function runIf<T, A, B, R, C>(this: C, value: T, ...callback: [(this: C, value: Exclude<Resolve<T>, Nullish>) => A, (this: C, value: Exclude<Resolve<A>, Nullish>) => B, (this: C, value: Exclude<Resolve<B>, Nullish>) => R]):
	ExtractAsynchronous<T, Nullish>
	| TransferAsynchronicity<ExcludeAsynchronous<T, Nullish>, ExtractAsynchronous<A, Nullish>>
	| TransferAsynchronicity<ExcludeAsynchronous<T & A, Nullish>, ExtractAsynchronous<B, Nullish>>
	| TransferAsynchronicity<ExcludeAsynchronous<T & A & B, Nullish>, R>;
/**
 * Calls the passed callback, forwarding the value and returning it afterwards.
 */
declare function apply<T, R, C>(this: C, value: T, callback: (this: C, value: Resolve<T>) => R):
	TransferAsynchronicity<R, T>;
declare function apply<T, A, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => A, (this: C, value: Resolve<T>) => R]):
	TransferAsynchronicity<A & R, T>;
declare function apply<T, A, B, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => A, (this: C, value: Resolve<T>) => B, (this: C, value: Resolve<T>) => R]):
	TransferAsynchronicity<A & B & R, T>;

export {
	run, runIf,
	apply
};