/*eslint no-console:0*/

import utils from './utils';

var colors =
	[ 'ff0000'
	, 'ff7f00'
	, 'ffff00'
	, '7fff00'
	, '00ff00'
	, '00ff7f'
	, '00ffff'
	, '007fff'
	, '0000ff'
	, '7f00ff'
	, 'ff00ff'
	, 'ff007f'
	];

colors.forEach(function(c) {
	console.log(c + ': ' + utils.lightness(c));
});