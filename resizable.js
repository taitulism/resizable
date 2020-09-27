/* eslint-disable indent, no-magic-numbers */

export default function resizable (elm, opts) {
	return new Resizable(elm, opts);
}

function bindListener (elm, eventName, callback) {
	elm.addEventListener(eventName, callback, false);

	return function off () {
		elm.removeEventListener(eventName, callback, false);
	};
}

const direction = {
	top: 0,
	right: 1,
	bottom: 2,
	left: 3,
	topLeft: 4,
	topRight: 5,
	bottomRight: 6,
	bottomLeft: 7,
};

const gripsDefinitions = {
	[direction.top]: {
		propName: 'grip',
		name: 'top',
		cursor: 'n',
		position: 'top',
		isCorner: false,
		isXAxis: false,
		isYAxis: true,
	},

	[direction.right]: {
		propName: 'grip',
		name: 'right',
		cursor: 'e',
		position: 'right',
		isCorner: false,
		isXAxis: true,
		isYAxis: false,
	},

	[direction.bottom]: {
		propName: 'grip',
		name: 'bottom',
		cursor: 's',
		position: 'bottom',
		isCorner: false,
		isXAxis: false,
		isYAxis: true,
	},

	[direction.left]: {
		propName: 'grip',
		name: 'left',
		cursor: 'w',
		position: 'left',
		isCorner: false,
		isXAxis: true,
		isYAxis: false,
	},

	[direction.topLeft]: {
		propName: 'topLeftGrip',
		name: 'top-left',
		cursor: 'nw',
		position: ['top', 'left'],
		isCorner: true,
		moveHandler (ev) {
			const mouseMovedX = this.startMouseX - ev.clientX;
			const mouseMovedY = this.startMouseY - ev.clientY;

			const width = Math.max(this.minWidth, this.box.width + mouseMovedX);
			const height = Math.max(this.minHeight, this.box.height + mouseMovedY);

			this.elm.style.width = width + 'px';
			this.elm.style.height = height + 'px';
			this.elm.style.top = this.box.top - Math.max(mouseMovedY, (this.box.height - this.minHeight) * -1) + 'px';
			this.elm.style.left = this.box.left - Math.max(mouseMovedX, (this.box.width - this.minWidth) * -1) + 'px';

			this.elm.classList.replace('grabbed', 'resizing');
			this.events.resizing.forEach(cb => cb(ev, { width, height }));
		}
	},

	[direction.topRight]: {
		propName: 'topRightGrip',
		name: 'top-right',
		cursor: 'ne',
		position: ['top', 'right'],
		isCorner: true,
		moveHandler (ev) {
			const mouseMovedX = ev.clientX - this.startMouseX;
			const mouseMovedY = this.startMouseY - ev.clientY;

			const width = Math.max(this.minWidth, this.box.width + mouseMovedX);
			const height = Math.max(this.minHeight, this.box.height + mouseMovedY);

			this.elm.style.width = width + 'px';
			this.elm.style.height = height + 'px';
			this.elm.style.top = this.box.top - Math.max(mouseMovedY, (this.box.height - this.minHeight) * -1) + 'px';

			this.elm.classList.replace('grabbed', 'resizing');

			this.events.resizing.forEach(cb => cb(ev, { width, height }));
		}
	},

	[direction.bottomRight]: {
		propName: 'bottomRightGrip',
		name: 'bottom-right',
		cursor: 'se',
		position: ['bottom', 'right'],
		isCorner: true,
		moveHandler (ev) {
			const mouseMovedX = ev.clientX - this.startMouseX;
			const mouseMovedY = ev.clientY - this.startMouseY;

			const width = Math.max(this.minWidth, this.box.width + mouseMovedX);
			const height = Math.max(this.minHeight, this.box.height + mouseMovedY);

			this.elm.style.width = width + 'px';
			this.elm.style.height = height + 'px';

			this.elm.classList.replace('grabbed', 'resizing');
			this.events.resizing.forEach(cb => cb(ev, { width, height }));
		}
	},

	[direction.bottomLeft]: {
		propName: 'bottomLeftGrip',
		name: 'bottom-left',
		cursor: 'sw',
		position: ['bottom', 'left'],
		isCorner: true,
		moveHandler (ev) {
			const mouseMovedX = this.startMouseX - ev.clientX;
			const mouseMovedY = ev.clientY - this.startMouseY;

			const width = Math.max(this.minWidth, this.box.width + mouseMovedX);
			const height = Math.max(this.minHeight, this.box.height + mouseMovedY);

			this.elm.style.width = width + 'px';
			this.elm.style.height = height + 'px';
			this.elm.style.left = this.box.left - Math.max(mouseMovedX, (this.box.width - this.minWidth) * -1) + 'px';
			this.elm.style.bottom = this.box.bottom - Math.max(mouseMovedY, this.box.height * -1) + 'px';

			this.elm.classList.replace('grabbed', 'resizing');
			this.events.resizing.forEach(cb => cb(ev, { width, height }));
		}
	},
};

