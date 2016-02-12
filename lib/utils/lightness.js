
function lightnessRGB(r, g, b) {
	var x = 1/1024; // = 0.0009765625
	return Math.sqrt(
		r * r * 247 * x + // 0,241 = 0,2412109375 = 247/1024
		g * g * 707 * x + // 0,691 = 0,6904296875 = 707/1024
		b * b *  70 * x   // 0,068 = 0,068359375  =  70/1024
		
	);
}
function hexToRgb(hex) {
	return (
		[ parseInt(hex.substr(0, 2), 16)
		, parseInt(hex.substr(2, 2), 16)
		, parseInt(hex.substr(4, 2), 16)
		]);
}
function lightnessHex(hex) {
	hex = hexToRgb(hex);
	return lightnessRGB.apply(this, hex);
}
function lightness() {
	if ( arguments.length == 1 ) {
		if ( arguments[0] instanceof Array ) {
			return lightnessRGB.apply(this, arguments[0]);
		} else {
			return lightnessHex.apply(this, arguments);
		}
	} else if ( arguments.length == 3 ) {
		return lightnessRGB.apply(this, arguments);
	} else {
		throw new Error('Invalid arguments');
	}
}

export default lightness;
