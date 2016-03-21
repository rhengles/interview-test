/* global describe, it */

import utils from '../lib/utils';
import colors from './colors';
import colorHex from './color-hex';
import { assert } from 'chai';

describe('lightness', () => {
	var lightness = utils.lightness;

	it('works with hex and rgb', () => {
		Object.keys(colors).forEach((name) => {
			var c = colors[name];
			assert.strictEqual(lightness(colorHex(c)), lightness.apply(null, c));
		});
	});

	it('return a higher number for brighter colors', () => {
		var ltWhite  = lightness(colors.white);
		var ltSilver = lightness(colors.silver);
		var ltGray   = lightness(colors.gray);
		var ltBlack  = lightness(colors.black);
		assert.isAbove(ltWhite , ltSilver, 'white is brighter than silver');
		assert.isAbove(ltSilver, ltGray  , 'silver is brighter than gray');
		assert.isAbove(ltGray  , ltBlack , 'gray is brighter than black');
	});
});