// import {terser} from 'rollup-plugin-terser';

export default [{
	input: 'resizable.js',
	output: {
		file: 'dist/resizable.esm.js',
		format: 'es',
	},
}, {
	input: 'resizable.js',
	output: {
		file: 'dist/resizable.browser.js',
		format: 'iife',
		name: 'resizable',
	},
// }, {
// 	input: 'resizable.js',
// 	plugins: [terser()],
// 	output: {
// 		file: 'dist/resizable.browser.min.js',
// 		format: 'iife',
// 		name: 'resizable',
// 	},
}];
