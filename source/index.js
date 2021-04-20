import checkThenable from './checkThenable';

// Steal the splice function from this empty array.
const { splice } = [];
/**
 * Builds a ruply function from the passed logic.
 */
function build(name, logic) {
	// Give the resulting function the appropriate name.
	return Object.defineProperty(
		function implementation(value, callback) {
			// Ensure the callback is a function.
			if ('function' != typeof callback) {
				// throw new TypeError(`${callback} is not a function`);
				//   ↓ (We are compiling this code with Babel, and our current configuration compiles the above into something
				//     overly complex.)
				throw new TypeError(callback + ' is not a function');
			}
			// (Storing the context here explicitly instead of having Babel do it produces slightly shorter code.)
			const context = this,
				forwardingArguments = arguments;
			var result;
			// If the value is thenable, recall this function (recursively) once it resolves.
			if (checkThenable(value)) {
				return value.then(value => {
					// const [, ...callbacks] = arguments;
					// return implementation.call(context, value, ...callbacks);
					//   ↓
					forwardingArguments[0] = value;
					return implementation.apply(context, forwardingArguments);
				});
			}
			// Apply the logic.
			result = logic.call(context, value, callback);
			// If there are other callbacks (callbacks other than the one from the line above), recall this function
			// (recursively) with the result as the new value.
			if (forwardingArguments.length > 2) {
				// const [,, ...otherCallbacks] = arguments;
				// return implementation.call(context, result, ...otherCallbacks);
				//   ↓
				splice.call(forwardingArguments, 0, 2, result);
				return implementation.apply(context, forwardingArguments);
			// If there are no more callbacks, return the result.
			} else /* if (2 == forwardingArguments.length) */ {
				return result;
			}
		},
		'name',
		{
			value: name,
			/* writable: false, */
			/* enumerable: false, */
			configurable: true
		}
	);
}
/**
 * Calls the passed callback, forwarding the value and routing back whatever is returned.
 */
export const run =
	build(
		'run',
		function runLogic(value, callback) {
			return callback.call(this, value);
		}
	),
/**
 * Calls the passed callback ‒ forwarding the value and routing back whatever is returned ‒ if the passed value is not
 * null-ish. If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
	runIf =
	build(
		'runIf',
		function runIfLogic(value, callback) {
			return null != value ? callback.call(this, value) : value;
		}
	),
/**
 * Calls the passed callback, forwarding the value and returning it afterwards.
 */
	apply =
	build(
		'apply',
		function applyLogic(value, callback, result) {
			if (
				// Call the callback. If the result is thenable, chain a function to it which will return the value, and return
				// that chain.
				checkThenable(
					result = callback.call(this, value)
				)
			) {
				return result.then(() => value);
			}
			// If the result is not thenable, return the value.
			return value;
		}
	);