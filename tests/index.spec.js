/* global expect resizable */

const createEvent = (type, props = {}) => {
	const event = new window.Event(type, {bubbles: true});
	Object.assign(event, props);
	return event;
};

function simulateMouseEnter (elm, x, y) {
	const event = createEvent('mouseenter', {
		clientX: x || 0,
		clientY: y || 0,
	});
	elm.dispatchEvent(event);
}

function simulateMouseLeave (elm, x, y) {
	const event = createEvent('mouseleave', {
		clientX: x || 0,
		clientY: y || 0,
	});
	elm.dispatchEvent(event);
}

function simulateMouseDown (elm, x, y) {
	const event = createEvent('mousedown', {
		clientX: x || 0,
		clientY: y || 0,
	});
	elm.dispatchEvent(event);
}

function simulateMouseMove (elm, x, y) {
	const event = createEvent('mousemove', {
		clientX: x || 0,
		clientY: y || 0,
	});

	elm.dispatchEvent(event);
}

function simulateMouseUp (elm, x, y) {
	const event = createEvent('mouseup', {
		clientX: x || 0,
		clientY: y || 0,
	});

	elm.dispatchEvent(event);
}

function simulateDragNDrop (elm, moveX, moveY) {
	simulateMouseDown(elm, 0, 0);
	simulateMouseMove(elm, moveX, moveY);
	simulateMouseUp(elm, moveX, moveY);
}

