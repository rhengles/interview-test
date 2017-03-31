/*
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
});
*/
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
	host: 'https://gateway.marvel.com:443',
	namespace: 'v1/public',
	buildURL: function(type, id, snapshot, requestType, query) {
		var apiKey = query.apiKey;
		query.apiKey = void 0;
		return this._super(type, id, snapshot, requestType, query) +
			this.generateSignature(apiKey);
	},
	generateSignature: function(apiKey){
		var ts = new Date().valueOf();
		return "?ts=" + ts + "&apikey=" + apiKey;
	}
});
