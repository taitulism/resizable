import resizingSpec from './resizing.spec';
import gripsSpec from './grips.spec';
import positionElevationSpec from './position-elevation.spec';
import eventsSpec from './events.spec';
import classnamesSpec from './classnames.spec';
import optionsSpec from './options.spec';
import apiSpec from './api.spec';

describe('resizable', () => {
	let testDOMContainer;

	before(() => {
		testDOMContainer = document.createElement('div');
		testDOMContainer.id = 'test-dom-container';
		testDOMContainer.style.height = '400px';
		testDOMContainer.style.width = '1000';
		testDOMContainer.style.padding = '75px';
		document.body.appendChild(testDOMContainer);
	});

	after(() => {
		testDOMContainer.parentNode.removeChild(testDOMContainer);
		testDOMContainer = null;
	});

	it('is a function', () => expect(resizable).to.be.a('function'));

	it('returns a resizable instance', () => {
		const target = document.createElement('div');
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
