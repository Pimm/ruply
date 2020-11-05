/**
 * Returns whether the passed input is thenable (`true`) or not (`false`).
 */
export default function checkThenable(input) {
	// Promises/A+ defines a thenable as "an object or function that defines a then method."
	// Note that this function does not check whether the input is an object or function. It would be fooled by a string
	// if String.prototype.then is set.
	// Also note that this function returns false if then is a getter which throws. One could argue that that is the
	// desired behaviour, but it might hide underlying issues.
	try {
		var { then } = input;
	} catch (error) {
		return false;
	}
	return 'function' == typeof then;
}