import {createTarget, simulateMouseEnter, simulateMouseLeave} from './utils';

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
		rsz && rsz.elm && rsz.destroy();
		target.parentNode.removeChild(target);
		target = null;
		box = null;
	});

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
};
