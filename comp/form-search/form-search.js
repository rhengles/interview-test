(function() {
	RVC.comp['form-search'] = {
		computed: {
			checkin: function() {
				return this.$store.state.formSearch.checkin;
			},
			checkout: function() {
				return this.$store.state.formSearch.checkout;
			},
			dateCalendar: function() {
				// return new Date(2017, 7, 1);
				return this.$store.state.dateCalendar;
			}
		},
		methods: {
			calendarClickDay: function(date) {
				// console.log(date);
				this.$store.commit('setFormSearchDate', date);
			},
			clickSearch: function() {
				this.$store.dispatch('formSearchSubmit');
			}
		}
	};
})();