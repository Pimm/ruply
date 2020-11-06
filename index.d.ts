type Nullish = null | undefined;
type Resolve<T> = T extends Promise<infer A> ? A : T;
type Swap<T, B> = T extends Promise<any> ? Promise<B> : B;
/**
 * Calls the passed callback ‒ forwarding the value and routing back whatever is returned ‒ if the passed value is not
 * null-ish. If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
declare function run<T, R, C>(this: C, value: T, callback: (this: C, value: Exclude<Resolve<T>, Nullish>) => R | Swap<T, R>, nullBehavior?: false): Swap<T, R | Extract<Resolve<T>, Nullish>>;
/**
 * Calls the passed callback, forwarding the value and routing back whatever is returned.
 */
declare function run<T, R, C>(this: C, value: T, callback: (this: C, value: Resolve<T>) => R | Swap<T, R>, nullBehavior: true): Swap<T, R>;
/**
 * Calls either the passed callback or the passed alternative ‒ depending on whether the passed value is null-ish or
 * not ‒ forwarding said value and routing back whatever is returned.
 */
declare function run<T, R, S, C>(this: C, value: T, callback: (this: C, value: Exclude<Resolve<T>, Nullish>) => R | Swap<T, R>, nullBehavior: (this: C, value: Extract<Resolve<T>, Nullish>) => S | Swap<T, S>): Swap<T, R | S>;
/**
 * Calls the passed callback ‒ forwarding the value and returning it afterwards ‒ if the passed value is not null-ish.
 * If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
declare function apply<T, C>(this: C, value: T, callback: (this: C, value: Exclude<Resolve<T>, Nullish>) => any, nullBehavior?: false): T;
/**
 * Calls the passed callback, forwarding the value and returning it afterwards.
 */
declare function apply<T, C>(this: C, value: T, callback: (this: C, value: Resolve<T>) => any, nullBehavior: true): T;
/**
 * Calls either the passed callback or the passed alternative ‒ depending on whether the passed value is null-ish or
 * not ‒ forwarding the value and returning it afterwards.
 */
declare function apply<T, C>(this: C, value: T, callback: (this: C, value: Exclude<Resolve<T>, Nullish>) => any, nullBehavior: (this: C, value: Extract<Resolve<T>, Nullish>) => any): T;

export {
	run,
	apply
};