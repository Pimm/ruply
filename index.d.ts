type Nullish = null | undefined;
/**
 * Calls the passed callback ‒ forwarding the value and routing back whatever is returned ‒ if the passed value is not
 * null-ish. If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
declare function run<T, R, C>(this: C, value: Promise<T>, callback: (this: C, value: Exclude<T, Nullish>) => R | Promise<R>, nullBehavior?: false): Promise<R | Extract<T, Nullish>>;
/**
 * Calls the passed callback ‒ forwarding the value and routing back whatever is returned ‒ if the passed value is not
 * null-ish. If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
declare function run<T, R, C>(this: C, value: T, callback: (this: C, value: Exclude<T, Nullish>) => R, nullBehavior?: false): R | Extract<T, Nullish>;
/**
 * Calls the passed callback, forwarding the value and routing back whatever is returned.
 */
declare function run<T, R, C>(this: C, value: Promise<T>, callback: (this: C, value: T) => R | Promise<R>, nullBehavior: true): Promise<R>;
/**
 * Calls the passed callback, forwarding the value and routing back whatever is returned.
 */
declare function run<T, R, C>(this: C, value: T, callback: (this: C, value: T) => R, nullBehavior: true): R;
/**
 * Calls either the passed callback or the passed alternative ‒ depending on whether the passed value is null-ish or
 * not ‒ forwarding said value and routing back whatever is returned.
 */
declare function run<T, R, S, C>(this: C, value: Promise<T>, callback: (this: C, value: Exclude<T, Nullish>) => R | Promise<R>, nullBehavior: (this: C, value: Extract<T, Nullish>) => S | Promise<S>): Promise<R | S>;
/**
 * Calls either the passed callback or the passed alternative ‒ depending on whether the passed value is null-ish or
 * not ‒ forwarding said value and routing back whatever is returned.
 */
declare function run<T, R, S, C>(this: C, value: T, callback: (this: C, value: Exclude<T, Nullish>) => R, nullBehavior: (this: C, value: Extract<T, Nullish>) => S): R | S;
/**
 * Calls the passed callback ‒ forwarding the value and returning it afterwards ‒ if the passed value is not null-ish.
 * If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
declare function apply<T, C>(this: C, value: Promise<T>, callback: (this: C, value: Exclude<T, Nullish>) => any, nullBehavior?: false): Promise<T>;
/**
 * Calls the passed callback ‒ forwarding the value and returning it afterwards ‒ if the passed value is not null-ish.
 * If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
declare function apply<T, C>(this: C, value: T, callback: (this: C, value: Exclude<T, Nullish>, nullBehavior?: false) => any): T;
/**
 * Calls the passed callback, forwarding the value and returning it afterwards.
 */
declare function apply<T, C>(this: C, value: Promise<T>, callback: (this: C, value: T) => any, nullBehavior: true): Promise<T>;
/**
 * Calls the passed callback, forwarding the value and returning it afterwards.
 */
declare function apply<T, C>(this: C, value: T, callback: (this: C, value: T) => any, nullBehavior: true): T;
/**
 * Calls either the passed callback or the passed alternative ‒ depending on whether the passed value is null-ish or
 * not ‒ forwarding the value and returning it afterwards.
 */
declare function apply<T, C>(this: C, value: Promise<T>, callback: (this: C, value: Exclude<T, Nullish>) => any, nullBehavior: (this: C, value: Extract<T, Nullish>) => any): Promise<T>;
/**
 * Calls either the passed callback or the passed alternative ‒ depending on whether the passed value is null-ish or
 * not ‒ forwarding the value and returning it afterwards.
 */
declare function apply<T, C>(this: C, value: T, callback: (this: C, value: Exclude<T, Nullish>) => any, nullBehavior: (this: C, value: Extract<T, Nullish>) => any): T;

export {
	run,
	apply
};