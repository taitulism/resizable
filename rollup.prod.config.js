// import {terser} from 'rollup-plugin-terser';

export default [{
	input: 'index.js',
	output: {
		file: 'dist/resizable.esm.js',
		format: 'es',
	},
}, {
	input: 'index.js',
	output: {
		file: 'dist/resizable.browser.js',
		format: 'iife',
		name: 'resizable',
	},
}];

/*
minify:
-------
	import {terser} from 'rollup-plugin-terser';

	...

	input: 'index.js',
	plugins: [terser()],
	output: {
		file: 'dist/resizable.browser.min.js',
		format: 'iife',
		name: 'resizable',
	},
*/
