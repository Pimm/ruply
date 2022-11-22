import takeThen from './takeThen';

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
			// If the value is promise-like, recall this function (recursively) once it resolves.
			const then = takeThen(value);
			if (then) {
				return then(value => {
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
 * Calls the passed callback, forwarding the first argument and routing back whatever is returned.
 *
 * This is a simplified implementation of `run`:
 * ```
 * function run(value, callback) {
 *   return callback(value);
 * }
 * ```
 *
 * #### Promises
 *
 * If the first argument is a promise, the value to which that promise resolves is forwarded to the passed callback
 * instead of the promise itself. As a result, the call to the passed callback is delayed until the promise resolves.
 * If the promise rejects, the passed callback is skipped.
 *
 * #### Chains
 *
 * If multiple callbacks are passed, they are called subsequently. `run(x, a, b)` is equivalent to `run(run(x, a), b)`.
 */
export const run =
	build(
		'run',
		function runLogic(value, callback) {
			return callback.call(this, value);
		}
	),
/**
 * Calls the passed callback ‒ forwarding the argument and routing back whatever is returned ‒ if the first argument is
 * not null-ish. If the first argument is null-ish, it is returned directly and the passed callback is skipped.
 *
 * This is a simplified implementation of `runIf`:
 * ```
 * function runIf(value, callback) {
 *   return value != null ? callback(value) : value;
 * }
 * ```
 *
 * #### Promises
 *
 * If the first argument is a promise, the value to which that promise resolves is forwarded to the passed callback
 * instead of the promise itself. As a result, the call to the passed callback is delayed until the promise resolves.
 * If the value to which the promise resolves is null-ish or the promise rejects, the passed callback is skipped.
 *
 * #### Chains
 *
 * If multiple callbacks are passed, they are called subsequently—respecting the logic regarding null-ish values.
 * `runIf(x, a, b)` is equivalent to `runIf(runIf(x, a), b)`
 */
	runIf =
	build(
		'runIf',
		function runIfLogic(value, callback) {
			return null != value ? callback.call(this, value) : value;
		}
	),
/**
 * Calls the passed callback, forwarding the first argument and returning that argument afterwards.
 *
 * This is a simplified implementation of `apply`:
 * ```
 * function apply(value, callback) {
 *   callback(value);
 *   return value;
 * }
 * ```
 * #### Promises
 *
 * If the first argument is a promise, the value to which that promise resolves is forwarded to the passed callback
 * instead of the promise itself. As a result, the call to the passed callback is delayed until the promise resolves.
 * If the promise rejects, the passed callback is skipped.
 *
 * #### Chains
 *
 * If multiple callbacks are passed, they are called subsequently. `apply(x, a, b)` is equivalent to
 * `apply(apply(x, a), b)`.
 */
	apply =
	build(
		'apply',
		function applyLogic(value, callback, /* This is never provided, thus initially undefined → */ then) {
			// Call the callback and check whether the result is promise-like.
			return (then = takeThen(callback.call(this, value)))
				// If the result is promise-like, chain a function to it which will return the value, then return that chain.
				? then(() => value)
				// If the result is not promise-like, return the value.
				: value;
		}
	);