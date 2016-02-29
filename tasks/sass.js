var fs = require('fs');
var node_path = require('path');
var sass = require('node-sass');

var pathSass = pathRel('../sass/main.scss');
var pathCss  = pathRel('../web/css/main.css');
var pathMap  = pathRel('../web/css/main.css.map');
var streamOpt = {defaultEncoding: 'utf8'};

function pathRel(p) {
  return node_path.join(__dirname, p);
}

function save(path, data, cb) {
  var stream = fs.createWriteStream(path, streamOpt);
  stream.end(data);
  stream.on('finish', cb);
}

sass.render({
  file: pathSass,
  outputStyle: 'compressed'
}, function(error, result) { // node-style callback from v3.0.0 onwards
  var doneCss = false;
  var doneMap = false;
  function done() {
    if (doneCss && doneMap) {
      console.log('file '+pathCss+' created successfully');
    }
  }
  if (error) {
    console.log(error.status); // used to be "code" in v2x and below
    console.log(error.column);
    console.log(error.message);
    console.log(error.line);
    process.exit(1); // Código para indicar término com erro
  }
  else {
    console.log(result.stats);

    save(pathCss, result.css, function() {
      doneCss = true;
      done();
    });
    //console.log(result.css.toString());

    save(pathMap, result.map, function() {
      doneMap = true;
      done();
    });

  }
});
