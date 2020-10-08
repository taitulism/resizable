/* eslint-disable indent, no-magic-numbers */
import getGripCreator from './get-grip-creator';
import bindListener from './bind-listener';
import {direction} from './grips-definitions';

const px = 'px';

export default function Resizable (elm, opts = {}) {
	this.minWidth = opts.minWidth || 0;
	this.minHeight = opts.minHeight || 0;
	this.elm = elm;
	this.isResizable = true;
	this.originalPosition = elm.style.position || null;
	this.destructionQueue = [];
	this.unbindMouseMove = null;
	this.grip = null;
	this.grips = {};

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
		const {elm, moveHandler} = createGrip(direction[gripDirection]);
		this.grip = elm;
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
			this.grips[propName] = elm;
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
		elm.style.top = box.top + px;
		elm.style.left = box.left + px;
	}

	if (box.width < this.minWidth) {
		elm.style.width = this.minWidth + px;
	}

	if (box.height < this.minHeight) {
		elm.style.height = this.minHeight + px;
	}

	elm.classList.add('resizable');
};

Resizable.prototype.showGrips = function showGrips () {
	return this.forEachGrip((grip) => {
		grip.style.opacity = '1';
	});
};

Resizable.prototype.hideGrips = function hideGrips () {
	return this.forEachGrip((grip) => {
		grip.style.opacity = '0';
	});
};

Resizable.prototype.forEachGrip = function forEachGrip (callback) {
	if (this.grip) {
		callback(this.grip);
	}
	else {
		callback(this.grips.topLeft);
		callback(this.grips.topRight);
		callback(this.grips.bottomRight);
		callback(this.grips.bottomLeft);
	}

	return this;
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

Resizable.prototype.onResizeStart = function onResizeStart (startEvent, moveHandler) {
	if (!this.isResizable) return;

	const startMouseX = startEvent.clientX;
	const startMouseY = startEvent.clientY;

	const startBox = this.elm.getBoundingClientRect();
	this.elm.classList.add('grabbed');

	this.unbindMouseMove && this.unbindMouseMove();
	this.unbindMouseMove = bindListener(document, 'mousemove', (moveEvent) => {
		const XDiff = moveEvent.clientX - startMouseX;
		const YDiff = moveEvent.clientY - startMouseY;

		const newBox = moveHandler.call(this, startBox, XDiff, YDiff);
		this.updateElm(newBox);
		this.elm.classList.replace('grabbed', 'resizing');
		this.events.resizing.forEach(cb => cb(moveEvent, {
			width: newBox.width,
			height: newBox.height,
		}));

		moveEvent.preventDefault();
	});

	document.addEventListener('mouseup', this.onDrop);
	this.events.startResize.forEach(cb => cb(startEvent));
};

Resizable.prototype.updateElm = function updateElm ({width, height, top, left}) {
	const elmStyle = this.elm.style;

	if (width) elmStyle.width = width + px;
	if (height) elmStyle.height = height + px;
	if (top) elmStyle.top = top + px;
	if (left) elmStyle.left = left + px;
};

Resizable.prototype.onDrop = function onDrop (dropEvent) {
	this.elm.classList.remove('grabbed', 'resizing');
	this.unbindMouseMove();
	this.unbindMouseMove = null;
	document.removeEventListener('mouseup', this.onDrop);

	const newBox = this.elm.getBoundingClientRect();
	this.events.stopResize.forEach(cb => cb(dropEvent, newBox));
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
	this.grips = null;
};
