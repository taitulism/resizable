const createEvent = (type, props = {}) => {
	const event = new window.Event(type, {bubbles: true});
	Object.assign(event, props);
	return event;
};

export function simulateMouseEnter (elm, x, y) {
	const event = createEvent('mouseenter', {
		clientX: x || 0,
		clientY: y || 0,
	});
	elm.dispatchEvent(event);
}

export function simulateMouseLeave (elm, x, y) {
	const event = createEvent('mouseleave', {
		clientX: x || 0,
		clientY: y || 0,
	});
	elm.dispatchEvent(event);
}

export function simulateMouseDown (elm, x, y) {
	const event = createEvent('mousedown', {
		clientX: x || 0,
		clientY: y || 0,
	});
	elm.dispatchEvent(event);
}

export function simulateMouseMove (elm, x, y) {
	const event = createEvent('mousemove', {
		clientX: x || 0,
		clientY: y || 0,
	});

	elm.dispatchEvent(event);
}

export function simulateMouseUp (elm, x, y) {
	const event = createEvent('mouseup', {
		clientX: x || 0,
		clientY: y || 0,
	});

	elm.dispatchEvent(event);
}

export function simulateDragNDrop (elm, moveX, moveY) {
	simulateMouseDown(elm, 0, 0);
	simulateMouseMove(elm, moveX, moveY);
	simulateMouseUp(elm, moveX, moveY);
}

export function createTarget () {
	const target = document.createElement('div');
	target.id = 'target';
	target.style.width = '100px';
	target.style.height = '100px';
	target.style.backgroundColor = 'pink';

	return target;
}
