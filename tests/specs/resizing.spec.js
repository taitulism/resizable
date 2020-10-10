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
};
