/**
 * Returns the `then` property of the passed input, bound to the passed input, if said passed input is promise-like.
 * Returns a falsy value (specifically `undefined` or `false`) otherwise.
 *
 * An input is considered promise-like if it has a `then` property which can be retrieved and is a function.
 */
export default function takeThen(input, /* This is never provided, thus initially undefined → */ then) {
	// Return undefined if the input is null-ish. The try-catch below would cause undefined to be returned for those
	// inputs anyway, making this if block technically redundant. However, it does speed up this function significantly
	// for those inputs. See https://github.com/Pimm/ruply/issues/2.
	if (null == input) {
		return /* undefined */;
	}
	// Return undefined if retrieving the then property causes an error to be thrown. Since the promise awareness is
	// somewhat of a hidden feature of this library, it should operate as unintrusive as possible.
	try {
		({ then } = input);
	} catch (error) {
		return /* undefined */;
	}
	// return 'function' == typeof then ? then.bind(input) : false;
	//   ↓
	return 'function' == typeof then && then.bind(input);
}