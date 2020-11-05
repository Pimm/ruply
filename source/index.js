import checkThenable from './checkThenable';

/**
 * Builds a ruply function from the passed logic.
 */
function build(name, logic) {
	function result(value, callback) {
		// Ensure the callback is a function.
		if ('function' != typeof callback) {
			// throw new TypeError(`${callback} is not a function`);
			//   ↓ (We are compiling this code with Babel, and our current configuration compiles the above into something
			//     overly complex.)
			throw new TypeError(callback + ' is not a function');
		}
		// Get the (optional) null behaviour argument.
		const nullBehavior = arguments.length > 2 && arguments[2],
		// (Adding this line explicitly instead of having Babel do it produces slightly shorter code.)
			context = this;
		// If the value is thenable, recall this function (recursively) once it resolves.
		if (checkThenable(value)) {
			return value.then(value => result.call(context, value, callback, nullBehavior));
		}
		// If the null behaviour argument is false (or omitted), drop the callback if the value is null-ish.
		if (false === nullBehavior) {
			if (null == value) {
				callback = undefined;
			}
		// If the null behaviour argument is a function, use that instead of the callback if the value is null-ish.
		} else if ('function' == typeof nullBehavior) {
			if (null == value) {
				callback = nullBehavior;
			}
		// If the null behaviour argument is not false nor a function, it must be true. Ensure it is.
		} else if (true !== nullBehavior) {
			// throw new TypeError(`${nullBehavior} is not a boolean value nor a function`);
			//   ↓
			throw new TypeError(nullBehavior + ' is not a boolean value nor a function');
		}
		// Apply the logic.
		return logic.call(context, value, callback);
	};
	// Give the resulting function the appropriate name.
	Object.defineProperty(result, 'name', {
		value: name,
		/* writable: false, */
		/* enumerable: false, */
		configurable: true
	});
	return result;
}
/**
 * Calls the passed callback ‒ forwarding the value and routing back whatever is returned ‒ if the passed value is not
 * null-ish. If the passed value is null-ish, behaviour is defined by the third argument. By default (third argument is
 * omitted), a null-ish value is returned directly and the passed callback is skipped.
 */
export const run = build('run', function run(value, callback) {
	// If the callback is undefined, return the value directly. Otherwise call the callback, and return the result. (Note
	// that the truthy check here is safe, as the callback can only be undefined or a function at this point.)
	return callback ? callback.call(this, value) : value;
});
/**
 * Calls the passed callback ‒ forwarding the value and returning it afterwards ‒ if the passed value is not null-ish.
 * If the passed value is null-ish, behaviour is defined by the third argument. By default (third argument is omitted),
 * a null-ish value is returned directly and the passed callback is skipped.
 */
export const apply = build('apply', function apply(value, callbackOrResult) {
	if (
		// If the callback is undefined, return the value directly…
		callbackOrResult
		// …otherwise call the callback. If the result of the callback is thenable, chain a function to it which will
		// return the value, and return the chain.
		&& checkThenable(
			callbackOrResult = callbackOrResult.call(this, value)
		)
		// (The truthy check above is safe, as the callback can only be undefined or a function at this point.)
	) {
		return callbackOrResult.then(() => value);
	}
	return value;
});