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
// Values and callbacks which are only sometimes asynchronous.
expectType<string | Promise<string>>(run(aNumberOrNumeralPromise, convertNumberToString));
expectType<string | Promise<string>>(runIf(aNumberOrNumeralPromise, convertNumberToString));
expectType<number | Promise<number>>(apply(aNumberOrNumeralPromise, convertNumberToString));
expectType<string | Promise<string>>(run(aNumber, maybeAsyncIncrement, convertNumberToString));
expectType<string | Promise<string>>(runIf(aNumber, maybeAsyncIncrement, convertNumberToString));
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
declare const maybeAsyncCallbacks: Array<(value: number) => void | Promise<void>>;
expectType<Promise<number>>(apply(aNumber, ...asyncCallbacks));
expectType<number | Promise<number>>(apply(aNumber, ...maybeAsyncCallbacks));
expectType<Promise<number>>(apply(aNumber, increment, ...asyncCallbacks));
expectType<Promise<number>>(apply(aNumeralPromise, ...maybeAsyncCallbacks));
// apply keeps the context in a chain whose callbacks return different types.
expectType<number>(context.apply(aNumber, increment, function (value) {
	expectType<typeof context>(this);
}));
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