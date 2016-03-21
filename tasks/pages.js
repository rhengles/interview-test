/*eslint no-console:0*/

var fs = require('fs');
var node_path = require('path');
var nunjucks = require('nunjucks');
var dirFiles = require('./includes/dir-files');

function pathRel(p) {
	return node_path.join(__dirname, p);
}

var loader = new nunjucks.FileSystemLoader(pathRel('../pages'));
var env = new nunjucks.Environment(loader);
var total = 0;

function renderTemplate(name, cb) {

	fs.writeFile(
	pathRel('../web/' + name),
	env.render(name),
    function(err) {
	if (err) throw err;
	console.log('page saved: ' + name);
	cb();
    }
  );

}

dirFiles({
	path: pathRel('../pages'),
	rec: dirFiles.firstCharNot('._'),
	regexFile: /^(.*)\.html$/,
	processFile: function(file, next) {
		var fpath = node_path.join(file.dir.sub, file.name); //File.dir.name,
		renderTemplate(fpath, function() {
			total += 1;
			next();
		});
	},
	done: function() {
		console.log('FINISHED - ' + total + ' files');
	}
});
