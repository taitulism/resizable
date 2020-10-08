import {simulateMouseDown, simulateMouseMove, simulateMouseUp} from './utils';

export default () => {
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
};
