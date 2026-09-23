import { expectType, expectError } from 'tsd';
import { run, runIf, apply } from '..';

const aNumber: number = 1;
const aNumeralPromise = Promise.resolve(1);
const aNumberOrNull = 1 as number | null;
const aNumberOrUndefined = 1 as number | undefined;
const aNumeralOrNullPromise = Promise.resolve<number | null>(1);
const aNumeralPromiseOrNull = Promise.resolve(1) as Promise<number> | null;
const aNumberOrNumeralPromise = 1 as number | Promise<number>;
const convertNumberToString = (value: number) => value.toString();
const asyncConvertNumberToString = async (value: number) => value.toString();
const increment = (value: number) => value + 1;
const asyncIncrement = async (value: number) => value + 1;
const returnNull = (value: number) => null;
const asyncReturnNull = async (value: number) => null;
const returnUndefined = (value: number) => undefined;
const returnNumberOrNull = (value: number) => value > 0 ? value : null;
const asyncReturnNumberOrNull = async (value: number) => value > 0 ? value : null;
const maybeAsyncIncrement = (value: number) => value > 0 ? value + 1 : Promise.resolve(value + 1);
const getLength = (value: string) => value.length;
const throwError = (value: number) => { throw new Error(); };
const aNumeralPromiseLike = Promise.resolve(1) as PromiseLike<number>;
const promiseLikeIncrement = (value: number): PromiseLike<number> => Promise.resolve(value + 1);
const doNothing = (value: number) => {};
// run with one callback.
expectType<string>(run(aNumber, convertNumberToString));
expectType<Promise<string>>(run(aNumeralPromise, convertNumberToString));
expectType<Promise<string>>(run(aNumber, asyncConvertNumberToString));
expectType<Promise<string>>(run(aNumeralPromise, asyncConvertNumberToString));
// runIf with non-null-ish value and one callback.
expectType<string>(runIf(aNumber, convertNumberToString));
expectType<Promise<string>>(runIf(aNumeralPromise, convertNumberToString));
expectType<Promise<string>>(runIf(aNumber, asyncConvertNumberToString));
expectType<Promise<string>>(runIf(aNumeralPromise, asyncConvertNumberToString));
// runIf with potential null-ish value and one callback.
expectType<string | null>(runIf(aNumberOrNull, convertNumberToString));
expectType<Promise<string> | Promise<null>>(runIf(aNumeralOrNullPromise, convertNumberToString));
expectType<Promise<string> | null>(runIf(aNumberOrNull, asyncConvertNumberToString));
expectType<Promise<string> | Promise<null>>(runIf(aNumeralOrNullPromise, asyncConvertNumberToString));
expectType<Promise<string> | null>(runIf(aNumeralPromiseOrNull, convertNumberToString));
expectType<Promise<string> | null>(runIf(aNumeralPromiseOrNull, asyncConvertNumberToString));
// apply with one callback.
expectType<number>(apply(aNumber, convertNumberToString));
expectType<Promise<number>>(apply(aNumeralPromise, convertNumberToString));
expectType<Promise<number>>(apply(aNumber, asyncConvertNumberToString));
expectType<Promise<number>>(apply(aNumeralPromise, asyncConvertNumberToString));
// run with multiple callbacks.
expectType<string>(run(aNumber, increment, increment, convertNumberToString));
expectType<Promise<string>>(run(aNumeralPromise, increment, increment, convertNumberToString));
expectType<Promise<string>>(run(aNumber, increment, asyncIncrement, convertNumberToString));
expectType<Promise<string>>(run(aNumeralPromise, increment, asyncIncrement, convertNumberToString));
// runIf with non-null-ish value and multiple callbacks.
expectType<string>(runIf(aNumber, increment, increment, convertNumberToString));
expectType<Promise<string>>(runIf(aNumeralPromise, increment, increment, convertNumberToString));
expectType<Promise<string>>(runIf(aNumber, increment, asyncIncrement, convertNumberToString));
expectType<Promise<string>>(runIf(aNumeralPromise, increment, asyncIncrement, convertNumberToString));
// runIf with potential null-ish value and multiple callbacks.
expectType<string | null>(runIf(aNumberOrNull, increment, increment, convertNumberToString));
expectType<Promise<string> | Promise<null>>(runIf(aNumeralOrNullPromise, increment, increment, convertNumberToString));
expectType<Promise<string> | null>(runIf(aNumberOrNull, increment, asyncIncrement, convertNumberToString));
expectType<Promise<string> | Promise<null>>(runIf(aNumeralOrNullPromise, increment, asyncIncrement, convertNumberToString));
expectType<Promise<string> | null>(runIf(aNumeralPromiseOrNull, increment, increment, convertNumberToString));
expectType<Promise<string> | null>(runIf(aNumeralPromiseOrNull, increment, asyncIncrement, convertNumberToString));
// runIf with value and a broken callbacks chain.
expectType<null>(runIf(aNumber, increment, returnNull, convertNumberToString));
expectType<Promise<null>>(runIf(aNumeralPromise, increment, returnNull, convertNumberToString));
expectType<Promise<null>>(runIf(aNumber, increment, asyncReturnNull, convertNumberToString));
expectType<Promise<null>>(runIf(aNumber, asyncIncrement, returnNull, convertNumberToString));
expectType<Promise<null>>(runIf(aNumeralPromise, increment, asyncReturnNull, convertNumberToString));
expectType<null>(runIf(aNumberOrNull, increment, returnNull, convertNumberToString));
expectType<Promise<null>>(runIf(aNumeralOrNullPromise, increment, returnNull, convertNumberToString));
expectType<Promise<null> | null>(runIf(aNumberOrNull, increment, asyncReturnNull, convertNumberToString));
expectType<Promise<null>>(runIf(aNumeralOrNullPromise, increment, asyncReturnNull, convertNumberToString));
expectType<Promise<null> | null>(runIf(aNumeralPromiseOrNull, increment, returnNull, convertNumberToString));
expectType<Promise<null> | null>(runIf(aNumeralPromiseOrNull, increment, asyncReturnNull, convertNumberToString));
// apply with multiple callbacks.
expectType<number>(apply(aNumber, increment, increment, increment));
expectType<Promise<number>>(apply(aNumeralPromise, increment, increment, increment));
expectType<Promise<number>>(apply(aNumber, increment, asyncIncrement, increment));
expectType<Promise<number>>(apply(aNumeralPromise, increment, asyncIncrement, increment));
// run and runIf with chains of every supported length.
expectType<string>(run(aNumber, increment, convertNumberToString));
expectType<string>(run(aNumber, increment, increment, increment, convertNumberToString));
expectType<string>(run(aNumber, increment, increment, increment, increment, convertNumberToString));
expectType<Promise<string>>(run(aNumber, increment, increment, increment, increment, asyncConvertNumberToString));
expectType<Promise<string>>(run(aNumber, increment, asyncIncrement, increment, increment, convertNumberToString));
expectType<Promise<string>>(run(aNumeralPromise, increment, increment, asyncIncrement, convertNumberToString));
expectType<string | null>(runIf(aNumberOrNull, increment, convertNumberToString));
expectType<string | null>(runIf(aNumberOrNull, increment, increment, increment, convertNumberToString));
expectType<string | null>(runIf(aNumberOrNull, increment, increment, increment, increment, convertNumberToString));
expectType<Promise<string> | null>(runIf(aNumberOrNull, increment, increment, increment, increment, asyncConvertNumberToString));
expectType<Promise<string> | null>(runIf(aNumberOrNull, increment, asyncIncrement, increment, increment, convertNumberToString));
expectType<null>(runIf(aNumber, increment, increment, returnNull, increment, convertNumberToString));
expectType<Promise<null>>(runIf(aNumeralPromise, increment, increment, increment, asyncReturnNull, convertNumberToString));
expectType<number>(apply(aNumber, increment, increment));
expectType<number>(apply(aNumber, increment, increment, increment, increment, increment, increment));
// Chains with an asynchronous callback in the first or last position, or with several asynchronous callbacks.
expectType<Promise<string>>(run(aNumber, asyncIncrement, increment, convertNumberToString));
expectType<Promise<string>>(run(aNumber, increment, increment, asyncConvertNumberToString));
expectType<Promise<string>>(run(aNumeralPromise, asyncIncrement, asyncIncrement, asyncConvertNumberToString));
expectType<Promise<string> | null>(runIf(aNumberOrNull, asyncIncrement, increment, convertNumberToString));
expectType<Promise<string> | null>(runIf(aNumberOrNull, increment, increment, asyncConvertNumberToString));
expectType<Promise<string> | Promise<null>>(runIf(aNumeralOrNullPromise, asyncIncrement, asyncIncrement, asyncConvertNumberToString));
expectType<Promise<number>>(apply(aNumber, asyncIncrement, increment, increment));
expectType<Promise<number>>(apply(aNumber, increment, increment, asyncIncrement));
// runIf with undefined as the null-ish value.
expectType<string | undefined>(runIf(aNumberOrUndefined, convertNumberToString));
expectType<string | undefined>(runIf(aNumberOrUndefined, increment, convertNumberToString));
expectType<undefined>(runIf(aNumber, returnUndefined, convertNumberToString));
// runIf with a callback which returns null only sometimes.
expectType<string | null>(runIf(aNumber, returnNumberOrNull, convertNumberToString));
expectType<Promise<string> | Promise<null>>(runIf(aNumber, asyncReturnNumberOrNull, convertNumberToString));
expectType<Promise<string> | Promise<null>>(runIf(aNumeralPromise, returnNumberOrNull, convertNumberToString));
// runIf with a callback which can never be reached, because a preceding step is always null-ish.
expectType<null>(runIf(null, asyncConvertNumberToString));
expectType<undefined>(runIf(undefined, asyncConvertNumberToString));
expectType<null>(runIf(aNumber, returnNull, asyncConvertNumberToString));
expectType<undefined>(runIf(aNumber, returnUndefined, asyncConvertNumberToString));
expectType<null>(runIf(aNumberOrNull, returnNull, asyncConvertNumberToString));
expectType<Promise<null>>(runIf(aNumeralPromise, returnNull, asyncConvertNumberToString));
expectType<Promise<null>>(runIf(aNumber, asyncReturnNull, asyncConvertNumberToString));
expectType<null>(runIf(aNumber, increment, returnNull, increment, asyncConvertNumberToString));
// runIf with a callback which can be reached, because a preceding step is only sometimes null-ish.
expectType<Promise<string> | null>(runIf(aNumber, returnNumberOrNull, asyncConvertNumberToString));
// Callbacks which always throw: the error is thrown if the chain is synchronous up to that point, and rejects the
// returned promise if it is asynchronous. Subsequent callbacks are skipped.
expectType<never>(run(aNumber, throwError));
expectType<never>(run(aNumber, increment, throwError, increment));
expectType<never>(run(aNumber, throwError, asyncIncrement));
expectType<Promise<never>>(run(aNumeralPromise, throwError));
expectType<Promise<never>>(run(aNumeralPromise, increment, throwError));
expectType<Promise<never>>(run(aNumber, asyncIncrement, throwError));
expectType<Promise<never>>(run(aNumber, asyncIncrement, throwError, asyncIncrement));
expectType<Promise<never>>(run(aNumberOrNumeralPromise, throwError));
expectType<never>(runIf(aNumber, throwError));
expectType<never>(runIf(aNumber, throwError, asyncConvertNumberToString));
expectType<null>(runIf(aNumberOrNull, throwError));
expectType<null>(runIf(aNumberOrNull, throwError, convertNumberToString));
expectType<Promise<never>>(runIf(aNumeralPromise, throwError));
expectType<Promise<never>>(runIf(aNumber, asyncIncrement, throwError));
expectType<Promise<never>>(runIf(aNumeralPromise, throwError, asyncConvertNumberToString));
expectType<Promise<never>>(runIf(aNumeralPromise, throwError, returnNull, increment)); // (not even a null-ish step contributes)
expectType<Promise<never> | null>(runIf(aNumeralPromiseOrNull, throwError));
expectType<Promise<null>>(runIf(aNumeralOrNullPromise, throwError));
expectType<never>(apply(aNumber, throwError));
expectType<never>(apply(aNumber, increment, throwError));
expectType<never>(apply(aNumber, throwError, asyncIncrement));
expectType<Promise<never>>(apply(aNumeralPromise, throwError));
expectType<Promise<never>>(apply(aNumber, asyncIncrement, throwError));
expectType<Promise<never>>(apply(aNumberOrNumeralPromise, throwError));
// Callbacks which always throw asynchronously (typed Promise<never>) reject the chain, like a throw after an
// asynchronous step does.
const asyncThrowError = async (value: number): Promise<never> => { throw new Error(); };
expectType<Promise<never>>(run(aNumber, asyncThrowError));
expectType<Promise<never>>(run(aNumber, asyncThrowError, increment));
expectType<Promise<never>>(run(aNumeralPromise, increment, asyncThrowError));
expectType<Promise<never>>(run(aNumeralPromise, asyncThrowError, asyncIncrement, increment));
expectType<Promise<never>>(runIf(aNumber, asyncThrowError, increment));
expectType<Promise<never> | null>(runIf(aNumberOrNull, asyncThrowError, increment));
expectType<Promise<never>>(apply(aNumber, asyncThrowError, increment));
expectType<Promise<never>>(apply(aNumeralPromise, asyncThrowError));
// A value which never resolves passes through as a rejection.
declare const aNeverPromise: Promise<never>;
expectType<Promise<never>>(run(aNeverPromise, increment));
expectType<Promise<never>>(runIf(aNeverPromise, increment));
expectType<Promise<never>>(apply(aNeverPromise, increment));
// A callback which only sometimes throws asynchronously keeps both outcomes.
const asyncThrowErrorSometimes = (value: number) => value > 0 ? value : Promise.reject<never>(new Error());
expectType<number | Promise<never>>(run(aNumber, asyncThrowErrorSometimes, increment));
// Values and callbacks which are only sometimes asynchronous.
expectType<string | Promise<string>>(run(aNumberOrNumeralPromise, convertNumberToString));
expectType<string | Promise<string>>(runIf(aNumberOrNumeralPromise, convertNumberToString));
expectType<number | Promise<number>>(apply(aNumberOrNumeralPromise, convertNumberToString));
expectType<string | Promise<string>>(run(aNumber, maybeAsyncIncrement, convertNumberToString));
expectType<string | Promise<string>>(runIf(aNumber, maybeAsyncIncrement, convertNumberToString));
// Any object with a then method counts as a promise: the callback receives the value it resolves to, and the chain is
// asynchronous from then on, so its result can never pass for a synchronous one.
run(aNumeralPromiseLike, value => expectType<number>(value));
run(aNumber, promiseLikeIncrement, value => expectType<number>(value));
expectError((): string => run(aNumeralPromiseLike, convertNumberToString));
expectError((): number => run(aNumber, promiseLikeIncrement));
expectError((): number => apply(aNumber, promiseLikeIncrement));
expectError((): string | null => runIf(aNumeralPromiseLike, convertNumberToString));
// A promise made of a value which is only sometimes a promise is one promise, not two.
expectType<Promise<number>>(run(aNumberOrNumeralPromise, asyncIncrement));
// Callbacks receive the (resolved, non-null-ish) value without the need for annotations.
run(aNumeralPromise, value => expectType<number>(value));
run(aNumber, asyncIncrement, value => expectType<number>(value));
runIf(aNumberOrNull, value => expectType<number>(value));
runIf(aNumeralOrNullPromise, value => expectType<number>(value));
runIf(aNumber, asyncReturnNumberOrNull, value => expectType<number>(value));
apply(aNumeralPromise, value => expectType<number>(value), value => expectType<number>(value));
// Callbacks which do not accept the value are rejected.
expectError(run(aNumber, getLength));
expectError(run(aNumber, increment, getLength));
expectError(run(aNumberOrNull, increment));
expectError(runIf(aNumber, getLength));
expectError(runIf(aNumber, increment, getLength));
expectError(apply(aNumber, getLength));
expectError(apply(aNumber, increment, getLength));
// The type of the value is inferred from the context of the call, such as the left operand of ??.
declare class Dictionary<T> {
	get(id: string): T | undefined;
	set(id: string, value: T): void;
}
declare const dictionaries: Dictionary<Dictionary<string>>;
const dictionary = dictionaries.get('a') ?? apply(new Dictionary(), dictionary => dictionaries.set('a', dictionary));
expectType<Dictionary<string>>(dictionary);
const dictionaryAppliedTwice = dictionaries.get('a') ?? apply(new Dictionary(), dictionary => dictionaries.set('a', dictionary), dictionary => dictionaries.set('b', dictionary));
expectType<Dictionary<string>>(dictionaryAppliedTwice);
// A value of a generic type comes back as that type.
const passThrough = <R>(value: Exclude<R, Promise<unknown>>): R => apply(value, () => {});
const passThroughTwice = <R>(value: Exclude<R, Promise<unknown>>): R => apply(value, () => {}, () => {});
// Generic wrappers: a promise whose type is a type parameter comes back as that type.
const forwardPromise = <T>(promise: Promise<T>): Promise<T> => run(promise, value => value);
const mapPromise = <T, R>(promise: Promise<T>, callback: (value: T) => R): Promise<R> => run(promise, callback);
const forwardNullablePromise = <T>(promise: Promise<T | null>): Promise<T | null> => runIf(promise, value => value);
const applyToPromise = <T>(promise: Promise<T>): Promise<T> => apply(promise, () => {});
// A generic value with an asynchronous callback: the result is a promise, though a deferred one which an async
// function has to await before returning it.
const awaitedInWrapper = async <T>(value: T): Promise<number> => await run(value, async () => 1);
// Callbacks are called with the context in which run[If] or apply is called.
const context = { factor: 2, run, runIf, apply };
expectType<number>(context.run(aNumber, function (value) {
	expectType<typeof context>(this);
	return value * this.factor;
}));
expectType<number | null>(context.runIf(aNumberOrNull, function (value) {
	expectType<typeof context>(this);
	return value * this.factor;
}));
expectType<number>(context.apply(aNumber, function (value) {
	expectType<typeof context>(this);
}));
expectType<number>(context.run(aNumber, increment, function (value) {
	expectType<typeof context>(this);
	return value * this.factor;
}));
expectType<number | null>(context.runIf(aNumberOrNull, increment, function (value) {
	expectType<typeof context>(this);
	return value * this.factor;
}));
expectType<number>(context.apply(aNumber, increment, function (value) {
	expectType<typeof context>(this);
	return value * this.factor;
}));
// Every callback in a chain receives the (resolved, non-null-ish) result of the previous one, and is called with the
// context.
context.run(aNumber,
	function (value) { expectType<number>(value); expectType<typeof context>(this); return value.toString(); },
	async function (value) { expectType<string>(value); expectType<typeof context>(this); return value.length > this.factor; },
	function (value) { expectType<boolean>(value); expectType<typeof context>(this); return [value.toString()]; },
	function (value) { expectType<Array<string>>(value); expectType<typeof context>(this); return value.length; },
	function (value) { expectType<number>(value); expectType<typeof context>(this); return value * this.factor; }
);
context.runIf(aNumberOrNull,
	function (value) { expectType<number>(value); expectType<typeof context>(this); return value > this.factor ? value.toString() : null; },
	async function (value) { expectType<string>(value); expectType<typeof context>(this); return value.length > this.factor; },
	function (value) { expectType<boolean>(value); expectType<typeof context>(this); return value ? [value.toString()] : undefined; },
	function (value) { expectType<Array<string>>(value); expectType<typeof context>(this); return value.length; },
	function (value) { expectType<number>(value); expectType<typeof context>(this); return value * this.factor; }
);
// run and runIf with callbacks which change the type of the value.
expectType<number>(run(aNumber, convertNumberToString, getLength));
expectType<string>(run(aNumber, convertNumberToString, getLength, convertNumberToString));
expectType<number>(run(aNumber, value => `${value}`, value => value.length));
expectType<Promise<number>>(run(aNumeralPromise, convertNumberToString, getLength));
expectType<Promise<number>>(run(aNumber, asyncConvertNumberToString, getLength));
expectType<number>(runIf(aNumber, convertNumberToString, getLength));
expectType<number | null>(runIf(aNumberOrNull, convertNumberToString, getLength));
expectType<string | null>(runIf(aNumberOrNull, convertNumberToString, getLength, convertNumberToString));
expectType<Promise<number> | null>(runIf(aNumberOrNull, asyncConvertNumberToString, getLength));
expectType<Promise<number> | Promise<null>>(runIf(aNumeralOrNullPromise, convertNumberToString, getLength));
// apply with callbacks which return values of different types.
expectType<number>(apply(aNumber, convertNumberToString, increment));
expectType<number>(apply(aNumber, doNothing, increment));
expectType<number>(apply(aNumber, returnNull, increment));
expectType<Promise<number>>(apply(aNumber, convertNumberToString, asyncIncrement));
expectType<Promise<number>>(apply(aNumber, doNothing, asyncIncrement));
expectType<Promise<number>>(apply(aNumeralPromise, doNothing, increment));
// apply with a callback which is only sometimes asynchronous.
expectType<number | Promise<number>>(apply(aNumber, increment, maybeAsyncIncrement));
// apply keeps the type of its value as passed, literal types included, as it always did for a single callback.
expectType<Promise<1>>(apply(1, increment, asyncIncrement));
// run and runIf with four or five callbacks which change the type of the value, or which are asynchronous or null-ish
// in the middle of the chain.
expectType<number>(run(aNumber, convertNumberToString, getLength, convertNumberToString, getLength));
expectType<string>(run(aNumber, convertNumberToString, getLength, convertNumberToString, getLength, convertNumberToString));
expectType<Promise<number>>(run(aNumber, convertNumberToString, getLength, asyncConvertNumberToString, getLength));
expectType<Promise<string>>(run(aNumeralPromise, convertNumberToString, getLength, convertNumberToString, getLength, convertNumberToString));
expectType<number | null>(runIf(aNumberOrNull, convertNumberToString, getLength, convertNumberToString, getLength));
expectType<Promise<number> | null>(runIf(aNumberOrNull, convertNumberToString, getLength, asyncConvertNumberToString, getLength));
expectType<null>(runIf(aNumber, convertNumberToString, getLength, returnNull, convertNumberToString));
expectType<Promise<null>>(runIf(aNumeralPromise, convertNumberToString, getLength, returnNull, convertNumberToString, getLength));
// apply with callbacks spread from an array rather than a tuple.
declare const asyncCallbacks: Array<(value: number) => Promise<void>>;
declare const syncCallbacks: Array<(value: number) => void>;
declare const maybeAsyncCallbacks: Array<(value: number) => void | Promise<void>>;
expectType<Promise<number>>(apply(aNumber, ...asyncCallbacks));
expectType<number | Promise<number>>(apply(aNumber, ...maybeAsyncCallbacks));
expectType<Promise<number>>(apply(aNumber, increment, ...asyncCallbacks));
expectType<Promise<number>>(apply(aNumeralPromise, ...maybeAsyncCallbacks));
expectType<Promise<number>>(apply(aNumber, ...syncCallbacks, asyncIncrement));
expectType<Promise<number>>(apply(aNumber, increment, ...syncCallbacks, asyncIncrement));
expectType<number | Promise<number>>(apply(aNumber, ...syncCallbacks, ...asyncCallbacks));
expectType<number | Promise<number>>(apply(aNumber, increment, ...syncCallbacks, ...asyncCallbacks));
expectType<Promise<number>>(apply(aNumber, increment, ...syncCallbacks, ...asyncCallbacks, asyncIncrement));
expectType<number | Promise<number>>(apply(aNumber, increment, increment, ...asyncCallbacks));
apply(aNumber, increment, ...syncCallbacks, value => expectType<number>(value));
// apply with callbacks forwarded from a generic wrapper, which keep their types, also when there are none.
const forwardAfter = <U extends Array<(value: number) => void>>(...callbacks: U) => apply(aNumber, increment, ...callbacks);
const forwardAround = <U extends Array<(value: number) => void>>(...callbacks: U) => apply(aNumber, increment, ...callbacks, asyncIncrement);
expectType<number>(forwardAfter(increment));
expectType<Promise<number>>(forwardAfter(asyncIncrement));
expectType<number>(forwardAfter());
expectType<Promise<number>>(forwardAround());
const noCallbacks: never[] = [];
expectType<number>(apply(aNumber, increment, ...noCallbacks));
// apply keeps the context in a chain whose callbacks return different types.
expectType<number>(context.apply(aNumber, increment, function (value) {
	expectType<typeof context>(this);
}));
expectType<number>(context.apply(aNumber, function (value) {
	expectType<typeof context>(this);
}, ...syncCallbacks));