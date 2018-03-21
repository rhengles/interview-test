var RVC = RVC || {};

(function() {

	var Utils = RVC.Utils;
	var services = RVC.Services;
	var hasOwnProperty = Object.prototype.hasOwnProperty;

	var store = new Vuex.Store({
		state: {
			baseUrl: (RVC.BaseUrl || ''),
			query: Utils.parseQuery(location.search),
			pageScroll: [0, 0],
			serviceHoteis: null,
			serviceHoteisLoading: false,
			serviceHoteisError: null,
			formSearch: {
				checkin: {
					label: 'Check-in',
					value: null
				},
				checkout: {
					label: 'Check-out',
					value: null
				}
			}
		},
		getters: {
			getHoteisRequestData: function(state) {
				return function() {
					return {
						checkin: state.formSearch.checkin.value,
						checkout: state.formSearch.checkout.value
					};
				};
			}
		},
		actions: {
			formSearchSubmit: function(context) {
				return context.dispatch('loadHoteis');
			},
			loadHoteis: function(context) {
				return new Promise(function(resolve, reject) {
					var requestData = context.getters.getHoteisRequestData();
					context.commit('setHoteisError', null);
					context.commit('setHoteis', null);
					services.hoteis(
						requestData,
						function(loading, error, data) {
							context.commit('setHoteisLoading', loading);
							if (loading) return;
							if (error) {
								context.commit('setHoteisError', error);
							} else {
								context.commit('setHoteis', data);
							}
							resolve();
						}
					);
				});
			}
		},
		mutations: {
			setPageScroll: function(state, ps) {
				var sps = state.pageScroll;
				if (ps[0] != null && !isNaN(+ps[0])) sps[0] = ps[0];
				if (ps[1] != null && !isNaN(+ps[1])) sps[1] = ps[1];
			},
			setHoteis: function(state, data) {
				state.serviceHoteis = data;
			},
			setHoteisLoading: function(state, loading) {
				state.serviceHoteisLoading = loading;
			},
			setHoteisError: function(state, error) {
				state.serviceHoteisError = error;
			},
			setFormSearchDate: function(state, date) {
				var formSearch = state.formSearch;
				var checkin = formSearch.checkin;
				var checkout = formSearch.checkout;
				if (!checkin.value) {
					checkin.value = date;
				} else if (date < checkin.value) {
					if (!checkout.value) {
						checkout.value = checkin.value;
					}
					checkin.value = date;
				} else if (checkin.value && checkin.value.getTime() === date.getTime()) {
					if (checkout.value && checkin.value.getTime() === checkout.value.getTime()) {
						checkin.value = checkout.value = null;
					} else {
						checkin.value = checkout.value;
						checkout.value = null;
					}
				} else if (checkout.value && checkout.value.getTime() === date.getTime()) {
					if (checkin.value && checkout.value.getTime() === checkin.value.getTime()) {
						checkout.value = checkin.value = null;
					} else {
						checkout.value = null;
					}
				} else {
					checkout.value = date;
				}
			}
		}
	});
	RVC.store = store;

})();