function getGripCreator (gripSize) {
	const gripSizePx = gripSize + 'px';
	const gripOffset = (gripSize / 2 * -1) + 'px';

	return function createGrip (gripDefKey) {
		const {
			propName,
			name,
			cursor,
			position,
			isCorner,
			isXAxis,
			isYAxis,
			moveHandler,
		} = gripsDefinitions[gripDefKey];

		const grip = document.createElement('div');
		const gripStyle = grip.style;
		const gripClassname = `${name}-grip`;

		gripStyle.position = 'absolute';
		gripStyle.width = isYAxis ? '100%' : gripSizePx;
		gripStyle.height = isXAxis ? '100%' : gripSizePx;
		gripStyle.cursor = `${cursor}-resize`;
		gripStyle.borderRadius = gripSizePx;
		gripStyle.opacity = '0';

		if (isCorner) {
			position.forEach((pos) => {
				gripStyle[pos] = gripOffset;
			});
		}
		else {
			gripStyle[position] = gripOffset;
		}

		grip.classList.add('resize-grip', gripClassname);

		return {elm: grip, moveHandler, propName};
	};
}

function Resizable (elm, opts = {}) {
	this.minWidth = opts.minWidth || 0;
	this.minHeight = opts.minHeight || 0;
	this.startMouseX = 0;
	this.startMouseY = 0;
	this.elm = elm;
	this.isResizable = true;
	this.originalPosition = elm.style.position || null;
	this.destructionQueue = [];
	this.unbindMouseMove = null;

	this.events = {
		startResize: [],
		resizing: [],
		stopResize: [],
	};

	this.initMethods();
	this.initGrips(opts.gripSize, opts.direction);
	this.initElm(elm);
}

Resizable.prototype.initMethods = function initMethods () {
	this.onResizeStart = this.onResizeStart.bind(this);
	this.onDrop = this.onDrop.bind(this);
};

Resizable.prototype.initGrips = function initGrips (gripSize, gripDirection) {
	const createGrip = getGripCreator(gripSize || 10);

	if (gripDirection) {
		const {propName, elm, moveHandler} = createGrip(direction[gripDirection]);
		this[propName] = elm;
		this.elm.appendChild(elm);

		const unbind = bindListener(elm, 'mousedown', (ev) => {
			this.onResizeStart(ev, moveHandler);
		});

		this.destructionQueue.push(unbind);
	}
	else {
		[
			direction.topLeft,
			direction.topRight,
			direction.bottomRight,
			direction.bottomLeft,
		].forEach((gripDir) => {
			const {propName, elm, moveHandler} = createGrip(gripDir);
			this[propName] = elm;
			this.elm.appendChild(elm);

			const unbind = bindListener(elm, 'mousedown', (ev) => {
				this.onResizeStart(ev, moveHandler);
			});

			this.destructionQueue.push(unbind);
		});
	}
};

