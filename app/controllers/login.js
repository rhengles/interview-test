import Ember from 'ember';

export default Ember.Controller.extend({
	/*inputPrivate: '',
	inputPublic: '',
	actions: {
		login() {
			var self = this;
			/.*console.log(
				this.get('inputPrivate'),
				this.get('inputPublic')
			);*./
			var model = this.get('store').createRecord('marvel-api-keys', {
				public: this.get('inputPublic'),
				private: this.get('inputPrivate')
			});
			model.save().then(function(model) {
				self.set('model', model);
			}).catch(function(reason) {
				console.log('error signing in:', reason);
			});
		}
	}*/
	session: Ember.inject.service('session'),

	actions: {
		authenticate() {
			let credentials = this.getProperties('publicKey', 'privateKey');
			this.get('session').authenticate('authenticator:torii', 'marvel-api-local', credentials).catch((reason) => {
				console.log(reason);
				this.set('errorMessage', reason.error || reason);
			});
		}
	}
});
