type Nullish = null | undefined;
type Resolve<T> = T extends Promise<infer A> ? A : T;
type ExtractResolved<T, U> = T extends Promise<infer A> ? A extends U ? Promise<A> : never : never;
type Swap1<T, B> = T extends Promise<any> ? Promise<Resolve<B>> : B;
type Swap2<T, U, B> = T extends Promise<any> ? Promise<Resolve<B>> : U extends Promise<any> ? Promise<Resolve<B>> : B;
type Swap3<T, U, V, B> = T extends Promise<any> ? Promise<Resolve<B>> : U extends Promise<any> ? Promise<Resolve<B>> : V extends Promise<any> ? Promise<Resolve<B>> : B;
/**
 * Calls the passed callback, forwarding the value and routing back whatever is returned.
 */
declare function run<T, R, C>(this: C, value: T, callback: (this: C, value: Resolve<T>) => R): Swap1<T, R>;
declare function run<T, A, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => A, (this: C, value: Resolve<A>) => R]): Swap2<T, A, R>;
declare function run<T, A, B, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => A, (this: C, value: Resolve<A>) => B, (this: C, value: Resolve<B>) => R]): Swap3<T, A, B, R>;
/**
 * Calls the passed callback ‒ forwarding the value and routing back whatever is returned ‒ if the passed value is not
 * null-ish. If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
declare function runIf<T, R, C>(this: C, value: T, callback: (this: C, value: Exclude<Resolve<T>, Nullish>) => R): Swap1<Exclude<T, Nullish>, R> | Extract<T, Nullish> | ExtractResolved<T, Nullish>;
declare function runIf<T, A, R, C>(this: C, value: T, ...callback: [(this: C, value: Exclude<Resolve<T>, Nullish>) => A, (this: C, value: Exclude<Resolve<A>, Nullish>) => R]): Swap2<Exclude<T, Nullish>, A, R> | Extract<T, Nullish> | ExtractResolved<T, Nullish>;
declare function runIf<T, A, B, R, C>(this: C, value: T, ...callback: [(this: C, value: Exclude<Resolve<T>, Nullish>) => A, (this: C, value: Exclude<Resolve<A>, Nullish>) => B, (this: C, value: Exclude<Resolve<B>, Nullish>) => R]): Swap3<Exclude<T, Nullish>, A, B, R> | Extract<T, Nullish> | ExtractResolved<T, Nullish>;
/**
 * Calls the passed callback, forwarding the value and returning it afterwards.
 */
declare function apply<T, R, C>(this: C, value: T, callback: (this: C, value: Resolve<T>) => R): Swap1<R, T>;
declare function apply<T, A, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => A, (this: C, value: Resolve<T>) => R]): Swap2<A, R, T>;
declare function apply<T, A, B, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Resolve<T>) => A, (this: C, value: Resolve<T>) => B, (this: C, value: Resolve<T>) => R]): Swap3<A, B, R, T>;
/**
 * Calls the passed callback ‒ forwarding the value and returning it afterwards ‒ if the passed value is not null-ish.
 * If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
declare function applyIf<T, R, C>(this: C, value: T, callback: (this: C, value: Exclude<Resolve<T>, Nullish>) => R): Swap1<R, Exclude<T, Nullish>> | Extract<T, Nullish>;
declare function applyIf<T, A, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Exclude<Resolve<T>, Nullish>) => A, (this: C, value: Exclude<Resolve<T>, Nullish>) => R]): Swap2<A, R, Exclude<T, Nullish>> | Extract<T, Nullish>;
declare function applyIf<T, A, B, R, C>(this: C, value: T, ...callbacks: [(this: C, value: Exclude<Resolve<T>, Nullish>) => A, (this: C, value: Exclude<Resolve<T>, Nullish>) => B, (this: C, value: Exclude<Resolve<T>, Nullish>) => R]): Swap3<A, B, R, Exclude<T, Nullish>> | Extract<T, Nullish>;

export {
	run, runIf,
	apply, applyIf
};