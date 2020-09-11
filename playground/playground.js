const resizable = require('../resizable');
const targetElm = document.getElementById('target');
window.rsz = resizable(targetElm, {
	gripSize: 16,
	minWidth: 200,
	minHeight: 200,
})
.on('resizeStart', () => {
	console.log('resizeStart');
})
.on('resizing', () => {
	console.log('resizing');
})
.on('resizeEnd', () => {
	console.log('resizeEnd');
})
