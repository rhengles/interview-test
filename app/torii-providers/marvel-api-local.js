/* eslint no-console:1 */

import Ember from 'ember';

export default Ember.Object.extend({
  marvelApi: Ember.inject.service(),

  // credentials as passed from torii.open
  open: function(credentials){
    //console.log(credentials);
    var self = this;
    return new Ember.RSVP.Promise(function(resolve, reject){
      //reject({error: 'Not implemented'});

      self.get('marvelApi').request({
        entity: 'creators',
        firstName: 'Stan',
        lastName: 'Lee',
        // a primeira chamada vai como teste
        apikey: credentials.publicKey
      })
      .then(function(/*result*/) { // @TODO inspecionar resultado pra ver se é válido
        //console.log('OK', result);
        self.get('marvelApi').set('apikey', credentials.publicKey);
        resolve(credentials);
      })
      .catch(function(reason) {
        //console.log('FAIL', reason);
        reject(reason);
      });

    });
  }
});
