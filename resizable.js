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
	this.onDragStart = this.onDragStart.bind(this);
	this.onDraggingTopLeft = this.onDraggingTopLeft.bind(this);
	this.onDraggingTopRight = this.onDraggingTopRight.bind(this);
	this.onDraggingBottomRight = this.onDraggingBottomRight.bind(this);
	this.onDraggingBottomLeft = this.onDraggingBottomLeft.bind(this);
	this.onDrop = this.onDrop.bind(this);

	this.startMouseX = 0;
	this.startMouseY = 0;
	this.boundDirection = null;
	this.gripMoveHandler = null;
	this.box = elm.getBoundingClientRect();
	this.elm = elm;
	this.gripSize = 10;
	this.gripOffset = this.gripSize / 2 * -1;

	this.topLeftGrip = this.createGrip('top-left-grip');
	this.topRightGrip = this.createGrip('top-right-grip');
	this.bottomRightGrip = this.createGrip('bottom-right-grip');
	this.bottomLeftGrip = this.createGrip('bottom-left-grip');
}

Resizable.prototype.createGrip = function (className) {
	const grip = document.createElement('div');
	grip.classList.add('resizable-grip', className);
	grip.style.position = 'absolute';
	grip.style.width = this.gripSize + 'px';
	grip.style.height = this.gripSize + 'px';
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
};

Resizable.prototype.on = function (eventName, callback) {
	this.events[eventName].push(callback);
};

Resizable.prototype.onDragStart = function (ev) {
	this.startMouseX = ev.clientX;
	this.startMouseY = ev.clientY;

	this.bindDraggingHandler(ev.target.classList);
	document.addEventListener('mouseup', this.onDrop);
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

	this.elm.style.width = this.box.width + mouseMovedX + 'px';
	this.elm.style.height = this.box.height + mouseMovedY + 'px';
	this.elm.style.top = this.box.top - Math.max(mouseMovedY, this.box.height * -1) + 'px';
	this.elm.style.left = this.box.left - Math.max(mouseMovedX, this.box.width * -1) + 'px';
};

Resizable.prototype.onDraggingTopRight = function (ev) {
	const mouseMovedX = ev.clientX - this.startMouseX;
	const mouseMovedY = this.startMouseY - ev.clientY;

	this.elm.style.width = this.box.width + mouseMovedX + 'px';
	this.elm.style.height = this.box.height + mouseMovedY + 'px';
	this.elm.style.top = this.box.top - Math.max(mouseMovedY, this.box.height * -1) + 'px';
};

Resizable.prototype.onDraggingBottomRight = function (ev) {
	const mouseMovedX = ev.clientX - this.startMouseX;
	const mouseMovedY = ev.clientY - this.startMouseY;

	this.elm.style.width = this.box.width + mouseMovedX + 'px';
	this.elm.style.height = this.box.height + mouseMovedY + 'px';
};

Resizable.prototype.onDraggingBottomLeft = function (ev) {
	const mouseMovedX = this.startMouseX - ev.clientX;
	const mouseMovedY = ev.clientY - this.startMouseY;

	this.elm.style.width = this.box.width + mouseMovedX + 'px';
	this.elm.style.height = this.box.height + mouseMovedY + 'px';
	this.elm.style.left = this.box.left - Math.max(mouseMovedX, this.box.width * -1) + 'px';
	this.elm.style.bottom = this.box.bottom - Math.max(mouseMovedY, this.box.height * -1) + 'px';
};

Resizable.prototype.onDrop = function (ev) {
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
};

Resizable.prototype.destroy = function () {
	this.elm.removeEventListener('mousedown', this.onDragStart);
	document.removeEventListener('mousemove', this.onDragging);
};
