/* global resizable */

// const resizable = require('../resizable');

const createEvent = (type, props = {}) => {
	const event = new window.Event(type, {bubbles: true});
	Object.assign(event, props);
	return event;
};

function simulateMouseEnter (elm, x, y) {
	const event = createEvent('mouseenter', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});
	elm.dispatchEvent(event);
}

function simulateMouseLeave (elm, x, y) {
	const event = createEvent('mouseleave', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});
	elm.dispatchEvent(event);
}

function simulateMouseDown (elm, x, y) {
	const event = createEvent('mousedown', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});
	elm.dispatchEvent(event);
}

function simulateMouseMove (elm, x, y) {
	const event = createEvent('mousemove', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});

	elm.dispatchEvent(event);
}

function simulateMouseUp (elm, x, y) {
	const event = createEvent('mouseup', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});

	elm.dispatchEvent(event);
}

function simulateDragNDrop (elm, moveX, moveY) {
	simulateMouseDown(elm, 0, 0);
	simulateMouseMove(elm, moveX, moveY);
	simulateMouseUp(elm, moveX, moveY);
}

describe('resizable', () => {
	let testDOMContainer, container, target, box;

	before(() => {
		testDOMContainer = document.getElementById('test-dom-container');
		if (!testDOMContainer) {
			testDOMContainer = document.createElement('div');
			testDOMContainer.id = 'test-dom-container';
			document.body.appendChild(testDOMContainer);
		}
	});

	beforeEach(() => {
		container = document.createElement('div');
		container.id = 'container';

		target = document.createElement('div');
		target.id = 'target';

		container.appendChild(target);
		testDOMContainer.appendChild(container);

		box = target.getBoundingClientRect();
	});

	afterEach(() => {
		target.parentNode.removeChild(target);
		target = null;

		container.parentNode.removeChild(container);
		container = null;

		box = null;
	});

	after(() => {
		testDOMContainer = null;
	});

	it('is a function', () => expect(resizable).to.be.a('function'));

	it('returns a resizable instance', () => {
		const resizableInstance = resizable(target);
		const ctor = Object.getPrototypeOf(resizableInstance).constructor;

		expect(ctor.name).to.equal('Resizable');
	});

	describe('Grips', () => {
		it('adds 4 grips to the target element', () => {
			expect(target.children.length).to.equal(0);
			resizable(target);
			expect(target.children.length).to.equal(4);
		});

		it('can iterate over grips', () => {
			const rsz = resizable(target);
			let gripCount = 0;
			rsz.forEachGrip((grip) => gripCount++);
			expect(gripCount).to.equal(4);
		});

		it('grips are not shown until mouse over target', () => {
			const rsz = resizable(target);

			rsz.forEachGrip((grip) => { expect(grip.style.display).to.equal('none'); });
			simulateMouseEnter(target, box.x + 10, box.y + 10);
			rsz.forEachGrip((grip) => { expect(grip.style.display).to.equal('block'); });
			simulateMouseLeave(target, box.x - 10, box.y - 10);
			rsz.forEachGrip((grip) => { expect(grip.style.display).to.equal('none'); });
		});

		it('all grips have a `resizable-grip` classname', () => {
			expect(target.getElementsByClassName('resizable-grip')).to.have.lengthOf(0);
			resizable(target);
			expect(target.getElementsByClassName('resizable-grip')).to.have.lengthOf(4);
		});

		it('each grip has its own classname', () => {
			expect(target.getElementsByClassName('top-left-grip')).to.have.lengthOf(0);
			expect(target.getElementsByClassName('top-right-grip')).to.have.lengthOf(0);
			expect(target.getElementsByClassName('bottom-right-grip')).to.have.lengthOf(0);
			expect(target.getElementsByClassName('bottom-left-grip')).to.have.lengthOf(0);
			resizable(target);
			expect(target.getElementsByClassName('top-left-grip')).to.have.lengthOf(1);
			expect(target.getElementsByClassName('top-right-grip')).to.have.lengthOf(1);
			expect(target.getElementsByClassName('bottom-right-grip')).to.have.lengthOf(1);
			expect(target.getElementsByClassName('bottom-left-grip')).to.have.lengthOf(1);
		});

		it('grips are located on the element corners', () => {
			const {topLeftGrip, topRightGrip, bottomRightGrip, bottomLeftGrip} = resizable(target);
			simulateMouseEnter(target, box.x + 25, box.y + 25);

			const topLeftBox = topLeftGrip.getBoundingClientRect();
			const topRightBox = topRightGrip.getBoundingClientRect();
			const bottomRightBox = bottomRightGrip.getBoundingClientRect();
			const bottomLeftBox = bottomLeftGrip.getBoundingClientRect();

			expect(topLeftBox.top).to.equal(box.top - 5);
			expect(topLeftBox.left).to.equal(box.left - 5);

			expect(topRightBox.top).to.equal(box.top - 5);
			expect(topRightBox.right).to.equal(box.right + 5);

			expect(bottomRightBox.bottom).to.equal(box.bottom + 5);
			expect(bottomRightBox.right).to.equal(box.right + 5);

			expect(bottomLeftBox.bottom).to.equal(box.bottom + 5);
			expect(bottomLeftBox.left).to.equal(box.left - 5);
		});

		it('default grip size is 10x10', () => {
			const {topLeftGrip, topRightGrip, bottomRightGrip, bottomLeftGrip} = resizable(target);
			simulateMouseEnter(target, box.x + 25, box.y + 25);

			const topLeftBox = topLeftGrip.getBoundingClientRect();
			const topRightBox = topRightGrip.getBoundingClientRect();
			const bottomRightBox = bottomRightGrip.getBoundingClientRect();
			const bottomLeftBox = bottomLeftGrip.getBoundingClientRect();

			expect(topLeftBox.width).to.equal(10);
			expect(topLeftBox.height).to.equal(10);

			expect(topRightBox.width).to.equal(10);
			expect(topRightBox.height).to.equal(10);

			expect(bottomRightBox.width).to.equal(10);
			expect(bottomRightBox.height).to.equal(10);

			expect(bottomLeftBox.width).to.equal(10);
			expect(bottomLeftBox.height).to.equal(10);
		});
	});

	describe('Resizing', () => {
		describe('top left grip', () => {
			it('resizes the elm on the X axis', () => {
				const {topLeftGrip} = resizable(target);

				simulateDragNDrop(topLeftGrip, -50, 0);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x - 50);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				simulateDragNDrop(topLeftGrip, 50, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm on the Y axis', () => {
				const {topLeftGrip} = resizable(target);

				simulateDragNDrop(topLeftGrip, 0, -50);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y - 50);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				simulateDragNDrop(topLeftGrip, 0, 50);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm freely on both axes', () => {
				const {topLeftGrip} = resizable(target);
				let newBox;

				simulateMouseDown(topLeftGrip, 0, 0);

				// left
				simulateMouseMove(topLeftGrip, -50, 0);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x - 50);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				// up
				simulateMouseMove(topLeftGrip, -50, -50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x - 50);
				expect(newBox.y).to.equal(box.y - 50);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height + 50);

				// right
				simulateMouseMove(topLeftGrip, 0, -50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y - 50);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				// down
				simulateMouseMove(topLeftGrip, 0, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);

				simulateMouseUp(topLeftGrip, 0, 0);
			});
		});

		describe('top right grip', () => {
			it('resizes the elm on the X axis', () => {
				const {topRightGrip} = resizable(target);

				simulateDragNDrop(topRightGrip, 50, 0);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				simulateDragNDrop(topRightGrip, -50, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm on the Y axis', () => {
				const {topRightGrip} = resizable(target);

				simulateDragNDrop(topRightGrip, 0, -50);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y - 50);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				simulateDragNDrop(topRightGrip, 0, 50);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm freely on both axes', () => {
				const {topRightGrip} = resizable(target);
				let newBox;

				simulateMouseDown(topRightGrip, 0, 0);

				// right
				simulateMouseMove(topRightGrip, 50, 0);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				// up
				simulateMouseMove(topRightGrip, 50, -50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y - 50);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height + 50);

				// left
				simulateMouseMove(topRightGrip, 0, -50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y - 50);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				// down
				simulateMouseMove(topRightGrip, 0, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);

				simulateMouseUp(topRightGrip, 0, 0);
			});
		});

		describe('bottom right grip', () => {
			it('resizes the elm on the X axis', () => {
				const {bottomRightGrip} = resizable(target);

				simulateDragNDrop(bottomRightGrip, 50, 0);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				simulateDragNDrop(bottomRightGrip, -50, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm on the Y axis', () => {
				const {bottomRightGrip} = resizable(target);

				simulateDragNDrop(bottomRightGrip, 0, 50);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				simulateDragNDrop(bottomRightGrip, 0, -50);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm freely on both axes', () => {
				const {bottomRightGrip} = resizable(target);
				let newBox;

				simulateMouseDown(bottomRightGrip, 0, 0);

				// right
				simulateMouseMove(bottomRightGrip, 50, 0);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				// down
				simulateMouseMove(bottomRightGrip, 50, 50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height + 50);

				// left
				simulateMouseMove(bottomRightGrip, 0, 50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				// up
				simulateMouseMove(bottomRightGrip, 0, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);

				simulateMouseUp(bottomRightGrip, 0, 0);
			});
		});

		describe('bottom left grip', () => {
			it('resizes the elm on the X axis', () => {
				const {bottomLeftGrip} = resizable(target);

				simulateDragNDrop(bottomLeftGrip, -50, 0);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x - 50);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				simulateDragNDrop(bottomLeftGrip, 50, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm on the Y axis', () => {
				const {bottomLeftGrip} = resizable(target);

				simulateDragNDrop(bottomLeftGrip, 0, 50);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				simulateDragNDrop(bottomLeftGrip, 0, -50);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm freely on both axes', () => {
				const {bottomLeftGrip} = resizable(target);
				let newBox;

				simulateMouseDown(bottomLeftGrip, 0, 0);

				// left
				simulateMouseMove(bottomLeftGrip, -50, 0);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x - 50);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				// down
				simulateMouseMove(bottomLeftGrip, -50, 50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x - 50);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height + 50);

				// right
				simulateMouseMove(bottomLeftGrip, 0, 50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				// up
				simulateMouseMove(bottomLeftGrip, 0, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);

				simulateMouseUp(bottomLeftGrip, 0, 0);
			});
		});
	});

	describe('Events', () => {
		it('emits `resizing` event', () => {
			const rsz = resizable(target);
			let fired = false;

			rsz.on('resizing', (ev) => {
				fired = true;
			});

			simulateMouseDown(rsz.bottomRightGrip, box.x, box.y);

			expect(fired).to.be.true;
		});

		it('emits `newSize` event', () => {
			const rsz = resizable(target);
			let fired = false;

			rsz.on('newSize', (ev) => {
				fired = true;
			});

			simulateMouseDown(rsz.bottomLeftGrip, box.x, box.y);
			expect(fired).to.be.false;
			simulateMouseDown(rsz.bottomLeftGrip, box.x-50, (box.y + box.height)+50);
			expect(fired).to.be.false;
			simulateMouseUp(rsz.bottomLeftGrip, box.x-50, (box.y + box.height)+50);
			expect(fired).to.be.true;
		});
	});

	describe('Classnames', () => {
		it('sets a `resizable` classname on elm', () => {
			resizable(target);
			expect(target.classList.contains('resizable')).to.be.true;
		});

		it('sets a `resizing` classname on elm when grabbing and moving a grip', () => {
			const rsz = resizable(target);

			expect(target.classList.contains('resizing')).to.be.false;
			simulateMouseDown(rsz.topLeftGrip, box.x, box.y);
			expect(target.classList.contains('resizing')).to.be.true;
			simulateMouseMove(rsz.topLeftGrip, box.x-50, box.y-50);
			expect(target.classList.contains('resizing')).to.be.true;
			simulateMouseUp(rsz.topLeftGrip, box.x-50, box.y-50);
			expect(target.classList.contains('resizing')).to.be.false;
		});
	});

	describe('Position Elevation', () => {
		it('if element position is `absolute` - keep it like that', () => {
			target.style.position = 'absolute';

			expect(target.style.position).to.equal('absolute');
			resizable(target);
			expect(target.style.position).to.equal('absolute');
		});

		it('if element position is not `absolute` - sets `position:absolute`', () => {
			target.style.position = 'static';

			expect(target.style.position).to.equal('static');
			resizable(target);
			expect(target.style.position).to.equal('absolute');
		});
	});

	describe.skip('Options', () => {
		describe('axis', () => {
			it('restricts dragging along the X axis only', () => {
				resizable(target, {axis: 'X'});
				expect(target.style.left).to.be.empty;
				expect(target.style.top).to.be.empty;

				simulateMouseDown(target, 50, 50);
				simulateMouseMove(target, 50, 50);

				expect(target.style.left).to.equal('0px');
				expect(target.style.top).to.be.empty;

				simulateMouseMove(target, 150, 150);
				expect(target.style.left).to.equal('100px');
				expect(target.style.top).to.be.empty;
			});

			it('restricts dragging along the Y axis only', () => {
				resizable(target, {axis: 'Y'});
				expect(target.style.left).to.be.empty;
				expect(target.style.top).to.be.empty;

				simulateMouseDown(target, 50, 50);
				simulateMouseMove(target, 50, 50);

				expect(target.style.left).to.be.empty;
				expect(target.style.top).to.equal('0px');

				simulateMouseMove(target, 150, 150);
				expect(target.style.left).to.be.empty;
				expect(target.style.top).to.equal('100px');
			});

			it('opt:axis bug', () => {
				/*
					When restricting to an axis, moving the mouse in the other
					axis misses the mouseup event (mouse is outside of target).
					The event is bound to target but the mouseup event occures outside.
					Fixed by binding the mouseup to the document.
					Test by keep moving the mouse after the drop and verify target is not moving.
				*/

				resizable(target, {axis: 'X'});
				expect(target.style.left).to.be.empty;
				expect(target.style.top).to.be.empty;

				simulateMouseDown(target, 50, 50);
				simulateMouseMove(target, 50, 50);

				expect(target.style.left).to.equal('0px');
				expect(target.style.top).to.be.empty;

				simulateMouseMove(target, 180, 180);
				expect(target.style.left).to.equal('130px');
				expect(target.style.top).to.be.empty;

				simulateMouseUp(document, 180, 180);
				simulateMouseMove(target, 400, 400);
				expect(target.style.left).to.equal('130px');
			});
		});
	});

	describe('Destruction', () => {
		it.skip('stops toggling grips visibility on hover', () => {
			// this was relevant before grips were removed on destruction
			const rsz = resizable(target);

			rsz.forEachGrip((grip) => { expect(grip.style.display).to.equal('none'); });
			simulateMouseEnter(target, box.x + 10, box.y + 10);
			rsz.forEachGrip((grip) => { expect(grip.style.display).to.equal('block'); });

			rsz.destroy();

			rsz.forEachGrip((grip) => { expect(grip.style.display).to.equal('none'); });
			simulateMouseLeave(target, box.x - 10, box.y - 10);
			rsz.forEachGrip((grip) => { expect(grip.style.display).to.equal('none'); });
			simulateMouseEnter(target, box.x + 10, box.y + 10);
			rsz.forEachGrip((grip) => { expect(grip.style.display).to.equal('none'); });
		});

		it('removes all grips', () => {
			expect(document.getElementsByClassName('resizable-grip')).to.have.lengthOf(0);
			const rsz = resizable(target);
			expect(document.getElementsByClassName('resizable-grip')).to.have.lengthOf(4);
			rsz.destroy();
			expect(document.getElementsByClassName('resizable-grip')).to.have.lengthOf(0);
		});

		it('removes all listeners', () => {
			const rsz = resizable(target);
			const {topRightGrip} = rsz;

			let resizingCount = 0;
			let newSizeCount = 0;

			rsz.on('resizing', () => { resizingCount++; });
			rsz.on('newSize', () => { newSizeCount++; });

			expect(resizingCount).to.equal(0);
			simulateMouseDown(topRightGrip, box.x, box.y);
			expect(resizingCount).to.equal(1);

			simulateMouseMove(topRightGrip, box.x + 25, box.y - 25);
			expect(resizingCount).to.equal(1);

			// TODO: add event, see trello
			// simulateMouseMove(topRightGrip, box.x + 50, box.y - 50);
			// expect(resizingCount).to.equal(2);

			expect(newSizeCount).to.equal(0);
			simulateMouseUp(topRightGrip, box.x + 75, box.y - 75);
			expect(newSizeCount).to.equal(1);

			simulateMouseMove(topRightGrip, box.x + 100, box.y - 100);
			expect(resizingCount).to.equal(1);

			rsz.destroy();

			simulateMouseDown(topRightGrip, box.x + 100, box.y - 100);
			expect(resizingCount).to.equal(1);

			simulateMouseMove(topRightGrip, box.x + 125, box.y - 125);
			expect(resizingCount).to.equal(1);

			simulateMouseUp(topRightGrip, box.x + 150, box.y - 150);
			expect(newSizeCount).to.equal(1);
		});

		it('removes all classnames', () => {
			const rsz = resizable(target);
			const {topLeftGrip} = rsz;

			simulateMouseDown(topLeftGrip, 25, 25);
			simulateMouseMove(topLeftGrip, 25, 25);
			simulateMouseMove(topLeftGrip, 50, 50);
			simulateMouseUp(topLeftGrip, 50, 50);
			simulateMouseMove(topLeftGrip, 75, 75);

			rsz.destroy();
			simulateMouseDown(target, 100, 100);
			simulateMouseMove(target, 100, 100);
			expect(target.classList.contains('resizable')).to.be.false;
			expect(target.classList.contains('resizing')).to.be.false;
		});

		it('resets original position', () => {
			target.style.position = 'static';

			expect(target.style.position).to.equal('static');
			const rsz = resizable(target);

			expect(target.style.position).to.equal('absolute');
			rsz.destroy();
			expect(target.style.position).to.equal('static');
		});

		it('releases the target element reference', () => {
			const rsz = resizable(target);

			expect(rsz.elm).to.deep.equal(target);
			rsz.destroy();
			expect(rsz.elm).to.be.null;
		});
	});
});