describe('resizable', () => {
	let testDOMContainer, container, target, box, rsz;

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
		container.style.height = '400px';
		container.style.width = '1000';
		container.style.padding = '20px';

		target = document.createElement('div');
		target.id = 'target';
		target.style.width = '100px';
		target.style.height = '100px';
		target.style.backgroundColor = 'pink';

		container.appendChild(target);
		testDOMContainer.appendChild(container);

		box = target.getBoundingClientRect();
	});

	afterEach(() => {
		if (rsz && rsz.elm) rsz.destroy();

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

	describe('Grip', () => {
		it('4 grips are added to the target element', () => {
			expect(target.children.length).to.equal(0);
			resizable(target);
			expect(target.children.length).to.equal(4);
		});

		it('can iterate over grips', () => {
			rsz = resizable(target);
			let gripCount = 0;
			rsz.forEachGrip(() => gripCount++);
			expect(gripCount).to.equal(4);
		});

		it('is transparent', () => {
			const {topLeft, topRight, bottomRight, bottomLeft} = resizable(target).grips;

			expect(topLeft.style.opacity).to.equal('0');
			expect(topRight.style.opacity).to.equal('0');
			expect(bottomRight.style.opacity).to.equal('0');
			expect(bottomLeft.style.opacity).to.equal('0');
		});

		it.skip('shown when mouse is over target', () => {
			rsz = resizable(target);

			rsz.forEachGrip(grip => expect(grip.style.opacity).to.equal('0'));
			simulateMouseEnter(target, box.x + 10, box.y + 10);
			rsz.forEachGrip(grip => expect(grip.style.opacity).to.equal('1'));
			simulateMouseLeave(target, box.x - 10, box.y - 10);
			rsz.forEachGrip(grip => expect(grip.style.opacity).to.equal('0'));
		});

		it.skip('shown when mouse is over any of them', () => {
			resizable(target).forEachGrip((grip) => {
				expect(grip.style.opacity).to.equal('0');
				simulateMouseEnter(grip, box.x, box.y);
				expect(grip.style.opacity).to.equal('1');
				simulateMouseLeave(grip, box.x, box.y);
				expect(grip.style.opacity).to.equal('0');
			});
		});

		it('all grips have a `resize-grip` classname', () => {
			expect(target.getElementsByClassName('resize-grip')).to.have.lengthOf(0);
			resizable(target);
			expect(target.getElementsByClassName('resize-grip')).to.have.lengthOf(4);
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
			const {topLeft, topRight, bottomRight, bottomLeft} = resizable(target).grips;
			simulateMouseEnter(target, box.x + 25, box.y + 25);

			const topLeftBox = topLeft.getBoundingClientRect();
			const topRightBox = topRight.getBoundingClientRect();
			const bottomRightBox = bottomRight.getBoundingClientRect();
			const bottomLeftBox = bottomLeft.getBoundingClientRect();

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
			const {topLeft, topRight, bottomRight, bottomLeft} = resizable(target).grips;
			simulateMouseEnter(target, box.x + 25, box.y + 25);

			const topLeftBox = topLeft.getBoundingClientRect();
			const topRightBox = topRight.getBoundingClientRect();
			const bottomRightBox = bottomRight.getBoundingClientRect();
			const bottomLeftBox = bottomLeft.getBoundingClientRect();

			expect(topLeftBox.width).to.equal(10);
			expect(topLeftBox.height).to.equal(10);

			expect(topRightBox.width).to.equal(10);
			expect(topRightBox.height).to.equal(10);

			expect(bottomRightBox.width).to.equal(10);
			expect(bottomRightBox.height).to.equal(10);

			expect(bottomLeftBox.width).to.equal(10);
			expect(bottomLeftBox.height).to.equal(10);
		});

		it('has inline style cursor', () => {
			const {topLeft, topRight, bottomRight, bottomLeft} = resizable(target).grips;

			expect(topLeft.style.cursor).to.be.equal('nw-resize');
			expect(topRight.style.cursor).to.be.equal('ne-resize');
			expect(bottomRight.style.cursor).to.be.equal('se-resize');
			expect(bottomLeft.style.cursor).to.be.equal('sw-resize');
		});
	});

	describe('Resizing', () => {
		describe('top left grip', () => {
			it('resizes the elm on the X axis', () => {
				const {topLeft} = resizable(target).grips;

				simulateDragNDrop(topLeft, -50, 0);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x - 50);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				simulateDragNDrop(topLeft, 50, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm on the Y axis', () => {
				const {topLeft} = resizable(target).grips;

				simulateDragNDrop(topLeft, 0, -50);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y - 50);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				simulateDragNDrop(topLeft, 0, 50);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm freely on both axes', () => {
				const {topLeft} = resizable(target).grips;
				let newBox;

				simulateMouseDown(topLeft, 0, 0);

				// left
				simulateMouseMove(topLeft, -50, 0);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x - 50);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				// up
				simulateMouseMove(topLeft, -50, -50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x - 50);
				expect(newBox.y).to.equal(box.y - 50);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height + 50);

				// right
				simulateMouseMove(topLeft, 0, -50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y - 50);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				// down
				simulateMouseMove(topLeft, 0, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);

				simulateMouseUp(topLeft, 0, 0);
			});
		});

		describe('top right grip', () => {
			it('resizes the elm on the X axis', () => {
				const {topRight} = resizable(target).grips;

				simulateDragNDrop(topRight, 50, 0);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				simulateDragNDrop(topRight, -50, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm on the Y axis', () => {
				const {topRight} = resizable(target).grips;

				simulateDragNDrop(topRight, 0, -50);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y - 50);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				simulateDragNDrop(topRight, 0, 50);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm freely on both axes', () => {
				const {topRight} = resizable(target).grips;
				let newBox;

				simulateMouseDown(topRight, 0, 0);

				// right
				simulateMouseMove(topRight, 50, 0);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				// up
				simulateMouseMove(topRight, 50, -50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y - 50);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height + 50);

				// left
				simulateMouseMove(topRight, 0, -50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y - 50);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				// down
				simulateMouseMove(topRight, 0, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);

				simulateMouseUp(topRight, 0, 0);
			});
		});

		describe('bottom right grip', () => {
			it('resizes the elm on the X axis', () => {
				const {bottomRight} = resizable(target).grips;

				simulateDragNDrop(bottomRight, 50, 0);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				simulateDragNDrop(bottomRight, -50, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm on the Y axis', () => {
				const {bottomRight} = resizable(target).grips;

				simulateDragNDrop(bottomRight, 0, 50);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				simulateDragNDrop(bottomRight, 0, -50);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm freely on both axes', () => {
				const {bottomRight} = resizable(target).grips;
				let newBox;

				simulateMouseDown(bottomRight, 0, 0);

				// right
				simulateMouseMove(bottomRight, 50, 0);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				// down
				simulateMouseMove(bottomRight, 50, 50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height + 50);

				// left
				simulateMouseMove(bottomRight, 0, 50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				// up
				simulateMouseMove(bottomRight, 0, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);

				simulateMouseUp(bottomRight, 0, 0);
			});
		});

		describe('bottom left grip', () => {
			it('resizes the elm on the X axis', () => {
				const {bottomLeft} = resizable(target).grips;

				simulateDragNDrop(bottomLeft, -50, 0);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x - 50);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				simulateDragNDrop(bottomLeft, 50, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm on the Y axis', () => {
				const {bottomLeft} = resizable(target).grips;

				simulateDragNDrop(bottomLeft, 0, 50);
				const newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				simulateDragNDrop(bottomLeft, 0, -50);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('resizes the elm freely on both axes', () => {
				const {bottomLeft} = resizable(target).grips;
				let newBox;

				simulateMouseDown(bottomLeft, 0, 0);

				// left
				simulateMouseMove(bottomLeft, -50, 0);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x - 50);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				// down
				simulateMouseMove(bottomLeft, -50, 50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x - 50);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height + 50);

				// right
				simulateMouseMove(bottomLeft, 0, 50);
				newBox = target.getBoundingClientRect();

				expect(newBox.x).to.equal(box.x);
				expect(newBox.y).to.equal(box.y);
				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				// up
				simulateMouseMove(bottomLeft, 0, 0);
				expect(target.getBoundingClientRect()).to.deep.equal(box);

				simulateMouseUp(bottomLeft, 0, 0);
			});
		});
	});

	describe('Events', () => {
		it('emits `resize-start` event', () => {
			rsz = resizable(target);
			const {bottomRight} = rsz.grips;
			let fired = false;

			rsz.on('resize-start', (ev) => {
				fired = true;
				expect(ev).to.be.instanceOf(Event);
				expect(ev.target).to.deep.equal(bottomRight);
			});

			simulateMouseDown(bottomRight, box.x, box.y);
			expect(fired).to.be.true;
			simulateMouseUp(bottomRight, box.x, box.y);
		});

		it('emits `resizing` event', () => {
			rsz = resizable(target);
			const {bottomLeft} = rsz.grips;
			let fired = false;

			rsz.on('resizing', (ev) => {
				fired = true;
				expect(ev).to.be.instanceOf(Event);
				expect(ev.target).to.deep.equal(bottomLeft);
			});

			simulateMouseDown(bottomLeft, box.x, box.y);
			expect(fired).to.be.false;
			simulateMouseMove(bottomLeft, box.x - 50, (box.y + box.height) + 50);
			expect(fired).to.be.true;
			simulateMouseUp(bottomLeft, box.x - 50, (box.y + box.height) + 50);
		});

		it('emits `resize-end` event', () => {
			rsz = resizable(target);
			const {topLeft} = rsz.grips;
			let fired = false;

			rsz.on('resize-end', (ev) => {
				fired = true;
				expect(ev).to.be.instanceOf(Event);
				expect(ev.target).to.deep.equal(topLeft);
			});

			simulateMouseDown(topLeft, 0, 0);
			expect(fired).to.be.false;
			simulateMouseMove(topLeft, -50, -50);
			expect(fired).to.be.false;
			simulateMouseUp(topLeft, -50, -50);
			expect(fired).to.be.true;
		});

		it('emits `resize-end` event element box object', () => {
			rsz = resizable(target);
			let fired = false;

			rsz.on('resize-end', (ev, newBox) => {
				fired = true;
				expect(newBox.top).to.equal(box.top - 50);
				expect(newBox.left).to.equal(box.left - 50);
				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height + 50);
			});

			simulateDragNDrop(rsz.grips.topLeft, -50, -50);
			expect(fired).to.be.true;
		});

		describe('`resizing` event `size` object', () => {
			it('top-left', () => {
				rsz = resizable(target);
				const {topLeft} = rsz.grips;
				let fired = false;

				rsz.on('resizing', (ev, size) => {
					fired = true;
					expect(size).to.be.ok;
					expect(size).to.have.property('width');
					expect(size).to.have.property('height');
					expect(size.width).to.equal(130);
					expect(size.height).to.equal(120);
				});

				simulateMouseDown(topLeft, box.x, box.y);
				expect(fired).to.be.false;
				simulateMouseMove(topLeft, box.x - 30, box.y - 20);
				expect(fired).to.be.true;
				simulateMouseUp(topLeft, box.x - 30, box.y - 20);
			});

			it('top-right', () => {
				rsz = resizable(target);
				const {topRight} = rsz.grips;
				let fired = false;

				rsz.on('resizing', (ev, size) => {
					fired = true;
					expect(size).to.be.ok;
					expect(size).to.have.property('width');
					expect(size).to.have.property('height');
					expect(size.width).to.equal(130);
					expect(size.height).to.equal(120);
				});

				simulateMouseDown(topRight, box.x, box.y);
				expect(fired).to.be.false;
				simulateMouseMove(topRight, box.x + 30, box.y - 20);
				expect(fired).to.be.true;
				simulateMouseUp(topRight, box.x + 30, box.y - 20);
			});

			it('bottom-right', () => {
				rsz = resizable(target);
				const {bottomRight} = rsz.grips;
				let fired = false;

				rsz.on('resizing', (ev, size) => {
					fired = true;
					expect(size).to.be.ok;
					expect(size).to.have.property('width');
					expect(size).to.have.property('height');
					expect(size.width).to.equal(130);
					expect(size.height).to.equal(120);
				});

				simulateMouseDown(bottomRight, box.x, box.y);
				expect(fired).to.be.false;
				simulateMouseMove(bottomRight, box.x + 30, box.y + 20);
				expect(fired).to.be.true;
				simulateMouseUp(bottomRight, box.x + 30, box.y + 20);
			});

			it('bottom-left', () => {
				rsz = resizable(target);
				const {bottomLeft} = rsz.grips;
				let fired = false;

				rsz.on('resizing', (ev, size) => {
					fired = true;
					expect(size).to.be.ok;
					expect(size).to.have.property('width');
					expect(size).to.have.property('height');
					expect(size.width).to.equal(130);
					expect(size.height).to.equal(120);
				});

				simulateMouseDown(bottomLeft, box.x, box.y);
				expect(fired).to.be.false;
				simulateMouseMove(bottomLeft, box.x - 30, box.y + 20);
				expect(fired).to.be.true;
				simulateMouseUp(bottomLeft, box.x - 30, box.y + 20);
			});
		});
	});

	describe('Classnames', () => {
		it('sets a `resizable` classname on the element', () => {
			resizable(target);
			expect(target.classList.contains('resizable')).to.be.true;
		});

		it('sets a `grabbed` classname on the element when grabbing a grip', () => {
			rsz = resizable(target);
			const {bottomRight} = rsz.grips;

			expect(target.classList.contains('grabbed')).to.be.false;
			simulateMouseDown(bottomRight, box.x, box.y);
			expect(target.classList.contains('grabbed')).to.be.true;
			simulateMouseMove(bottomRight, box.x - 50, box.y - 50);
			expect(target.classList.contains('grabbed')).to.be.false;
			simulateMouseUp(bottomRight, box.x - 50, box.y - 50);
			expect(target.classList.contains('grabbed')).to.be.false;
		});

		it('sets a `resizing` classname on the element when moving a grip', () => {
			rsz = resizable(target);
			const {topLeft} = rsz.grips;

			expect(target.classList.contains('resizing')).to.be.false;
			simulateMouseDown(topLeft, box.x, box.y);
			expect(target.classList.contains('resizing')).to.be.false;
			simulateMouseMove(topLeft, box.x - 50, box.y - 50);
			expect(target.classList.contains('resizing')).to.be.true;
			simulateMouseUp(topLeft, box.x - 50, box.y - 50);
			expect(target.classList.contains('resizing')).to.be.false;
		});

		it('leaves only the `resizable` classname on the element when droping a grip', () => {
			rsz = resizable(target);
			const {bottomRight} = rsz.grips;

			simulateMouseDown(bottomRight, box.x, box.y);
			simulateMouseMove(bottomRight, box.x, box.y);
			simulateMouseUp(bottomRight, box.x, box.y);
			expect(target.classList.contains('resizable')).to.be.true;
			expect(target.classList.length).to.equal(1);
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

	describe('Options', () => {
		describe('minWidth', () => {
			it('limits the element minimum width (topLeft grip)', () => {
				const {topLeft} = resizable(target, {minWidth: 70}).grips;

				simulateDragNDrop(topLeft, 20, 20);
				const newBox1 = target.getBoundingClientRect();

				expect(newBox1.width).to.equal(box.width - 20);
				expect(newBox1.height).to.equal(box.height - 20);

				simulateDragNDrop(topLeft, 20, 20);
				const newBox2 = target.getBoundingClientRect();

				expect(newBox2.width).to.equal(box.width - 30);
				expect(newBox2.height).to.equal(box.height - 40);
				expect(newBox2.x).to.equal(box.x + 30);
			});

			it('limits the element minimum width (topRight grip)', () => {
				const {topRight} = resizable(target, {minWidth: 70}).grips;

				simulateDragNDrop(topRight, -20, 20);
				const newBox1 = target.getBoundingClientRect();

				expect(newBox1.width).to.equal(box.width - 20);
				expect(newBox1.height).to.equal(box.height - 20);

				simulateDragNDrop(topRight, -20, 20);
				const newBox2 = target.getBoundingClientRect();

				expect(newBox2.width).to.equal(box.width - 30);
				expect(newBox2.height).to.equal(box.height - 40);
			});

			it('limits the element minimum width (bottomRight grip)', () => {
				const {bottomRight} = resizable(target, {minWidth: 70}).grips;

				simulateDragNDrop(bottomRight, -20, -20);
				const newBox1 = target.getBoundingClientRect();

				expect(newBox1.width).to.equal(box.width - 20);
				expect(newBox1.height).to.equal(box.height - 20);

				simulateDragNDrop(bottomRight, -20, -20);
				const newBox2 = target.getBoundingClientRect();

				expect(newBox2.width).to.equal(box.width - 30);
				expect(newBox2.height).to.equal(box.height - 40);
			});

			it('limits the element minimum width (bottomLeft grip)', () => {
				const {bottomLeft} = resizable(target, {minWidth: 70}).grips;

				simulateDragNDrop(bottomLeft, 20, -20);
				const newBox1 = target.getBoundingClientRect();

				expect(newBox1.width).to.equal(box.width - 20);
				expect(newBox1.height).to.equal(box.height - 20);

				simulateDragNDrop(bottomLeft, 20, -20);
				const newBox2 = target.getBoundingClientRect();

				expect(newBox2.width).to.equal(box.width - 30);
				expect(newBox2.height).to.equal(box.height - 40);
				expect(newBox2.x).to.equal(box.x + 30);
			});

			it('on init - sets the element width if less then `minWidth`', () => {
				expect(box.width).to.equal(100);
				resizable(target, {minWidth: 120});
				const newBox = target.getBoundingClientRect();
				expect(newBox.width).to.equal(120);
			});
		});

		describe('minHeight', () => {
			it('limits the element minimum height (topLeft grip)', () => {
				const {topLeft} = resizable(target, {minHeight: 70}).grips;

				simulateDragNDrop(topLeft, 20, 20);
				const newBox1 = target.getBoundingClientRect();

				expect(newBox1.width).to.equal(box.width - 20);
				expect(newBox1.height).to.equal(box.height - 20);

				simulateDragNDrop(topLeft, 20, 20);
				const newBox2 = target.getBoundingClientRect();

				expect(newBox2.width).to.equal(box.width - 40);
				expect(newBox2.height).to.equal(box.height - 30);
				expect(newBox2.y).to.equal(box.y + 30);
			});

			it('limits the element minimum height (topRight grip)', () => {
				const {topRight} = resizable(target, {minHeight: 70}).grips;

				simulateDragNDrop(topRight, -20, 20);
				const newBox1 = target.getBoundingClientRect();

				expect(newBox1.width).to.equal(box.width - 20);
				expect(newBox1.height).to.equal(box.height - 20);

				simulateDragNDrop(topRight, -20, 20);
				const newBox2 = target.getBoundingClientRect();

				expect(newBox2.width).to.equal(box.width - 40);
				expect(newBox2.height).to.equal(box.height - 30);
				expect(newBox2.y).to.equal(box.y + 30);
			});

			it('limits the element minimum height (bottomRight grip)', () => {
				const {bottomRight} = resizable(target, {minHeight: 70}).grips;

				simulateDragNDrop(bottomRight, -20, -20);
				const newBox1 = target.getBoundingClientRect();

				expect(newBox1.width).to.equal(box.width - 20);
				expect(newBox1.height).to.equal(box.height - 20);

				simulateDragNDrop(bottomRight, -20, -20);
				const newBox2 = target.getBoundingClientRect();

				expect(newBox2.width).to.equal(box.width - 40);
				expect(newBox2.height).to.equal(box.height - 30);
			});

			it('limits the element minimum height (bottomLeft grip)', () => {
				const {bottomLeft} = resizable(target, {minHeight: 70}).grips;

				simulateDragNDrop(bottomLeft, 20, -20);
				const newBox1 = target.getBoundingClientRect();

				expect(newBox1.width).to.equal(box.width - 20);
				expect(newBox1.height).to.equal(box.height - 20);

				simulateDragNDrop(bottomLeft, 20, -20);
				const newBox2 = target.getBoundingClientRect();

				expect(newBox2.width).to.equal(box.width - 40);
				expect(newBox2.height).to.equal(box.height - 30);
			});

			it('on init - sets the element height if less then `minHeight`', () => {
				expect(box.height).to.equal(100);
				resizable(target, {minHeight: 150});
				const newBox = target.getBoundingClientRect();
				expect(newBox.height).to.equal(150);
			});
		});

		describe('gripSize', () => {
			it('sets the grip elements square size', () => {
				const rsz = resizable(target, {gripSize: 40});
				const {topLeft, topRight, bottomRight, bottomLeft} = rsz.grips;
				simulateMouseEnter(target, box.x + 25, box.y + 25);

				const topLeftBox = topLeft.getBoundingClientRect();
				const topRightBox = topRight.getBoundingClientRect();
				const bottomRightBox = bottomRight.getBoundingClientRect();
				const bottomLeftBox = bottomLeft.getBoundingClientRect();

				expect(topLeftBox.width).to.equal(40);
				expect(topLeftBox.height).to.equal(40);

				expect(topRightBox.width).to.equal(40);
				expect(topRightBox.height).to.equal(40);

				expect(bottomRightBox.width).to.equal(40);
				expect(bottomRightBox.height).to.equal(40);

				expect(bottomLeftBox.width).to.equal(40);
				expect(bottomLeftBox.height).to.equal(40);
			});
		});

		describe('direction', () => {
			it('restricts resizing towards a single direction only (top)', () => {
				const {grip} = resizable(target, {direction: 'top'});

				simulateDragNDrop(grip, -50, -50);
				const newBox = target.getBoundingClientRect();

				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				simulateDragNDrop(grip, 50, 50);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('restricts resizing towards a single direction only (right)', () => {
				const {grip} = resizable(target, {direction: 'right'});

				simulateDragNDrop(grip, 50, 50);
				const newBox = target.getBoundingClientRect();

				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				simulateDragNDrop(grip, -50, -50);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('restricts resizing towards a single direction only (bottom)', () => {
				const {grip} = resizable(target, {direction: 'bottom'});

				simulateDragNDrop(grip, 50, 50);
				const newBox = target.getBoundingClientRect();

				expect(newBox.width).to.equal(box.width);
				expect(newBox.height).to.equal(box.height + 50);

				simulateDragNDrop(grip, -50, -50);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});

			it('restricts resizing towards a single direction only (left)', () => {
				const {grip} = resizable(target, {direction: 'left'});

				simulateDragNDrop(grip, -50, -50);
				const newBox = target.getBoundingClientRect();

				expect(newBox.width).to.equal(box.width + 50);
				expect(newBox.height).to.equal(box.height);

				simulateDragNDrop(grip, 50, 50);
				expect(target.getBoundingClientRect()).to.deep.equal(box);
			});
		});
	});

	describe('API', () => {
		describe('.on()', () => {
			it('is chainable', () => {
				rsz = resizable(target);
				expect(rsz.on('resizeStart', () => null)).to.deep.equal(rsz);
			});
		});

		describe('.enable() / .disable()', () => {
			it('toggles resizability', () => {
				rsz = resizable(target);
				const {bottomRight} = rsz.grips;

				simulateDragNDrop(bottomRight, 50, 50);
				const newBox1 = target.getBoundingClientRect();

				expect(newBox1.width).to.equal(box.width + 50);
				expect(newBox1.height).to.equal(box.height + 50);

				rsz.disable();

				simulateDragNDrop(bottomRight, -50, -50);
				const newBox2 = target.getBoundingClientRect();

				expect(newBox2.width).to.equal(newBox1.width);
				expect(newBox2.height).to.equal(newBox1.height);

				rsz.enable();

				simulateDragNDrop(bottomRight, -50, -50);
				const newBox3 = target.getBoundingClientRect();

				expect(newBox3.width).to.equal(box.width);
				expect(newBox3.height).to.equal(box.height);
			});

			it('toggles classname', () => {
				rsz = resizable(target);

				expect(target.classList.contains('resize-disabled')).to.be.false;
				rsz.disable();
				expect(target.classList.contains('resize-disabled')).to.be.true;
				rsz.enable();
				expect(target.classList.contains('resize-disabled')).to.be.false;
			});

			it('hides the grips', () => {
				rsz = resizable(target);
				const {topLeft} = rsz.grips;

				expect(topLeft.style.display).not.to.equal('none');
				rsz.disable();
				expect(topLeft.style.display).to.equal('none');
				rsz.enable();
				expect(topLeft.style.display).not.to.equal('none');
			});

			it('is chainable', () => {
				rsz = resizable(target);
				expect(rsz.disable()).to.deep.equal(rsz);
				expect(rsz.enable()).to.deep.equal(rsz);
			});
		});

		describe('.showGrips() / .hideGrips()', () => {
			it('toggles grips visibility', () => {
				rsz = resizable(target);
				const {topLeft} = rsz.grips;

				expect(topLeft.style.opacity).to.equal('0');
				rsz.showGrips();
				expect(topLeft.style.opacity).to.equal('1');
				rsz.hideGrips();
				expect(topLeft.style.opacity).to.equal('0');
			});

			it('is chainable', () => {
				rsz = resizable(target);
				expect(rsz.showGrips()).to.deep.equal(rsz);
				expect(rsz.hideGrips()).to.deep.equal(rsz);
			});
		});
	});

	describe('.destroy()', () => {
		it.skip('stops toggling grips visibility on hover', () => {
			// this was relevant before grips were removed on destruction
			rsz = resizable(target);

			rsz.forEachGrip(grip => expect(grip.style.display).to.equal('none'));
			simulateMouseEnter(target, box.x + 10, box.y + 10);
			rsz.forEachGrip(grip => expect(grip.style.display).to.equal('block'));

			rsz.destroy();

			rsz.forEachGrip(grip => expect(grip.style.display).to.equal('none'));
			simulateMouseLeave(target, box.x - 10, box.y - 10);
			rsz.forEachGrip(grip => expect(grip.style.display).to.equal('none'));
			simulateMouseEnter(target, box.x + 10, box.y + 10);
			rsz.forEachGrip(grip => expect(grip.style.display).to.equal('none'));
		});

		it('removes all grips', () => {
			expect(document.getElementsByClassName('resize-grip')).to.have.lengthOf(0);
			rsz = resizable(target);
			expect(document.getElementsByClassName('resize-grip')).to.have.lengthOf(4);
			rsz.destroy();
			expect(document.getElementsByClassName('resize-grip')).to.have.lengthOf(0);
		});

		it('removes all listeners', () => {
			rsz = resizable(target);
			const {topRight} = rsz.grips;

			let resizeStartCount = 0;
			let resizingCount = 0;
			let resizeEndCount = 0;

			rsz.on('start', () => resizeStartCount++);
			rsz.on('resizing', () => resizingCount++);
			rsz.on('end', () => resizeEndCount++);

			expect(resizeStartCount).to.equal(0);
			simulateMouseDown(topRight, box.x, box.y);
			expect(resizeStartCount).to.equal(1);

			expect(resizingCount).to.equal(0);
			simulateMouseMove(topRight, box.x + 25, box.y - 25);
			expect(resizingCount).to.equal(1);

			expect(resizeEndCount).to.equal(0);
			simulateMouseUp(topRight, box.x + 75, box.y - 75);
			expect(resizeEndCount).to.equal(1);

			simulateMouseMove(topRight, box.x + 100, box.y - 100);
			expect(resizeStartCount).to.equal(1);
			expect(resizingCount).to.equal(1);
			expect(resizeEndCount).to.equal(1);

			rsz.destroy();

			simulateMouseDown(topRight, box.x + 100, box.y - 100);
			expect(resizeStartCount).to.equal(1);

			simulateMouseMove(topRight, box.x + 125, box.y - 125);
			expect(resizingCount).to.equal(1);

			simulateMouseUp(topRight, box.x + 150, box.y - 150);
			expect(resizeEndCount).to.equal(1);
		});

		it('removes all classnames', () => {
			rsz = resizable(target);
			const {topLeft} = rsz.grips;

			simulateMouseDown(topLeft, 25, 25);
			simulateMouseMove(topLeft, 25, 25);
			simulateMouseMove(topLeft, 50, 50);
			simulateMouseUp(topLeft, 50, 50);
			simulateMouseMove(topLeft, 75, 75);

			rsz.destroy();
			simulateMouseDown(target, 100, 100);
			simulateMouseMove(target, 100, 100);
			expect(target.classList.contains('resizable')).to.be.false;
			expect(target.classList.contains('resizing')).to.be.false;
		});

		it('resets original position', () => {
			target.style.position = 'static';

			expect(target.style.position).to.equal('static');
			rsz = resizable(target);

			expect(target.style.position).to.equal('absolute');
			rsz.destroy();
			expect(target.style.position).to.equal('static');
		});

		it('releases the target element reference', () => {
			rsz = resizable(target);

			expect(rsz.elm).to.deep.equal(target);
			rsz.destroy();
			expect(rsz.elm).to.be.null;
		});
	});
});
