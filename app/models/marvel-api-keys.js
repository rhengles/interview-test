import DS from 'ember-data';

export default DS.Model.extend({
  public: DS.attr('string'),
  private: DS.attr('string')
});
