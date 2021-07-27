`run[If]` and `apply` are functions that can help you craft easy-to-read code.

# `run`

`run` forwards the value to your callback, and returns the result.

```javascript
// Calculate the area.
const area = run(
	getSize(),
	({ width, height }) => width * height
);
```
`width` and `height` are neatly confined to the callback. The alternative without `run` has those variables overstay their welcome:
```javascript
// Calculate the area.
const { width, height } = getSize();
const area = width * height;
```

# `apply`

`apply` forwards the value to your callback ‒ just like `run` does ‒ but returns the value itself.

```javascript
// Remove the item from the selection.
setState(previousSelection => apply(
	new Set(previousSelection),
	selection => selection.delete(item)
));
```
The alternative without `apply` uses the `return` keyword and is more wordy:
```javascript
// Remove the item from the selection.
setState(previousSelection => {
	const selection = new Set(previousSelection);
	selection.delete(item);
	return selection;
});
```

# `runIf`

`runIf` skips the callback if the value is [nullish](https://developer.mozilla.org/docs/Glossary/Nullish), and behaves the same as `run` otherwise. `runIf` is to `run` as the `?.` operator is to the `.` operator.

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

You can combine `runIf` and the `??` operator to provide a fallback value used if the callback is skipped.

```javascript
return runIf(event.data, JSON.parse) ?? {};
```

# Under the hood

These are simplified implementations of `run[If]` and `apply` (without support for promises or multiple callbacks):

```javascript
function run(value, callback) {
	return callback(value);
}

function runIf(value, callback) {
	return value != null ? callback(value) : value;
}

function apply(value, callback) {
	callback(value);
	return value;
}
```

# Rationale

These functions are designed to help your code better convey your intentions to the reader.

Non-goals include:
1. producing the shortest possible code, and
2. producing clever code.

Use `run[If]` and `apply` in situations where you feel it helps the reader of your code.

# More examples

## Local destructure

```javascript
const emailApi = new EmailApi(
	configuration.email.clientID,
	configuration.email.clientSecret,
	configuration.email.sender
);
```
`run` allows the properties to be destructured, without polluting the scope.
```javascript
const emailApi = run(
	configuration.email,
	({ clientID, clientSecret, sender }) =>
		new EmailApi(clientID, clientSecret, sender)
);
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
} else {
	const buffer = Buffer.alloc(size);
	data.set(index, buffer);
	return buffer;
}
```
`apply` reorders the pieces, producing code closer to human speech.
```javascript
return data.get(index)
	?? apply(
		Buffer.alloc(size),
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
`runIf` cuts out the `undefined` check (for cases where the header is missing) as well as the `?.` operator (for cases where the regular expression returns `null`).
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
// Discard the value if it has expired.
if (value == null || value.expiration < Date.now()) {
	return null;
}
return value;
```
`runIf` cuts out the `null` check.
```javascript
return runIf(
	cache.get(key),
	// Discard the value if it has expired.
	value => value.expiration < Date.now() ? null : value
);
```
The `await` keyword is optional, as `runIf` is promise-aware.