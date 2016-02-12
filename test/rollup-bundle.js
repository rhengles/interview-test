'use strict';

var chai = require('chai');

require("source-map-support").install();
function lightnessRGB(r, g, b) {
	var x = 1 / 1024; // = 0.0009765625
	return Math.sqrt(r * r * 247 * x + // 0,241 = 0,2412109375 = 247/1024
	g * g * 707 * x + // 0,691 = 0,6904296875 = 707/1024
	b * b * 70 * x // 0,068 = 0,068359375  =  70/1024

	);
}
function hexToRgb(hex) {
	return [parseInt(hex.substr(0, 2), 16), parseInt(hex.substr(2, 2), 16), parseInt(hex.substr(4, 2), 16)];
}
function lightnessHex(hex) {
	hex = hexToRgb(hex);
	return lightnessRGB.apply(this, hex);
}
function lightness() {
	if (arguments.length == 1) {
		if (arguments[0] instanceof Array) {
			return lightnessRGB.apply(this, arguments[0]);
		} else {
			return lightnessHex.apply(this, arguments);
		}
	} else if (arguments.length == 3) {
		return lightnessRGB.apply(this, arguments);
	} else {
		throw new Error('Invalid arguments');
	}
}

var utils = {
	lightness: lightness
};

var colors = {
	white: [0xff, 0xff, 0xff],
	black: [0x00, 0x00, 0x00],
	gray: [0x80, 0x80, 0x80],
	silver: [0xc0, 0xc0, 0xc0],
	red: [0xff, 0x00, 0x00],
	orange: [0xff, 0x7f, 0x00],
	yellow: [0xff, 0xff, 0x00],
	lime: [0x7f, 0xff, 0x00],
	green: [0x00, 0xff, 0x00],
	spring: [0x00, 0xff, 0x7f],
	cyan: [0x00, 0xff, 0xff],
	sky: [0x00, 0x7f, 0xff],
	blue: [0x00, 0x00, 0xff],
	purple: [0x7f, 0x00, 0xff],
	pink: [0xff, 0x00, 0xff],
	violet: [0xff, 0x00, 0x7f]
};

function byte(num) {
	num = num.toString(16);
	var len = num.length;
	return len < 2 ? '00'.substr(0, 2 - len) + num : num.substr(0, 2);
}

function concat(a, b) {
	return String(a) + String(b);
}

function colorHex(arr) {
	return arr.map(byte).reduce(concat);
}

describe('lightness', function () {
  var lightness = utils.lightness;

  it('works with hex and rgb', function () {
    Object.keys(colors).forEach(function (name) {
      var c = colors[name];
      chai.assert.strictEqual(lightness(colorHex(c)), lightness.apply(null, c));
    });
  });

  it('return a higher number for brighter colors', function () {
    var ltWhite = lightness(colors.white);
    var ltSilver = lightness(colors.silver);
    var ltGray = lightness(colors.gray);
    var ltBlack = lightness(colors.black);
    chai.assert.isAbove(ltWhite, ltSilver, 'white is brighter than silver');
    chai.assert.isAbove(ltSilver, ltGray, 'silver is brighter than gray');
    chai.assert.isAbove(ltGray, ltBlack, 'gray is brighter than black');
  });
});
//# sourceMappingURL=rollup-bundle.js.map