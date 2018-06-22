(function(global) {

	var env = {};
	var services = {};
	var Utils = global.Utils;

	env.name = 'local';
	env.Services = services;
	global.Env = env;

	services.getUrl = function(req, cb) {
		return {
			req: {
				url: req.url
			},
			cb: cb
		};
	};

})(BNW);
