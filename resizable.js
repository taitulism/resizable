/* eslint-disable indent, no-magic-numbers */

export default function resizable (elm, opts) {
	return new Resizable(elm, opts);
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
		name: 'top',
		cursor: 'n',
		position: 'top',
		isCorner: false,
		isXAxis: false,
		isYAxis: true,
	},

	[direction.right]: {
		name: 'right',
		cursor: 'e',
		position: 'right',
		isCorner: false,
		isXAxis: true,
		isYAxis: false,
	},

	[direction.bottom]: {
		name: 'bottom',
		cursor: 's',
		position: 'bottom',
		isCorner: false,
		isXAxis: false,
		isYAxis: true,
	},

	[direction.left]: {
		name: 'left',
		cursor: 'w',
		position: 'left',
		isCorner: false,
		isXAxis: true,
		isYAxis: false,
	},

	[direction.topLeft]: {
		name: 'top-left',
		cursor: 'nw',
		position: ['top', 'left'],
		isCorner: true,
	},

	[direction.topRight]: {
		name: 'top-right',
		cursor: 'ne',
		position: ['top', 'right'],
		isCorner: true,
	},

	[direction.bottomRight]: {
		name: 'bottom-right',
		cursor: 'se',
		position: ['bottom', 'right'],
		isCorner: true,
	},

	[direction.bottomLeft]: {
		name: 'bottom-left',
		cursor: 'sw',
		position: ['bottom', 'left'],
		isCorner: true,
	},
};

function getGripCreator (gripSize) {
	const gripSizePx = gripSize + 'px';
	const gripOffset = (gripSize / 2 * -1) + 'px';

	return function createGrip (gripDefKey) {
		const {
			name,
			cursor,
			position,
			isCorner,
			isXAxis,
			isYAxis,
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

		return grip;
	};
}

function Resizable (elm, opts = {}) {
	this.minWidth = opts.minWidth || 0;
	this.minHeight = opts.minHeight || 0;
	this.startMouseX = 0;
	this.startMouseY = 0;
	this.gripMoveHandler = null;
	this.elm = elm;
	this.isResizable = true;
	this.originalPosition = elm.style.position || null;

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
	this.onDragStart = this.onDragStart.bind(this);

	this.onDraggingTopLeft = this.onDraggingTopLeft.bind(this);
	this.onDraggingTopRight = this.onDraggingTopRight.bind(this);
	this.onDraggingBottomRight = this.onDraggingBottomRight.bind(this);
	this.onDraggingBottomLeft = this.onDraggingBottomLeft.bind(this);

	this.onDrop = this.onDrop.bind(this);
};

Resizable.prototype.initGrips = function initGrips (gripSize, gripDirection) {
	const createGrip = getGripCreator(gripSize || 10);

	if (gripDirection) {
		this.grip = createGrip(direction[gripDirection]);
	}
	else {
		this.topLeftGrip = createGrip(direction.topLeft);
		this.topRightGrip = createGrip(direction.topRight);
		this.bottomRightGrip = createGrip(direction.bottomRight);
		this.bottomLeftGrip = createGrip(direction.bottomLeft);
	}

	this.forEachGrip((grip) => {
		grip.addEventListener('mousedown', this.onDragStart);
		this.elm.appendChild(grip);
	});
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

Resizable.prototype.onDragStart = function onDragStart (ev) {
	if (!this.isResizable) return;

	this.startMouseX = ev.clientX;
	this.startMouseY = ev.clientY;

	this.box = this.elm.getBoundingClientRect();
	this.elm.classList.add('grabbed');

	this.bindDraggingHandler(ev.target.classList);
	document.addEventListener('mouseup', this.onDrop);
	this.events.startResize.forEach(cb => cb(ev));
};

Resizable.prototype.bindDraggingHandler = function bindDraggingHandler (classList) {
	if (classList.contains('top-left-grip')) {
		this.gripHandler = this.onDraggingTopLeft;
		document.addEventListener('mousemove', this.onDraggingTopLeft);
	}
	else if (classList.contains('top-right-grip')) {
		this.gripHandler = this.onDraggingTopRight;
		document.addEventListener('mousemove', this.onDraggingTopRight);
	}
	else if (classList.contains('bottom-right-grip')) {
		this.gripHandler = this.onDraggingBottomRight;
		document.addEventListener('mousemove', this.onDraggingBottomRight);
	}
	else if (classList.contains('bottom-left-grip')) {
		this.gripHandler = this.onDraggingBottomLeft;
		document.addEventListener('mousemove', this.onDraggingBottomLeft);
	}
};

Resizable.prototype.onDraggingTopLeft = function onDraggingTopLeft (ev) {
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
};

Resizable.prototype.onDraggingTopRight = function onDraggingTopRight (ev) {
	const mouseMovedX = ev.clientX - this.startMouseX;
	const mouseMovedY = this.startMouseY - ev.clientY;

	const width = Math.max(this.minWidth, this.box.width + mouseMovedX);
	const height = Math.max(this.minHeight, this.box.height + mouseMovedY);

	this.elm.style.width = width + 'px';
	this.elm.style.height = height + 'px';
	this.elm.style.top = this.box.top - Math.max(mouseMovedY, (this.box.height - this.minHeight) * -1) + 'px';

	this.elm.classList.replace('grabbed', 'resizing');

	this.events.resizing.forEach(cb => cb(ev, { width, height }));
};

Resizable.prototype.onDraggingBottomRight = function onDraggingBottomRight (ev) {
	const mouseMovedX = ev.clientX - this.startMouseX;
	const mouseMovedY = ev.clientY - this.startMouseY;

	const width = Math.max(this.minWidth, this.box.width + mouseMovedX);
	const height = Math.max(this.minHeight, this.box.height + mouseMovedY);

	this.elm.style.width = width + 'px';
	this.elm.style.height = height + 'px';

	this.elm.classList.replace('grabbed', 'resizing');
	this.events.resizing.forEach(cb => cb(ev, { width, height }));
};

Resizable.prototype.onDraggingBottomLeft = function onDraggingBottomLeft (ev) {
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
};

Resizable.prototype.onDrop = function onDrop (ev) {
	this.elm.classList.remove('grabbed', 'resizing');

	document.removeEventListener('mousemove', this.gripHandler);
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
	this.forEachGrip((grip) => {
		grip.removeEventListener('mousedown', this.onDragStart);
	});

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
	this.forEachGrip((grip) => {
		this.elm.removeChild(grip);
	});
	this.topLeftGrip = null;
	this.topRightGrip = null;
	this.bottomRightGrip = null;
	this.bottomLeftGrip = null;
};
