var dir = require('./dir');

function dirFiles(opt) {
	function processNext(err, file) {
		if (err) {
			if (opt.error) {
				opt.error(err);
			} else {
				throw err;
			}
			return;
		}
		if (file) {
			var valid = true;
			var regexMatch;
			if (valid && onlyFiles) {
				valid = file.stat.isFile();
			}
			if (valid && reFile) {
				regexMatch = file.name.match(reFile);
				file.regexMatch = regexMatch;
				valid = !!regexMatch;
			}
			if (valid && fnFile) {
				valid = fnFile(file);
			}
			if (valid) {
				opt.processFile(file, nextTimeout);
			} else {
				nextTimeout();
			}
		} else {
			opt.done();
		}
	}
	function next() {
		diter(processNext);
	}
	function nextTimeout() {
		setTimeout(next, 0);
	}
	var reFile = opt.regexFile;
	var fnFile = opt.testFile;
	var onlyFiles = opt.onlyFiles;
	if (null == onlyFiles) onlyFiles = true;
	var diter = dir(
		{ path: opt.path,
			//Verbose: true
			stat: onlyFiles || opt.stat,
			rec: opt.rec,
			verbose: opt.verbose
		});
	next();
}

function firstCharNot(str) {
	return function(file/*, dir*/) {
		var char0 = file.name.charAt(0);
		return -1 == str.indexOf(char0);
	};
}

dirFiles.firstCharNot = firstCharNot;

module.exports = dirFiles;
