type Nullish = null | undefined;
type Resolve<T> = T extends Promise<infer A> ? A : T;
type Promisify<T> = T extends Promise<any> ? T : Promise<T>;
type IfPromise<X, T, F> = X extends Promise<any> ? T : F;
type ExcludeResolved<T, U> = T extends Promise<infer A> ? A extends U ? never : Promise<A> : T;
type ExtractResolved<T, U> = T extends Promise<infer A> ? A extends U ? Promise<A> : never : never;
type Ever<T> = T extends Promise<never> ? never : T;
/**
 * Calls the passed callback, forwarding the value and routing back whatever is returned.
 */
declare function run<T, R, C>(this: C, value: T, callback: (this: C, value: Resolve<T>) => R):
	IfPromise<T, Promisify<R>, R>;
declare function run<T, A, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => A, (this: C, value: Resolve<A>) => R]):
	IfPromise<T & A, Promisify<R>, R>;
declare function run<T, A, B, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => A, (this: C, value: Resolve<A>) => B, (this: C, value: Resolve<B>) => R]):
	IfPromise<T & A & B, Promisify<R>, R>;
/**
 * Calls the passed callback ‒ forwarding the value and routing back whatever is returned ‒ if the passed value is not
 * null-ish. If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
declare function runIf<T, R, C>(this: C, value: T, callback: (this: C, value: Exclude<Resolve<T>, Nullish>) => R):
	Extract<T, Nullish> | ExtractResolved<T, Nullish>
	| IfPromise<ExcludeResolved<Exclude<T, Nullish>, Nullish>, Promisify<R>, R>;
declare function runIf<T, A, R, C>(this: C, value: T, ...callback: [(this: C, value: Exclude<Resolve<T>, Nullish>) => A, (this: C, value: Exclude<Resolve<A>, Nullish>) => R]):
	Extract<T, Nullish> | ExtractResolved<T, Nullish>
	| IfPromise<ExcludeResolved<Exclude<T, Nullish>, Nullish>, Ever<Promise<Extract<A, Nullish>>>, Extract<A, Nullish>> | ExtractResolved<A, Nullish>
	| IfPromise<ExcludeResolved<Exclude<T & A, Nullish>, Nullish>, Promisify<R>, R>;
declare function runIf<T, A, B, R, C>(this: C, value: T, ...callback: [(this: C, value: Exclude<Resolve<T>, Nullish>) => A, (this: C, value: Exclude<Resolve<A>, Nullish>) => B, (this: C, value: Exclude<Resolve<B>, Nullish>) => R]):
	Extract<T, Nullish> | ExtractResolved<T, Nullish>
	| IfPromise<ExcludeResolved<Exclude<T, Nullish>, Nullish>, Ever<Promise<Extract<A, Nullish>>>, Extract<A, Nullish>> | ExtractResolved<A, Nullish>
	| IfPromise<ExcludeResolved<Exclude<T & A, Nullish>, Nullish>, Ever<Promise<Extract<B, Nullish>>>, Extract<B, Nullish>> | ExtractResolved<B, Nullish>
	| IfPromise<ExcludeResolved<Exclude<T & A & B, Nullish>, Nullish>, Promisify<R>, R>;
/**
 * Calls the passed callback, forwarding the value and returning it afterwards.
 */
declare function apply<T, R, C>(this: C, value: T, callback: (this: C, value: Resolve<T>) => R):
	IfPromise<R, Promisify<T>, T>;
declare function apply<T, A, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => A, (this: C, value: Resolve<T>) => R]):
	IfPromise<A & R, Promisify<T>, T>;
declare function apply<T, A, B, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => A, (this: C, value: Resolve<T>) => B, (this: C, value: Resolve<T>) => R]):
	IfPromise<A & B & R, Promisify<T>, T>;
/**
 * Calls the passed callback ‒ forwarding the value and returning it afterwards ‒ if the passed value is not null-ish.
 * If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
declare function applyIf<T, R, C>(this: C, value: T, callback: (this: C, value: Exclude<Resolve<T>, Nullish>) => R):
	Extract<T, Nullish> | IfPromise<R, Promisify<Exclude<T, Nullish>>, Exclude<T, Nullish>>;
declare function applyIf<T, A, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Exclude<Resolve<T>, Nullish>) => A, (this: C, value: Exclude<Resolve<T>, Nullish>) => R]):
	Extract<T, Nullish> | IfPromise<A & R, Promisify<Exclude<T, Nullish>>, Exclude<T, Nullish>>;
declare function applyIf<T, A, B, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Exclude<Resolve<T>, Nullish>) => A, (this: C, value: Exclude<Resolve<T>, Nullish>) => B, (this: C, value: Exclude<Resolve<T>, Nullish>) => R]):
	Extract<T, Nullish> | IfPromise<A & B & R, Promisify<Exclude<T, Nullish>>, Exclude<T, Nullish>>;

export {
	run, runIf,
	apply, applyIf
};