/* eslint-disable */

const targetElm = document.getElementById('target');
window.rsz = resizable(targetElm, {
	gripSize: 16,
	minWidth: 200,
	minHeight: 200,
	// direction: 'right',
})
.on('resizing', (ev, box) => {
	console.log('resizing', box);
})
.showGrips()
