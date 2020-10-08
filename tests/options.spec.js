import {createTarget, simulateMouseEnter, simulateDragNDrop} from './utils';

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
};
