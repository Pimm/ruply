`run` and `apply` are two functions that can help you craft easy-to-read code.

You can think of `run` and `apply` as cousins of `.then(…)` in promises, in that they help you encapsulate logic in short functions. Because of its behaviour, `run` is roughly the counterpart of the `??` operator.

# `run`

`run` forwards the value to your callback, and returns the result.

Take this snippet for example:
```javascript
const area = run(
	getSize(),
	({ width, height }) => width * height
);
```
`run` forwards the size object into the callback, and routes back the area returned by it. It is obvious from reading these lines that `width` and `height` are used only to calculate the area, more so than in the alternative:
```javascript
const { width, height } = getSize();
const area = width * height;
```

But `run` has an extra characteristic which makes it a lot more powerful: it skips the callback if the value is null-ish.

Take a look at this:
```javascript
const date = run(
	response.data.timestamp,
	timestamp => new Date(timestamp)
);
```
`run` forwards the timestamp in `response.data` into the callback only if it is not `undefined` (or `null`). If the timestamp is missing, parsing is skipped. Alternatives include this:
```javascript
let date = response.data.timestamp;
if (date != undefined) {
	date = new Date(date);
}
```
And this dangerous[1] one:
```javascript
const date = response.data.timestamp
	&& new Date(response.data.timestamp);
```

# `apply`

`apply` forwards the value to your callback ‒ just like `run` does ‒ but returns the value itself.

Take this snippet:
```javascript
return apply(
	document.createElement('div')
	element => element.id = 'container'
);
```
The alternative adds noise between `return` and `document.createElement(…)`:
```javascript
const container = document.createElement('div');
container.id = 'container';
return container;
```

Like `run`, `apply` skips the callback if the value is null-ish.

# Under the hood

This is a simplified implementation of `run` and `apply` (without promise support):

```javascript
function run(value, callback) {
	return value != null ? callback(value) : value;
}

function apply(value, callback) {
	return value != null && callback(value), value;
}
```

# More examples

## Side effect in return statement

```javascript
const id = sendMessage(body);
logger.log(`Message #${id} sent`);
return id;
```
`apply` groups `return` and `sendMessage(…)` closer together, and better reflects that logging is a side effect:
```javascript
return apply(
	sendMessage(body),
	id => logger.log(`Message #${id} sent`)
);
```

## Check in return statement.

```javascript
const index = array.indexOf(value);
if (index == -1) {
	throw new Error(`Illegal state: ${value} not found`);
}
return index;
```
`apply` shifts the reader's focus away from the if block:
```javascript
return apply(
	array.indexOf(value),
	index => {
		if (index == -1) {
			throw new Error(`Illegal state: ${value} not found`);
		}
	}
)
```

## Extra step if promise does not resolve to `null`

```javascript
const value = await this.cache.get(key);
if (value == null || value.expiration < Date.now()) {
	return null;
}
return value;
```
The above snippet returns (a promise which resolves to) `null` if either the value doesn't exist in the cache or said value expired. `run` cuts out the `null` check:
```javascript
return run(
	this.cache.get(key),
	value => value.expiration < Date.now() ? null : value
);
```
There is no need for the `await` keyword, since `run` is promise-aware.

## Side effect when a promise resolves

```javascript
startTimer('query-database');
const result = await queryDatabase();
stopTimer('query-database');
return result;
```
This snippet starts a timer before calling `queryDatabase`, and stops it when the returned promise resolves. `apply` flows the result implicitly:
```javascript
startTimer('query-database');
return apply(
	queryDatabase(),
	() => stopTimer('query-database')
);
```
The `await` keyword is optional, as `apply` is promise-aware.

## Initialisation block

```javascript
const buffer = Buffer.allocUnsafe(size);
Array.from(buffer.keys(), i => buffer[i] = i);
return buffer;
```
`apply` eliminates the `buffer` variable, which is only used during initialisation:
```javascript
return apply(
	Buffer.allocUnsafe(size),
	buffer => Array.from(buffer.keys(), i => buffer[i] = i)
);
```

## Logic for optional argument

```javascript
if (options?.limit != undefined) {
	query.add('limit', options.limit);
}
```
`apply` removes the repetition of "`options.`":
```javascript
apply(
	options?.limit,
	limit => query.add('limit', limit)
);
```

## Swapping two variables

```javascript
const temp = a;
a = b;
b = temp;
```
If you really wanted to, you could do this with `apply` (assuming `a` is not a promise nor null-ish):
```javascript
b = apply(a, () => a = b);
```