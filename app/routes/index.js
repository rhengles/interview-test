import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.get('store')
		.query('marvel-api-keys', {})
		.then(function(apiKeys) {
			return apiKeys.get('firstObject');
		});
	}
});
