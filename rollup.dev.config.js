export default [{
	input: 'index.js',
	output: {
		file: 'dev-bundles/resizable.js',
		format: 'iife',
		name: 'resizable',
	},
}, {
	input: 'tests/specs/index.spec.js',
	output: {
		file: 'dev-bundles/resizable-spec.js',
		format: 'iife',
	},
}];
