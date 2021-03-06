import {
	createTarget,
	simulateMouseDown,
	simulateMouseMove,
	simulateMouseUp,
} from '../utils';

import {
	RESIZABLE,
	RESIZING,
} from '../../src/classnames';

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

	it('sets a `resizable` classname on the element', () => {
		resizable(target);
		expect(target.classList.contains(RESIZABLE)).to.be.true;
	});

	it('sets a `resizing` classname on the element when moving a grip', () => {
		rsz = resizable(target);
		const {topLeft} = rsz.grips;

		expect(target.classList.contains(RESIZING)).to.be.false;
		simulateMouseDown(topLeft, box.x, box.y);
		expect(target.classList.contains(RESIZING)).to.be.true;
		simulateMouseMove(topLeft, box.x - 50, box.y - 50);
		expect(target.classList.contains(RESIZING)).to.be.true;
		simulateMouseUp(topLeft, box.x - 50, box.y - 50);
		expect(target.classList.contains(RESIZING)).to.be.false;
	});

	it('leaves only the `resizable` classname on the element when droping a grip', () => {
		rsz = resizable(target);
		const {bottomRight} = rsz.grips;

		simulateMouseDown(bottomRight, box.x, box.y);
		simulateMouseMove(bottomRight, box.x, box.y);
		simulateMouseUp(bottomRight, box.x, box.y);
		expect(target.classList.contains(RESIZABLE)).to.be.true;
		expect(target.classList.length).to.equal(1);
	});
};
