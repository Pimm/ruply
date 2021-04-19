import checkThenable from './checkThenable';

// Steal the splice function from this empty array.
const { splice } = [];
/**
 * Builds a ruply function from the passed logic.
 */
function build(name, logic, skipIfNullish) {
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
			valueAndCallbacks = arguments;
		var result;
		// If the value is thenable, recall this function (recursively) once it resolves.
		if (checkThenable(value)) {
			return value.then(value => {
				// const [_, ...callbacks] = arguments;
				// return implementation.call(context, value, ...callbacks);
				//   ↓
				valueAndCallbacks[0] = value;
				return implementation.apply(context, valueAndCallbacks);
			});
		}
		// Apply the logic, passing the callback if skipIfNullish is not set or the value is not null-ish.
		result = logic.call(context, value, (skipIfNullish && null == value) ? undefined : callback);
		// If there are other callbacks (callbacks other than the one from the line above), recall this function
		// (recursively) with the new value.
		if (valueAndCallbacks.length > 2) {
			// const [_, firstCallback, ...otherCallbacks] = arguments;
			// return implementation.call(context, result, ...otherCallbacks);
			//   ↓
			splice.call(valueAndCallbacks, 0, 2, result);
			return implementation.apply(context, valueAndCallbacks);
		// If there are no more callbacks, return the value.
		} else /* if (2 == valueAndCallbacks.length) */ {
			return result;
		}
	};
	// Give the resulting function the appropriate name.
	return Object.defineProperty(implementation, 'name', {
		value: name,
		/* writable: false, */
		/* enumerable: false, */
		configurable: true
	});
}
const runLogic = function(value, callback) {
	return callback ? callback.call(this, value) : value;
};
const applyLogic = function(value, callback, result) {
	if (
		// If the callback is undefined, return the value directly…
		callback
		// …otherwise call the callback. If the result of the callback is thenable, chain a function to it which will
		// return the value, and return the chain.
		&& checkThenable(
			result = callback.call(this, value)
		)
		// (The truthy check above is safe, as the callback can only be undefined or a function at this point.)
	) {
		return result.then(() => value);
	}
	return value;
};
/**
 * Calls the passed callback, forwarding the value and routing back whatever is returned.
 */
export const run = build('run', runLogic /* , undefined */),
/**
 * Calls the passed callback ‒ forwarding the value and routing back whatever is returned ‒ if the passed value is not
 * null-ish. If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
	runIf = build('runIf', runLogic, true),
/**
 * Calls the passed callback, forwarding the value and returning it afterwards.
 */
	apply = build('apply', applyLogic /* , undefined */),
/**
 * Calls the passed callback ‒ forwarding the value and returning it afterwards ‒ if the passed value is not null-ish.
 * If the passed value is null-ish, it is returned directly and the passed callback is skipped.
 */
	applyIf = build('applyIf', applyLogic, true);