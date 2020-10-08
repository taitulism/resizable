export default function bindListener (elm, eventName, callback) {
	elm.addEventListener(eventName, callback, false);

	return function off () {
		elm.removeEventListener(eventName, callback, false);
	};
}
