import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: [{
		charactersOffset: 'offset'
	}],
	inputPrivate: '',
	inputPublic: '',
	charactersOffset: 0,
	actions: {
		login() {
			var self = this;
			/*console.log(
				this.get('inputPrivate'),
				this.get('inputPublic')
			);*/
			var model = this.get('store').createRecord('marvel-api-keys', {
				public: this.get('inputPublic'),
				private: this.get('inputPrivate')
			});
			model.save().then(function(model) {
				self.set('model', model);
			}).catch(function(reason) {
				console.log('error signing in:', reason);
			});
		},
		logout() {
			var self = this;
			var model = this.get('model');
			if (model) {
				model.deleteRecord();
				model.save().then(function() {
					self.set('model', null);
				}).catch(function(reason) {
					console.log('error signin out:', reason);
				});
			}
		}
	}
});
