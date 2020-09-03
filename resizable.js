/* module.exports =  */function resizable(elm, opts) {
	return new Resizable(elm, opts);
};

const direction = {
	topLeft: 0,
	topRight: 1,
	btmRight: 2,
	btmLeft: 3,
};

function Resizable(elm, opts = {}) {
	this.showGrips = this.showGrips.bind(this);
	this.hideGrips = this.hideGrips.bind(this);
	this.onDragStart = this.onDragStart.bind(this);
	this.onDraggingTopLeft = this.onDraggingTopLeft.bind(this);
	this.onDraggingTopRight = this.onDraggingTopRight.bind(this);
	this.onDraggingBottomRight = this.onDraggingBottomRight.bind(this);
	this.onDraggingBottomLeft = this.onDraggingBottomLeft.bind(this);
	this.onDrop = this.onDrop.bind(this);

	this.minWidth = opts.minWidth || 0;
	this.minHeight = opts.minHeight || 0;
	this.startMouseX = 0;
	this.startMouseY = 0;
	this.boundDirection = null;
	this.gripMoveHandler = null;
	this.box = elm.getBoundingClientRect();
	this.elm = elm;
	this.isResizable = true;
	this.gripSize = opts.gripSize || 10;
	this.gripOffset = this.gripSize / 2 * -1;
	this.events = {resizing: [], newSize: []};
	this.originalPosition = elm.style.position || null;

	this.topLeftGrip = this.createGrip('top-left-grip');
	this.topRightGrip = this.createGrip('top-right-grip');
	this.bottomRightGrip = this.createGrip('bottom-right-grip');
	this.bottomLeftGrip = this.createGrip('bottom-left-grip');

	const position = elm.style.position || window.getComputedStyle(elm).position;

	if (position !== 'absolute') {
		elm.style.position = 'absolute';
		elm.style.top = this.box.top + 'px';
		elm.style.left = this.box.left + 'px';
	}

	elm.classList.add('resizable');

	this.bindToggleGrips();
}

Resizable.prototype.bindToggleGrips = function () {
	this.elm.addEventListener('mouseenter', this.showGrips);
	this.elm.addEventListener('mouseleave', this.hideGrips);

	this.forEachGrip((grip) => {
		grip.addEventListener('mouseenter', this.showGrips);
		grip.addEventListener('mouseleave', this.hideGrips);
	});
};

Resizable.prototype.unbindToggleGrips = function () {
	this.elm.removeEventListener('mouseenter', this.showGrips);
	this.elm.removeEventListener('mouseleave', this.hideGrips);
};

Resizable.prototype.showGrips = function () {
	this.forEachGrip((grip) => {
		grip.style.opacity = '1';
	});
};

Resizable.prototype.hideGrips = function () {
	this.forEachGrip((grip) => {
		grip.style.opacity = '0';
	});
};

Resizable.prototype.createGrip = function (className) {
	const grip = document.createElement('div');
	grip.classList.add('resizable-grip', className);
	grip.style.position = 'absolute';
	grip.style.width = this.gripSize + 'px';
	grip.style.height = this.gripSize + 'px';
	grip.style.borderRadius = this.gripSize + 'px';
	grip.style.opacity = '0';
	grip.addEventListener('mousedown', this.onDragStart);

	grip.style.backgroundColor = 'green';

	switch (className) {
		case 'top-left-grip':
			grip.style.top = this.gripOffset + 'px';
			grip.style.left = this.gripOffset + 'px';
			break;
		case 'top-right-grip':
			grip.style.top = this.gripOffset + 'px';
			grip.style.right = this.gripOffset + 'px';
			break;
		case 'bottom-right-grip':
			grip.style.bottom = this.gripOffset + 'px';
			grip.style.right = this.gripOffset + 'px';
			break;
		case 'bottom-left-grip':
			grip.style.bottom = this.gripOffset + 'px';
			grip.style.left = this.gripOffset + 'px';
			break;
	}

	this.elm.appendChild(grip);

	return grip;
};

Resizable.prototype.forEachGrip = function (callback) {
	callback(this.topLeftGrip);
	callback(this.topRightGrip);
	callback(this.bottomRightGrip);
	callback(this.bottomLeftGrip);
};

Resizable.prototype.on = function (eventName, callback) {
	this.events[eventName].push(callback);
};

Resizable.prototype.onDragStart = function (ev) {
	if (!this.isResizable) return;
	this.startMouseX = ev.clientX;
	this.startMouseY = ev.clientY;

	this.elm.classList.add('resizing');

	this.bindDraggingHandler(ev.target.classList);
	document.addEventListener('mouseup', this.onDrop);
	this.events.resizing.forEach(cb => cb(ev));
};

