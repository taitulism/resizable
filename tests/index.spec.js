import resizingSpec from './resizing.spec';
import gripsSpec from './grips.spec';
import positionElevationSpec from './position-elevation.spec';
import eventsSpec from './events.spec';
import classnamesSpec from './classnames.spec';
import optionsSpec from './options.spec';
import apiSpec from './api.spec';

describe('resizable', () => {
	let testDOMContainer, container, target, rsz;

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
	});

	afterEach(() => {
		if (rsz && rsz.elm) rsz.destroy();

		target.parentNode.removeChild(target);
		target = null;

		container.parentNode.removeChild(container);
		container = null;
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

	describe('Grip', gripsSpec);
	describe('Resizing', resizingSpec);
	describe('Events', eventsSpec);
	describe('Classnames', classnamesSpec);
	describe('Position Elevation', positionElevationSpec);
	describe('Options', optionsSpec);
	describe('API', apiSpec);
});
