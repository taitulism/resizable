/* eslint-disable indent, no-magic-numbers */
import {gripsDefinitions} from './grips-definitions';
import {RESIZE_GRIP} from './classnames';

const px = 'px';

export default function getGripCreator (gripSize) {
	const gripSizePx = gripSize + px;
	const gripOffset = (gripSize / 2 * -1) + px;

	return function createGrip (gripDefKey) {
		const {
			propName,
			name,
			cursor,
			position,
			isCorner,
			isXAxis,
			isYAxis,
			moveHandler,
		} = gripsDefinitions[gripDefKey];

		const grip = document.createElement('div');
		const gripStyle = grip.style;
		const gripClassname = `${name}-grip`;

		gripStyle.position = 'absolute';
		gripStyle.width = isYAxis ? '100%' : gripSizePx;
		gripStyle.height = isXAxis ? '100%' : gripSizePx;
		gripStyle.cursor = `${cursor}-resize`;
		gripStyle.borderRadius = gripSizePx;
		gripStyle.opacity = '0';

		if (isCorner) {
			position.forEach((pos) => {
				gripStyle[pos] = gripOffset;
			});
		}
		else {
			gripStyle[position] = gripOffset;
		}

		grip.classList.add(RESIZE_GRIP, gripClassname);

		return {gripElm: grip, moveHandler, propName};
	};
}
