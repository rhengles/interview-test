var fs = require('fs');
var node_path = require('path');
var nunjucks = require('nunjucks');
var dir = require('./includes/dir');

function pathRel(p) {
  return node_path.join(__dirname, p);
}

var reFile = /^(.*)\.html$/;

var loader = new nunjucks.FileSystemLoader(pathRel('../pages'));
var env = new nunjucks.Environment(loader);

function renderTemplate(name, cb) {

  fs.writeFile(
    pathRel('../web/'+name),
    env.render(name), function(err) {
      if (err) throw err;
      console.log('page saved: '+name);
      cb();
    });

}

function nextFile() {
	diter(function(err, file) {
		if (err) throw err;
		if (file) {
			if ( !file.stat.isFile() || !reFile.test(file.name) ) {
				setTimeout(nextFile, 0);
				return;
			}
			var fpath = node_path.join(file.dir.sub, file.name); //file.dir.name,
      renderTemplate(fpath, function() {
        total += 1;
        setTimeout(nextFile, 0);
      });
		} else {
			console.log('FINISHED - '+total+' files');
		}
	});
}

var diter = dir(
	{ path: pathRel('../pages')
	//, verbose: true
	, stat: true
	, rec: function(file, dir) {
  		var char0 = file.name.charAt(0);
  		return char0 != '.'
  			&& char0 != '_';
	  }
	});
var total = 0;

nextFile();
