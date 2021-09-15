const fs = require('fs');

const { render } = require('css-script');

const BREAK_POINTS = [
	{
		infix: '--',
		type: '@media all'
	},
	{
		infix: '--sm-',
		type: '@media (min-width: 576px)'
	},
	{
		infix: '--md-',
		type: '@media (min-width: 768px)'
	},
	{
		infix: '--lg-',
		type: '@media (min-width: 992px)'
	},
	{
		infix: '--xl-',
		type: '@media (min-width: 1200px)'
	}
];

const config = BREAK_POINTS.reduce((acc, cur) => {
	acc[cur.type] = {};
	return acc;
}, {});

const BLOCK_NAME = '.flex-grid';
const ELEMENT_NAME = `${BLOCK_NAME}__col`;
config[BREAK_POINTS[0].type] = {
	[BLOCK_NAME]: {
		'display': 'flex',
		'flex-wrap': 'wrap'
	},
	[ELEMENT_NAME]: {
		'flex-basis': '100%'
	}
};

const MAX_COL_SPAN = 12;
for (let indexA = 0, lengthA = BREAK_POINTS.length; indexA < lengthA; indexA++) {
	const { infix: infixA, type } = BREAK_POINTS[indexA];

	config[type][`${ELEMENT_NAME}${infixA}hide`] = {
		'display': 'none'
	}
	config[type][`${ELEMENT_NAME}${infixA}show`] = {
		'display': 'block'
	}

	config[type][`${ELEMENT_NAME}${infixA}auto`] = {
		'flex-basis': 'auto'
	}

	for (let count = 1; count < MAX_COL_SPAN; count++) {
		config[type][`${ELEMENT_NAME}${infixA}${count}`] = {
			'flex-basis': `${+(count / MAX_COL_SPAN * 100).toFixed(3)}%`
		}
	}

	for (let indexB = 0; indexB <= indexA; indexB++) {
		const { infix: infixB } = BREAK_POINTS[indexB];

		for (let countA = 1; countA < MAX_COL_SPAN; countA++) {
			for (let countB = 1; countB < countA; countB++) {
				config[type][`${ELEMENT_NAME}${infixB}${countA} ${ELEMENT_NAME}${infixA}${countB}`] = {
					'flex-basis': `${+(countB / countA * 100).toFixed(3)}%`
				}
			}
		}
	}
}

const content = render(config);
fs.writeFile('flex-grid.css', content, (error) => {
	if (error) {
		console.error(error);
		return;
	}

	console.log(content);
})
