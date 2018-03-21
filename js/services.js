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
							message: 'Data de entrada não informada'
						};
					}
					if (!data.checkout) {
						return {
							message: 'Data de saída não informada'
						};
					}
				},
				dataValidate: function(data) {
					if (!(data && data.hotels)) {
						return {
							message: data && data.message || 'Objeto de hotéis inválido'
						};
					}
				}
			});
		}
	};

	RVC.Services = services;

})();
