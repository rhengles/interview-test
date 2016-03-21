/*eslint no-console:0*/

var fs = require('fs');
var nodePath = require('path');
var Promise = require('promise');
var JSCS = require('jscs');

function pathRel(p) {
	return nodePath.join(__dirname, p);
}

function readConfig(path) {
	var conf = fs.readFileSync(path, {encoding: 'utf-8'});
	return JSON.parse(conf);
}

var jscs = new JSCS();
var config = readConfig(pathRel('../.jscsrc'));
var dirs = [
	'lib',
	'test',
	'tasks'
];
var globalErrors = 0;

/*
Console.log('using config:');
console.log(config);
*/

jscs.registerDefaultRules();
jscs.configure(config);

/*
Var ruleCount = jscs
	.getConfiguration()
	.getRegisteredRules()
	.length;
console.log(ruleCount + ' rules registered');
*/

var dirsFix = dirs.map(function(dir) {
	return jscs.fixPath(pathRel('../' + dir));
});

Promise.all(dirsFix).then(function(dirResults) {
	//Console.log('jscs done', arguments);
	dirResults.forEach(function(fileResults, dirIndex) {
		var dir = dirs[dirIndex];
		var fileCount = fileResults.length;
		console.log(':: /' + dir + ' (' + fileCount + ')');
		fileResults.forEach(function(result, fileIndex) {
			var path = nodePath.relative(pathRel('..'), result.getFilename());
			var errors = result.getErrorList();
			var errorCount = errors.length;
			if (!errorCount) {
				return;
			}
			globalErrors += errorCount;
			fileIndex = (fileIndex + 1) + '/' + fileCount;
			console.log('> ' + path + ' (' + fileIndex + ', ' + errorCount + ')');
			errors.forEach(function(error) {
				var colorizeOutput = true;
				console.log(result.explainError(error, colorizeOutput) + '\n');
			});
		});
	});
	if (globalErrors) {
		console.log('Os erros acima não puderam ser corrigidos automaticamente.');
		process.exit(1);
	}
}).catch(function() {
	console.log('jscs error', arguments);
	process.exit(2);
});
