import checkThenable from './checkThenable';

/**
 * Builds a ruply function from the passed logic.
 */
function build(name, logic) {
	function result(value, callback) {
		// (Adding this line explicitly instead of having Babel do it produces slightly shorter code.)
		var context = this;
		// Ensure the callback is a function.
		if ('function' != typeof callback) {
			// throw new TypeError(`${callback} is not a function`);
			//   ↓ (We are compiling this code with Babel, and our current configuration compiles the above into something
			//     overly complex.)
			throw new TypeError(callback + ' is not a function');
		}
		// If the value is thenable, recall this function (recursively) once it resolves.
		if (checkThenable(value)) {
			return value.then(value => result.call(context, value, callback));
		}
		// Apply the logic.
		return logic.call(context, value, callback);
	};
	// Have the resulting function borrow the name of the logic.
	Object.defineProperty(result, 'name', {
		value: name,
		/* writable: false, */
		/* enumerable: false, */
		configurable: true
	});
	return result;
}
/**
 * Calls the passed callback ‒ forwarding the value and routing back whatever it returns ‒ if the passed value is not
 * null-ish. If the passed value is null-ish, it is returned directly and the passed callback is not called.
 */
export const run = build('run', function run(value, callback) {
	// If the value is null-ish, return it directly. Otherwise call the callback, and return the result.
	return null != value ? callback.call(this, value) : value;
});
/**
 * Calls the passed callback ‒ forwarding the value and returning it afterwards ‒ if the passed value is not null-ish.
 * If the passed value is null-ish, it is returned directly and the passed callback is not called.
 */
export const apply = build('apply', function apply(value, callbackOrResult) {
	if (
		// If the value is null-ish, return it directly…
		null != value
		// …otherwise call the callback. If the result of the callback is thenable, chain a function to it which will
		// return the value, and return the chain.
		&& checkThenable(
			callbackOrResult = callbackOrResult.call(this, value)
		)
	) {
		return callbackOrResult.then(() => value);
	}
	return value;
});