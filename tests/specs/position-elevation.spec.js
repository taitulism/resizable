import { createTarget } from '../utils';

export default () => {
	let testDOMContainer, target, rsz;

	before(() => {
		testDOMContainer = document.getElementById('test-dom-container');
	});

	beforeEach(() => {
		target = createTarget();
		testDOMContainer.appendChild(target);
	});

	afterEach(() => {
		if (rsz && rsz.elm) rsz.destroy();
		target.parentNode.removeChild(target);
		target = null;
	});

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
};
