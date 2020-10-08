export default [{
	input: 'index.js',
	output: {
		file: 'resizable-dev-bundle.js',
		format: 'iife',
		name: 'resizable',
	},
}, {
	input: 'tests/index.spec.js',
	output: {
		file: 'resizable-spec-bundle.js',
		format: 'iife',
		name: 'resizable',
	},
}];
