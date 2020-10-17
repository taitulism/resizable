/* eslint-disable no-invalid-this */

import getGripCreator from './get-grip-creator';
import bindListener from './bind-listener';
import {direction} from './grips-definitions';
import {
	RESIZABLE,
	RESIZING,
	RESIZE_DISABLED,
} from './classnames';

const MOUSE_DOWN = 'mousedown';
const MOUSE_MOVE = 'mousemove';
const MOUSE_UP = 'mouseup';

const px = 'px';

export default class Resizable {
	constructor  (elm, opts = {}) {
		this.minWidth = opts.minWidth || 0;
		this.minHeight = opts.minHeight || 0;
		this.elm = elm;
		this.isResizable = true;
		this.originalPosition = elm.style.position || null;
		this.destructionQueue = [];
		this.unbindMouseMove = null;
		this.classname = opts.classname || RESIZABLE;
		this.grip = null;
		this.grips = {};
		this.events = createEventsObj();

		initMethods(this);
		initGrips(this, opts.gripSize, opts.direction);
		initElm(this, elm);
	}

	disable () {
		this.isResizable = false;
		this.elm.classList.add(RESIZE_DISABLED);
		this.forEachGrip((grip) => {
			grip.style.display = 'none';
		});
		return this;
	}

	enable () {
		this.isResizable = true;
		this.elm.classList.remove(RESIZE_DISABLED);
		this.forEachGrip((grip) => {
			grip.style.display = '';
		});
		return this;
	}

	showGrips () {
		return this.forEachGrip((grip) => {
			grip.style.opacity = '1';
		});
	}

	hideGrips () {
		return this.forEachGrip((grip) => {
			grip.style.opacity = '0';
		});
	}

	forEachGrip (callback) {
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
	}

	on (eventName, callback) {
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
	}

	updateElm ({width, height, top, left}) {
		const elmStyle = this.elm.style;

		if (width) elmStyle.width = width + px;
		if (height) elmStyle.height = height + px;
		if (top) elmStyle.top = top + px;
		if (left) elmStyle.left = left + px;
	}

	destroy () {
		destroyGrips(this);

		this.elm.classList.remove(this.classname, RESIZING);
		if (this.originalPosition) {
			this.elm.style.position = this.originalPosition;
		}

		this.events = null;
		this.elm = null;
	}
}

/* ---------------------------------------------------------------------------------------------- */

function onResizeStart (startEvent, moveHandler) {
	if (!this.isResizable) return;

	this.elm.classList.add(RESIZING);

	const startMouseX = startEvent.clientX;
	const startMouseY = startEvent.clientY;
	const startBox = this.elm.getBoundingClientRect();

	this.unbindMouseMove && this.unbindMouseMove();
	this.unbindMouseMove = bindListener(document, MOUSE_MOVE, (moveEvent) => {
		const XDiff = moveEvent.clientX - startMouseX;
		const YDiff = moveEvent.clientY - startMouseY;

		const newBox = moveHandler.call(this, startBox, XDiff, YDiff);
		this.updateElm(newBox);
		this.events.resizing.forEach(cb => cb(moveEvent, {
			width: newBox.width,
			height: newBox.height,
		}));

		moveEvent.preventDefault();
	});

	document.addEventListener(MOUSE_UP, this.onDrop);
	this.events.startResize.forEach(cb => cb(startEvent));
}

function onDrop (dropEvent) {
	this.elm.classList.remove(RESIZING);
	this.unbindMouseMove();
	this.unbindMouseMove = null;
	document.removeEventListener(MOUSE_UP, this.onDrop);

	const newBox = this.elm.getBoundingClientRect();
	this.events.stopResize.forEach(cb => cb(dropEvent, newBox));
}

/* ---------------------------------------------------------------------------------------------- */

function createEventsObj () {
	return {
		startResize: [],
		resizing: [],
		stopResize: [],
	};
}

function initMethods (rsz) {
	rsz.onResizeStart = onResizeStart.bind(rsz);
	rsz.onDrop = onDrop.bind(rsz);
}

const DEFAULT_GRIP_SIZE = 10;

function initGrips (rsz, gripSize, gripDirection) {
	const createGrip = getGripCreator(gripSize || DEFAULT_GRIP_SIZE);

	if (gripDirection) {
		const {gripElm, moveHandler} = createGrip(direction[gripDirection]);
		rsz.grip = gripElm;
		rsz.elm.appendChild(gripElm);

		const unbind = bindListener(gripElm, MOUSE_DOWN, (ev) => {
			rsz.onResizeStart(ev, moveHandler);
		});

		rsz.destructionQueue.push(unbind);
	}
	else {
		[
			direction.topLeft,
			direction.topRight,
			direction.bottomRight,
			direction.bottomLeft,
		].forEach((gripDir) => {
			const {propName, gripElm, moveHandler} = createGrip(gripDir);
			rsz.grips[propName] = gripElm;
			rsz.elm.appendChild(gripElm);

			const unbind = bindListener(gripElm, MOUSE_DOWN, (ev) => {
				rsz.onResizeStart(ev, moveHandler);
			});

			rsz.destructionQueue.push(unbind);
		});
	}
}

function initElm (rsz, elm) {
	const position = elm.style.position || window.getComputedStyle(elm).position;
	const box = elm.getBoundingClientRect();

	if (position !== 'absolute') {
		elm.style.position = 'absolute';
		elm.style.top = box.top + px;
		elm.style.left = box.left + px;
	}

	if (box.width < rsz.minWidth) {
		elm.style.width = rsz.minWidth + px;
	}

	if (box.height < rsz.minHeight) {
		elm.style.height = rsz.minHeight + px;
	}

	elm.classList.add(rsz.classname);
}

function destroyGrips (rsz) {
	rsz.hideGrips();
	rsz.destructionQueue.forEach(callback => callback());
	rsz.forEachGrip((grip) => {
		rsz.elm.removeChild(grip);
	});
	rsz.grips = null;
}
