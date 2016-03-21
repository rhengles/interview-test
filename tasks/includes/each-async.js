
function eachAsync(list, each, cb) {
	function next() {
		if (i >= list.length) {
			return cb && cb();
		}
		each(list[i], nextTimeout);
		i++;
	}
	function nextTimeout() {
		setTimeout(next, 0);
	}
	var i = 0;
	next();
}

module.exports = eachAsync;
