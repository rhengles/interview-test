import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	redirectCharacters() {
		this.transitionToRoute('characters');
	},
	redirectLogin() {
		this.transitionToRoute('login');
	}
});
