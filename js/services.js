var RVC = RVC || {};

(function() {

	var Utils = RVC.Utils;
	var Env = RVC.Env;

	var services = {
		hoteis: function(data, callback) {
			Utils.loadService({
				req: data,
				envPrepare: Env.Services.hoteis,
				callback: callback,
				reqValidate: function(data) {
					if (!data.checkin) {
						return {
							message: 'Checkin date not informed'
						};
					}
					if (!data.checkout) {
						return {
							message: 'Checkout date not informed'
						};
					}
				},
				dataValidate: function(data) {
					if (!(data && data.hotels)) {
						return {
							message: data && data.message || 'Invalid response returned from server'
						};
					}
				}
			});
		}
	};

	RVC.Services = services;

})();