Resizable.prototype.initElm = function initElm (elm) {
	const position = elm.style.position || window.getComputedStyle(elm).position;
	const box = elm.getBoundingClientRect();

	if (position !== 'absolute') {
		elm.style.position = 'absolute';
		elm.style.top = box.top + 'px';
		elm.style.left = box.left + 'px';
	}

	if (box.width < this.minWidth) {
		elm.style.width = this.minWidth + 'px';
	}

	if (box.height < this.minHeight) {
		elm.style.height = this.minHeight + 'px';
	}

	elm.classList.add('resizable');
};

Resizable.prototype.showGrips = function showGrips () {
	this.forEachGrip((grip) => {
		grip.style.opacity = '1';
	});
};

Resizable.prototype.hideGrips = function hideGrips () {
	this.forEachGrip((grip) => {
		grip.style.opacity = '0';
	});
};

Resizable.prototype.forEachGrip = function forEachGrip (callback) {
	if (this.grip) {
		callback(this.grip);
	}
	else {
		callback(this.topLeftGrip);
		callback(this.topRightGrip);
		callback(this.bottomRightGrip);
		callback(this.bottomLeftGrip);
	}
};

Resizable.prototype.on = function on (eventName, callback) {
	const lowerEventName = eventName.toLowerCase();
	if (lowerEventName.includes('start')) {
		this.events.startResize.push(callback);
	}
	else if (lowerEventName.includes('ing')) {
		this.events.resizing.push(callback);
	}
	else if (lowerEventName.includes('end') || lowerEventName.includes('stop')) {
		this.events.stopResize.push(callback);
	}
	return this;
};

Resizable.prototype.onResizeStart = function onResizeStart (ev, moveHandler) {
	if (!this.isResizable) return;

	this.startMouseX = ev.clientX;
	this.startMouseY = ev.clientY;

	this.box = this.elm.getBoundingClientRect();
	this.elm.classList.add('grabbed');

	this.unbindMouseMove && this.unbindMouseMove();
	this.unbindMouseMove = bindListener(document, 'mousemove', (moveEvent) => {
		moveHandler.call(this, moveEvent);
		moveEvent.preventDefault();
	});

	document.addEventListener('mouseup', this.onDrop);
	this.events.startResize.forEach(cb => cb(ev));
};

Resizable.prototype.onDrop = function onDrop (ev) {
	this.elm.classList.remove('grabbed', 'resizing');
	this.unbindMouseMove();
	this.unbindMouseMove = null;
	document.removeEventListener('mouseup', this.onDrop);

	this.box = null;
	const newBox = this.elm.getBoundingClientRect();
	this.events.stopResize.forEach(cb => cb(ev, newBox));
};

Resizable.prototype.disable = function disable () {
	this.isResizable = false;
	this.elm.classList.add('resize-disabled');
	this.forEachGrip((grip) => {
		grip.style.display = 'none';
	});
	return this;
};

Resizable.prototype.enable = function enable () {
	this.isResizable = true;
	this.elm.classList.remove('resize-disabled');
	this.forEachGrip((grip) => {
		grip.style.display = '';
	});
	return this;
};

Resizable.prototype.destroy = function destroy () {
	this.destroyGrips();

	this.elm.classList.remove('resizable', 'resizing');
	if (this.originalPosition) {
		this.elm.style.position = this.originalPosition;
	}

	this.events = null;
	this.elm = null;
};

Resizable.prototype.destroyGrips = function destroyGrips () {
	this.hideGrips();
	this.destructionQueue.forEach(callback => callback());
	this.forEachGrip((grip) => {
		this.elm.removeChild(grip);
	});
	this.topLeftGrip = null;
	this.topRightGrip = null;
	this.bottomRightGrip = null;
	this.bottomLeftGrip = null;
};
