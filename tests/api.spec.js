import {createTarget, simulateDragNDrop, simulateMouseDown, simulateMouseMove, simulateMouseUp, simulateMouseEnter, simulateMouseLeave} from './utils';

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
};
