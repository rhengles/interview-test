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
			serviceHoteisQuery: null,
			serviceHoteis: null,
			serviceHoteisLoading: false,
			serviceHoteisError: null,
			dateCalendar: (function() {
				var d = new Date();
				return new Date(d.getFullYear(), d.getMonth()+1, 1); // mês seguinte
			}()),
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
					context.commit('setHoteisQuery', requestData);
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
							gtag('event', 'hotel_search_submit', {
								'event_category': 'hotel_search',
								'event_action': 'submit',
								'event_label': [
									Utils.iso8601Date(requestData.checkin),
									Utils.iso8601Date(requestData.checkout)
								].join(' to '),
								'response': error ? 'error' : 'success',
								'error': error ? String(error) : '',
								'hotels': data && data.hotels && data.hotels.length
							});
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
			setHoteisQuery: function(state, query) {
				state.serviceHoteisQuery = query;
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
			setDateCalendar: function(state, date) {
				state.dateCalendar = date;
			},
			setFormSearchDate: function(state, date) {
				var formSearch = state.formSearch;
				var checkin = formSearch.checkin;
				var checkout = formSearch.checkout;
				gtag('event', 'hotel_search_click_date', {
					'event_category': 'hotel_search',
					'event_action': 'click_date',
					'event_label': Utils.iso8601Date(date),
					'previous_checkin': Utils.iso8601Date(checkin.value),
					'previous_checkout': Utils.iso8601Date(checkout.value)
				});
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
