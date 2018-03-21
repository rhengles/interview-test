var RVC = RVC || {};

(function() {

	var env = {};
	var services = {};
	var Utils = RVC.Utils;

	env.name = 'production';
	env.Services = services;
	RVC.Env = env;

	services.hoteis = function(data, cb) {
		return {
			url: 'https://www.raphaelfabeni.com.br/rv/hotels.json'
				+ '?checkin='
				+ Utils.iso8601Date(data.checkin)
				+ '&checkout='
				+ Utils.iso8601Date(data.checkout),
			cb: cb
		};
	};

})();
