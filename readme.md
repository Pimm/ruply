`run[If]` and `apply` are functions that can help you craft easy-to-read code.

You can think of `run[If]` and `apply` as cousins of [`.then(…)`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise), in that they help you encapsulate logic in short functions.

# `run`

`run` forwards the value to your callback, and returns the result.

```javascript
const area = run(
	getSize(),
	({ width, height }) => width * height
);
```
`run` forwards the size object into the callback, and routes back the area. You can tell the area is the only thing of interest: `width` and `height` are confined to the callback. In the alternative, `width` and `height` overstay their welcome:
```javascript
const { width, height } = getSize();
const area = width * height;
```

# `apply`

`apply` forwards the value to your callback ‒ just like `run` does ‒ but returns the value itself.

```javascript
return apply(
	document.createElement('div')
	element => element.id = 'container'
);
```
`apply` forwards the newly created container into the callback, and then returns that container. The alternative moves `return` to the bottom, further away from `document.createElement(…)`:
```javascript
const container = document.createElement('div');
container.id = 'container';
return container;
```

# `runIf`

_ruply_ is especially powerful when dealing with `null` and `undefined` using the `runIf` variant.

```javascript
const timestamp = runIf(
	response.data.timestamp,
	Date.parse
);
```
`runIf` forwards the timestamp in `response.data` into the callback _only_ if it is not `undefined` (or `null`). If the timestamp is missing, the parsing is skipped. Alternatives include this:
```javascript
let { timestamp } = response.data;
if (timestamp != undefined) {
	timestamp = Date.parse(timestamp);
}
```
And this<sup>*</sup>:
```javascript
let timestamp = Date.parse(response.data.timestamp);
if (isNaN(timestamp)) {
	timestamp = undefined;
}
```
And this dangerous<sup>**</sup> one:
```javascript
const timestamp = response.data.timestamp
	&& Date.parse(response.data.timestamp);
```

[*] In the alternative with `isNaN`, invalid timestamps (such as `'invalid'`) are indistinguishable from missing timestamps. This is likely unexpected behaviour.

[**] In the alternative with the `&&` operator, `Date.parse` is skipped not only if the timestamp is `undefined` but also if it is `''` (or any other falsy value). This too is likely unexpected.

### `runIf` and `??`

You can think of `runIf` as the opposite of the `??` operator.

```javascript
console.log(a ?? b ?? c);
```
This logs `a`, unless `a` is null-ish in which case it logs `b`, unless `b` is also null-ish in which case it logs `c`. In other words: it logs the leftmost value that is not null-ish.
```javascript
console.log(runIf(a, () => b, () => c));
```
This logs `c`, unless `b` is null-ish in which case it logs `b`, unless `a` is also null-ish in which case it logs `a`. In other words: it logs the leftmost value that is null-ish.

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
A few properties are read from `configuration.email`.

`run` allows those properties to be destructured, without polluting the scope.
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
	(total, { messages }) => total + messages.length, 0
)} message(s) in ${bundles.length} bundle(s)`);
```
The message count is calculated from `bundles`.

`run` moves the summing logic out of the template literal.
```javascript
run(
	bundles.reduce(
		(total, { messages }) => total + messages.length, 0
	),
	messageCount =>
		logger.log(`Received ${messageCount} message(s) `
			+ `in ${bundles.length} bundle(s)`)
);
```

## Return statement with side effect

```javascript
const id = sendMessage(body);
logger.log(`Message #${id} sent`);
return id;
```
A message is logged after `sendMessage` is called.

`apply` puts `return` and `sendMessage(…)` closer together.
```javascript
return apply(
	sendMessage(body),
	id => logger.log(`Message #${id} sent`)
);
```

## Timed asynchronous function

```javascript
console.time('query-database');
const result = await queryDatabase();
console.timeEnd('query-database');
return result;
```
The asynchronous `queryDatabase` function is timed.

`apply` removes the need for the short-lived variable.
```javascript
console.time('query-database');
return apply(
	queryDatabase(),
	() => console.timeEnd('query-database')
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
The header can be missing, and the regular expression can produce `null`.

`runIf` cuts out the `undefined` check as well as the `?.` operator.
```javascript
const token = runIf(
	request.headers.authorization,
	headerValue => /^Bearer\s+(.*)$/.exec(headerValue),
	([, token]) => token
);
```

## Optional step

```javascript
const value = await cache.get(key);
if (value == null || value.expiration < Date.now()) {
	return null;
}
return value;
```
The asynchronous `cache.get` function returns `null` if there is no cached value. A check is performed to ensure no expired values are returned.

`runIf` cuts out the `null` check.
```javascript
return runIf(
	cache.get(key),
	value => value.expiration < Date.now() ? null : value
);
```
There is no need for the `await` keyword, since `runIf` is promise-aware.