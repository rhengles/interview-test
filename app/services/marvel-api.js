import Ember from 'ember';

export default Ember.Service.extend({
	baseUrl: 'https://gateway.marvel.com:443/v1/public/',
	apikey: '',

	request: function(params) {
		var self = this;
		return new Ember.RSVP.Promise(function(resolve, reject){
			var entity = params.entity;
			delete params.entity;
			params.apikey = params.apikey || self.get('apikey');
			Ember.$.ajax({
				url: self.get('baseUrl')+entity,
				data: params,
				dataType: 'json'
			})
			.done((data, status, jqxhr) => resolve({data, status, jqxhr}))
			.fail((jqxhr, status, error) => reject({error, status, jqxhr}));
		});
	}
});
