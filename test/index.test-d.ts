import { expectType } from 'tsd';
import { run, runIf, apply } from '..';

const aNumber: number = 1;
const aNumeralPromise = Promise.resolve(1);
const aNumberOrNull = 1 as number | null;
const aNumeralOrNullPromise = Promise.resolve<number | null>(1);
const aNumeralPromiseOrNull = Promise.resolve(1) as Promise<number> | null;
function convertNumberToString(value: number) {
	return value.toString();
}
async function asyncConvertNumberToString(value: number) {
	return value.toString();
}
function increment(value: number) {
	return value + 1;
}
async function asyncIncrement(value: number) {
	return value + 1;
}
function returnNull(value: number) {
	return null;
}
async function asyncReturnNull(value: number) {
	return null;
}
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
// apply with multiple callbacks.
expectType<number>(apply(aNumber, increment, increment, increment));
expectType<Promise<number>>(apply(aNumeralPromise, increment, increment, increment));
expectType<Promise<number>>(apply(aNumber, increment, asyncIncrement, increment));
expectType<Promise<number>>(apply(aNumeralPromise, increment, asyncIncrement, increment));
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