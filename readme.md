# ruply &middot; [![License (X11/MIT)](https://badgen.net/github/license/pimm/ruply)](https://github.com/Pimm/ruply/blob/master/copying.txt) [![npm version](https://badgen.net/npm/v/ruply)](https://www.npmjs.com/package/ruply) [![Build Status](https://api.travis-ci.com/Pimm/ruply.svg?branch=master)](https://app.travis-ci.com/github/Pimm/ruply) [![Coverage status](https://coveralls.io/repos/github/Pimm/ruply/badge.svg?branch=master)](https://coveralls.io/github/Pimm/ruply?branch=master)

`run[If]` and `apply` are functions that can help you craft easy-to-read code.

# `run`

`run` forwards the first argument to the callback, and returns the result.

```javascript
// Calculate the area.
const area = run(
	getSize(),
	({ width, height }) => width * height
);
```
`width` and `height` are neatly confined to the callback. The alternative without `run` has those variables overstay their welcome, polluting the scope:
```javascript
// Calculate the area.
const { width, height } = getSize();
const area = width * height;
```

# `apply`

`apply` forwards the first argument to the callback ‒ just like `run` does ‒ but returns that argument instead of the result.

```javascript
// Remove the item from the selection.
setState(previousSelection => apply(
	new Set(previousSelection),
	selection => selection.delete(item)
));
```
The alternative without `apply` is more wordy:
```javascript
// Remove the item from the selection.
setState(previousSelection => {
	const selection = new Set(previousSelection);
	selection.delete(item);
	return selection;
});
```

# `runIf`

`runIf` skips the callback if the first argument is [nullish](https://developer.mozilla.org/docs/Glossary/Nullish), and behaves the same as `run` otherwise. `runIf` is to `run` as the `?.` operator is to the `.` operator.

```javascript
// Parse the timestamp (if any).
const timestamp = runIf(
	response.data.timestamp,
	Date.parse
);
```
Alternatives include this:
```javascript
// Parse the timestamp (if any).
let { timestamp } = response.data;
if (timestamp != undefined) {
	timestamp = Date.parse(timestamp);
}
```
And this<sup>*</sup>:
```javascript
// Parse the timestamp (if any).
let timestamp = Date.parse(response.data.timestamp);
if (isNaN(timestamp)) {
	timestamp = undefined;
}
```
And this dangerous<sup>**</sup> one:
```javascript
// Parse the timestamp (if any).
const timestamp = response.data.timestamp
	&& Date.parse(response.data.timestamp);
```

[*] In the alternative with `isNaN`, invalid timestamps (such as `'invalid'`) are indistinguishable from missing timestamps. This is likely unexpected behaviour.

[**] In the alternative with the `&&` operator, `Date.parse` is skipped not only if the timestamp is `undefined` but also if it is `''` (or any other [falsy value](https://developer.mozilla.org/docs/Glossary/Falsy)). This too is likely unexpected.

### `runIf` and `??`

You can combine `runIf` and the `??` operator to provide a fallback used if the callback is skipped.

```javascript
return runIf(event.data, JSON.parse) ?? {};
```

# Installation

Install `ruply` using npm or Yarn and import the functions:
```javascript
import { run, apply, runIf } from 'ruply';
```

# Under the hood

These are simplified implementations of `run[If]` and `apply` (without support for promises or chains):

```javascript
function run(value, callback) {
	return callback(value);
}

function apply(value, callback) {
	callback(value);
	return value;
}

function runIf(value, callback) {
	return value != null ? callback(value) : value;
}
```

# Rationale

These functions are designed to help your code better convey your intentions to the reader.

Non-goals include:
1. producing the shortest possible code, and
2. producing clever code.

Use `run[If]` and `apply` in situations where you feel they help the reader of your code.

# More examples

## Shielded variable

```javascript
let available = 0;
function generateID() {
	return available++;
}
```
`run` scopes the variable, protecting it from accidental access.
```javascript
const generateID = run(0, available => () => available++);
```

## Encapsulated logic

```javascript
logger.log(`Received ${bundles.reduce(
	(sum, { messages }) => sum + messages.length, 0
)} message(s)`);
```
`run` moves the summing logic outside the template literal.
```javascript
run(
	bundles.reduce(
		(sum, { messages }) => sum + messages.length, 0
	),
	messageCount =>
		logger.log(`Received ${messageCount} message(s)`)
);
```

## Side effect in fallback

```javascript
if (data.has(index)) {
	return data.get(index);
}
// If the buffer does not exist, allocate it…
const buffer = Buffer.alloc(size);
// …and store it in the map.
data.set(index, buffer);
return buffer;
```
`apply` rearranges the pieces, producing code closer to human speech.
```javascript
return data.get(index)
	?? apply(
		// If the buffer does not exist, allocate it…
		Buffer.alloc(size),
		// …and store it in the map.
		buffer => data.set(index, buffer)
	);
```

## Timed asynchronous function

```javascript
const start = performance.now();
const result = await queryDatabase();
console.log(`${performance.now() - start} ms`);
return result;
```
`apply` removes the need for the short-lived variable, and places `return` and `queryDatabase()` closer together.
```javascript
const start = performance.now();
return apply(
	queryDatabase(),
	() => console.log(`${performance.now() - start} ms`)
);
```
The `await` keyword is optional, as `apply` is promise-aware.

## Optional chain

```javascript
const token =
	request.headers.authorization != undefined
		? /^Bearer\s+(.*)$/.exec(
			request.headers.authorization
		)?.[1]
		: undefined;
```
`runIf` cuts out the `undefined` check (for cases where the header is missing) as well as the `?.` operator (for cases where the regular expression does not match).
```javascript
const token = runIf(
	request.headers.authorization,
	headerValue => /^Bearer\s+(.*)$/.exec(headerValue),
	([, token]) => token
);
```
If you prefer keeping the `?.` operator, then you should.
```javascript
const token = runIf(
	request.headers.authorization,
	headerValue => /^Bearer\s+(.*)$/.exec(headerValue)
)?.[1];
```

## Optional step

```javascript
const value = await cache.get(key);
// Disregard the value if it has expired.
if (value == null || value.expiration < Date.now()) {
	return null;
}
return value;
```
`runIf` cuts out the `null` check.
```javascript
return runIf(
	cache.get(key),
	// Disregard the value if it has expired.
	value => value.expiration < Date.now() ? null : value
);
```
The `await` keyword is optional, as `runIf` is promise-aware.

## Memoisation

```javascript
const orders = new Map();
function memoGetOrder(id) {
	if (orders.has(id)) {
		return orders.get(id);
	}
	const order = getOrder(id);
	orders.set(id, order);
	return order;
}
```
`run` scopes the map, while `apply` rearranges the pieces of the function body to match the human speech equivalent.
```javascript
const memoGetOrder = run(new Map(), orders =>
	id => orders.get(id)
		?? apply(getOrder(id), order => orders.set(id, order))
);
```

# Pronunciation

> /ɹʌˈplaɪ/

Like _ru<s>n a</s>pply_.

# License (X11/MIT)
Copyright (c) 2020, 2021 Pimm "de Chinchilla" Hogeling

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

**The Software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. in no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the Software or the use or other dealings in the Software.**
