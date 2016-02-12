
function byte(num) {
	num = num.toString(16);
	var len = num.length;
	return ( len < 2
		? '00'.substr(0, 2-len) + num
		: num.substr(0, 2)
	);
}

function concat(a, b) {
	return String(a)+String(b);
}

function colorHex(arr) {
	return arr.map(byte).reduce(concat);
}

export default colorHex;
