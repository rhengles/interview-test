/*eslint no-console:0*/

var fs = require('fs');
var path = require('path');

function dir(opt) {
	function next(cbNext) {
		function processFile(name) {
			function sendFile() {
				if (opt.verbose) {
					console.log('sendfile', file);
				}
				return cbNext(null, file);
			}
			if (opt.verbose) {
				console.log('processfile', name);
			}
			var file =
				{ name: name
				, stat: null
				, dir: currentDir
				};
			if (opt.rec || opt.stat) {
				var fpath = path.join(currentDir.name, currentDir.sub, name);
				fs.stat(fpath, function(err, stat) {
					if (opt.verbose) {
						console.log('stat', err, stat);
					}
					if (err) {
						return cbNext(err);
					}
					file.stat = stat;
					var rec = false;
					if (opt.rec && stat.isDirectory()) {
						rec = (opt.rec instanceof Function
							? opt.rec(file, currentDir)
							: true
							);
					}
					if (rec) {
						var sdir =
							{ name: currentDir.name
							, sub: path.join(currentDir.sub, name)
							};
						queue.push(sdir);
						//Return next(cbNext);
					}
					return sendFile(file);
				});
			} else {
				return sendFile(file);
			}
		}
		if (opt.verbose) {
			console.log('next');
		}
		var currentFile = files.shift();
		if (opt.verbose) {
			console.log('currentfile', currentFile);
		}
		if (currentFile) {
			return processFile(currentFile);
		}
		currentDir = queue.shift();
		if (null == currentDir) {
			if (opt.verbose) {
				console.log('enddir');
			}
			return cbNext(null, null);
		} else {
			var cdir = path.join(currentDir.name, currentDir.sub);
			fs.readdir(cdir, function(err, dirFiles) {
				if (opt.verbose) {
					console.log('readdir', err, dirFiles);
				}
				if (err) {
					return cbNext(err);
				}
				files = dirFiles;
				return next(cbNext);
			});
		}
	}
	var queue = [].concat(opt.path).map(function(name) {
			return (
				{ name: name
				, sub: ''
				});
		});
	//Var queueRec = [];
	var currentDir;
	var files = [];
	return next;
}

module.exports = dir;
