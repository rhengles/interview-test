(function() {
	RVC.comp['hotels/results'] = {
		computed: {
			serviceData: function() {
				return this.$store.state.serviceHoteis.hotels;
			}
		}
	};
})();