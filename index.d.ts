type Nullish = null | undefined;
/**
 * Calls the passed callback ‒ forwarding the value and routing back whatever it returns ‒ if the passed value is not
 * null-ish. If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
declare function run<T, R, C>(this: C, value: Promise<T>, callback: (this: C, value: Exclude<T, Nullish>) => R | Promise<R>): Promise<R | Extract<T, Nullish>>;
declare function run<T, R, C>(this: C, value: T, callback: (this: C, value: Exclude<T, Nullish>) => R): R | Extract<T, Nullish>;
/**
 * Calls the passed callback ‒ forwarding the value and returning it afterwards ‒ if the passed value is not null-ish.
 * If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
declare function apply<T, C>(this: C, value: Promise<T>, callback: (this: C, value: Exclude<T, Nullish>) => any): Promise<T>;
declare function apply<T, C>(this: C, value: T, callback: (this: C, value: Exclude<T, Nullish>) => any): T;

export {
	run,
	apply
};