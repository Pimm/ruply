/**
 * Returns the bound `then` method of the passed object, if it exists and accessing it does not throw.
 * These conditions qualify the object as thenable.
 * If it does not qualify, it returns undefined.
 */
export default function getValidThen(input) {
	// Promises/A+ defines a thenable as "an object or function that defines a then method."
	// Note that this function does not check whether the input is an object or function. It would be fooled by a string
	// if String.prototype.then is set.
	// It does however compare to nullish, as this is a shortcut to avoid unnecessary catches, which may result in slow performance
	// See https://github.com/Pimm/ruply/issues/2
	// Also note that this function returns `undefined` if then is a getter which throws. One could argue that that is the
	// desired behaviour, but it might hide underlying issues.
	if (null == input) {
		return;
	}
	try {
		var { then } = input;
	} catch (error) {
		return;
	}
	if ('function' != typeof then) {
		return;
	}
	return then.bind(input);
}
