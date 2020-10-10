import {
	createTarget,
	simulateDragNDrop,
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp
} from '../utils';

export default () => {
	let testDOMContainer, target, box, rsz;

	before(() => {
		testDOMContainer = document.getElementById('test-dom-container');
	});

	beforeEach(() => {
		target = createTarget();
		testDOMContainer.appendChild(target);
		box = target.getBoundingClientRect();
	});

	afterEach(() => {
		if (rsz && rsz.elm) rsz.destroy();
		target.parentNode.removeChild(target);
		target = null;
		box = null;
	});

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
};
