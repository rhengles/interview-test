var path = require('path');
var httpServer = require('http-server');

var port = 8572;

function pathRel(p) {
  return path.join(__dirname, p);
}

httpServer.createServer({
  root: pathRel('../web')
}).listen(port, function() {
  console.log('Server running on port '+port);
});
