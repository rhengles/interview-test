(function(global) {

	var Utils = global.Utils;
	var Env = global.Env;

	var services = {
		getUrl: function(req, callback) {
			Utils.loadService({
				req: req,
				asText: true,
				envPrepare: Env.Services.getUrl,
				callback: callback,
				reqValidate: function(req) {
					if (!req || (!req.url)) {
						return {
							message: 'URL da solicitação não informada'
						};
					}
				},
				dataValidate: function(data) {
					if (!data) {
						return {
							message: 'Resposta vazia do servidor'
						};
					}
				}
			});
		},
	};

	global.Services = services;

})(BNW);
