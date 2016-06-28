/*eslint no-console:0*/
var fs = require('fs');
var node_path = require('path');
var nunjucks = require('nunjucks');
var nunjucks_esm = require('nunjucks-esm');
var dirFiles = require('./includes/dir-files');
var total = 0;

function pathRel(p) {
	return node_path.join(__dirname, p);
}

//,var pathOutput = pathRel('../lib/templates.js');
var pathInput = pathRel('../templates');

function saveTemplate(pathInput, pathOutput, callback) {
	fs.writeFile(
		pathOutput,
		nunjucks.precompile(
			pathInput,
			{
				//,exclude: ['_includes'],
				include: ['\\.html$'],
				wrapper: nunjucks_esm.wrapper
			}
		),
		callback
	);
}

dirFiles({
	path: pathInput,
	stat: true,
	//,verbose: true,
	onlyFiles: false,
	testFile: function(file) {
		//,console.log('TP', file);
		return file.stat.isDirectory();
	},
	//,rec: dirFiles.firstCharNot('._'),
	//,regexFile: /^(.*)\.(html|cshtml)$/,
	processFile: function(file, next) {
		//,console.log('TP', file);
		var fpath = node_path.join(
			file.dir.name,
			//,file.dir.sub,
			file.name
		);
		var fout = node_path.join(
			'../lib', file.name, 'templates.js'
		);
		saveTemplate(
			fpath,
			pathRel(fout),
			function(err) {
				if (err) throw err;
				console.log('file saved: ' + fout);
				total += 1;
				next();
			}
			);
	},
	done: function() {
		console.log();
		console.log('FINISHED - ' + total + ' files');
	}
});