Resizable.prototype.bindDraggingHandler = function (classList) {
	if (classList.contains('top-left-grip')) {
		this.boundDirection = direction.topLeft;
		document.addEventListener('mousemove', this.onDraggingTopLeft);
	}
	else if (classList.contains('top-right-grip')) {
		this.boundDirection = direction.topRight;
		document.addEventListener('mousemove', this.onDraggingTopRight);
	}
	else if (classList.contains('bottom-right-grip')) {
		this.boundDirection = direction.btmRight;
		document.addEventListener('mousemove', this.onDraggingBottomRight);
	}
	else if (classList.contains('bottom-left-grip')) {
		this.boundDirection = direction.btmLeft;
		document.addEventListener('mousemove', this.onDraggingBottomLeft);
	}
};

Resizable.prototype.onDraggingTopLeft = function (ev) {
	const mouseMovedX = this.startMouseX - ev.clientX;
	const mouseMovedY = this.startMouseY - ev.clientY;

	this.elm.style.width = Math.max(this.minWidth, this.box.width + mouseMovedX) + 'px';
	this.elm.style.height = Math.max(this.minHeight, this.box.height + mouseMovedY) + 'px';
	this.elm.style.top = this.box.top - Math.max(mouseMovedY, (this.box.height - this.minHeight) * -1) + 'px';
	this.elm.style.left = this.box.left - Math.max(mouseMovedX, (this.box.width - this.minWidth) * -1) + 'px';
};

Resizable.prototype.onDraggingTopRight = function (ev) {
	const mouseMovedX = ev.clientX - this.startMouseX;
	const mouseMovedY = this.startMouseY - ev.clientY;

	this.elm.style.width = Math.max(this.minWidth, this.box.width + mouseMovedX) + 'px';
	this.elm.style.height = Math.max(this.minHeight, this.box.height + mouseMovedY) + 'px';
	this.elm.style.top = this.box.top - Math.max(mouseMovedY, (this.box.height - this.minHeight) * -1) + 'px';
};

Resizable.prototype.onDraggingBottomRight = function (ev) {
	const mouseMovedX = ev.clientX - this.startMouseX;
	const mouseMovedY = ev.clientY - this.startMouseY;

	this.elm.style.width = Math.max(this.minWidth, this.box.width + mouseMovedX) + 'px';
	this.elm.style.height = Math.max(this.minHeight, this.box.height + mouseMovedY) + 'px';
};

Resizable.prototype.onDraggingBottomLeft = function (ev) {
	const mouseMovedX = this.startMouseX - ev.clientX;
	const mouseMovedY = ev.clientY - this.startMouseY;

	this.elm.style.width = Math.max(this.minWidth, this.box.width + mouseMovedX) + 'px';
	this.elm.style.height = Math.max(this.minHeight, this.box.height + mouseMovedY) + 'px';
	this.elm.style.left = this.box.left - Math.max(mouseMovedX, (this.box.width - this.minWidth) * -1) + 'px';
	this.elm.style.bottom = this.box.bottom - Math.max(mouseMovedY, this.box.height * -1) + 'px';
};

Resizable.prototype.onDrop = function (ev) {
	this.elm.classList.remove('resizing');

	let gripHandler;
	switch (this.boundDirection) {
		case direction.topLeft:
			gripHandler = this.onDraggingTopLeft;
			break;

		case direction.topRight:
			gripHandler = this.onDraggingTopRight;
			break;

		case direction.btmRight:
			gripHandler = this.onDraggingBottomRight;
			break;

		case direction.btmLeft:
			gripHandler = this.onDraggingBottomLeft;
			break;
	}

	document.removeEventListener('mousemove', gripHandler);
	document.removeEventListener('mouseup', this.onDrop);

	this.boundDirection = null;
	this.box = this.elm.getBoundingClientRect();
	this.events.newSize.forEach(cb => cb(ev));
};

Resizable.prototype.disable = function () {
	this.isResizable = false;
	this.elm.classList.add('resize-disabled');
};

Resizable.prototype.enable = function () {
	this.isResizable = true;
	this.elm.classList.remove('resize-disabled');
};

Resizable.prototype.destroy = function () {
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

Resizable.prototype.destroyGrips = function () {
	this.hideGrips();
	this.unbindToggleGrips();
	this.forEachGrip((grip) => {
		this.elm.removeChild(grip);
	});
	this.topLeftGrip = null;
	this.topRightGrip = null;
	this.bottomRightGrip = null;
	this.bottomLeftGrip = null;
};
