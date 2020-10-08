function calculateWidth (width, diff, minWidth) {
	return Math.max(width - diff, minWidth);
}

function calculateHeight (height, diff, minHeight) {
	return Math.max(height - diff, minHeight);
}

function calculateLeft (left, minWidth, width, mouseDiff) {
	return left + Math.min(mouseDiff, width - minWidth);
}

function calculateTop (top, minHeight, height, mouseDiff) {
	return top + Math.min(mouseDiff, height - minHeight);
}

export const direction = {
	top: 0,
	right: 1,
	bottom: 2,
	left: 3,
	topLeft: 4,
	topRight: 5,
	bottomRight: 6,
	bottomLeft: 7,
};

export const gripsDefinitions = {
	[direction.top]: {
		propName: 'grip',
		name: 'top',
		cursor: 'n',
		position: 'top',
		isCorner: false,
		isXAxis: false,
		isYAxis: true,
		moveHandler (startBox, XDiff, YDiff) {
			return {
				height: calculateHeight(startBox.height, YDiff, this.minHeight),
				top: calculateTop(startBox.top, this.minHeight, startBox.height, YDiff),
			};
		}
	},

	[direction.right]: {
		propName: 'grip',
		name: 'right',
		cursor: 'e',
		position: 'right',
		isCorner: false,
		isXAxis: true,
		isYAxis: false,
		moveHandler (startBox, XDiff) {
			return {
				width: calculateWidth(startBox.width, -XDiff, this.minWidth),
			};
		}
	},

	[direction.bottom]: {
		propName: 'grip',
		name: 'bottom',
		cursor: 's',
		position: 'bottom',
		isCorner: false,
		isXAxis: false,
		isYAxis: true,
		moveHandler (startBox, XDiff, YDiff) {
			return {
				height: calculateHeight(startBox.height, -YDiff, this.minHeight),
			};
		}
	},

	[direction.left]: {
		propName: 'grip',
		name: 'left',
		cursor: 'w',
		position: 'left',
		isCorner: false,
		isXAxis: true,
		isYAxis: false,
		moveHandler (startBox, XDiff) {
			return {
				width: calculateWidth(startBox.width, XDiff, this.minWidth),
				left: calculateLeft(startBox.left, this.minWidth, startBox.width, XDiff),
			};
		}
	},

	[direction.topLeft]: {
		propName: 'topLeft',
		name: 'top-left',
		cursor: 'nw',
		position: ['top', 'left'],
		isCorner: true,
		moveHandler (startBox, XDiff, YDiff) {
			return {
				width: calculateWidth(startBox.width, XDiff, this.minWidth),
				height: calculateHeight(startBox.height, YDiff, this.minHeight),
				left: calculateLeft(startBox.left, this.minWidth, startBox.width, XDiff),
				top: calculateTop(startBox.top, this.minHeight, startBox.height, YDiff),
			};
		}
	},

	[direction.topRight]: {
		propName: 'topRight',
		name: 'top-right',
		cursor: 'ne',
		position: ['top', 'right'],
		isCorner: true,
		moveHandler (startBox, XDiff, YDiff) {
			return {
				width: calculateWidth(startBox.width, -XDiff, this.minWidth),
				height: calculateHeight(startBox.height, YDiff, this.minHeight),
				top: calculateTop(startBox.top, this.minHeight, startBox.height, YDiff),
			};
		}
	},

	[direction.bottomRight]: {
		propName: 'bottomRight',
		name: 'bottom-right',
		cursor: 'se',
		position: ['bottom', 'right'],
		isCorner: true,
		moveHandler (startBox, XDiff, YDiff) {
			return {
				width: calculateWidth(startBox.width, -XDiff, this.minWidth),
				height: calculateHeight(startBox.height, -YDiff, this.minHeight),
			};
		}
	},

	[direction.bottomLeft]: {
		propName: 'bottomLeft',
		name: 'bottom-left',
		cursor: 'sw',
		position: ['bottom', 'left'],
		isCorner: true,
		moveHandler (startBox, XDiff, YDiff) {
			return {
				width: calculateWidth(startBox.width, XDiff, this.minWidth),
				height: calculateHeight(startBox.height, -YDiff, this.minHeight),
				left: calculateLeft(startBox.left, this.minWidth, startBox.width, XDiff),
			};
		}
	},
};
