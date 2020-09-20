export default [{
	input: 'resizable.js',
	output: {
		file: 'dist/resizable.esm-bundle.js',
		format: 'es',
	},
},{
	input: 'resizable.js',
	output: {
		file: 'dist/resizable.browser.js',
		format: 'iife',
		name: 'resizable',
	},
}];
