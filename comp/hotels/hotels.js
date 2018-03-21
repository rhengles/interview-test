(function() {
	RVC.comp['hotels'] = {
		computed: {
			serviceLoading: function() {
				return this.$store.state.serviceHoteisLoading;
			},
			serviceSuccess: function() {
				return this.$store.state.serviceHoteis;
			},
			serviceError: function() {
				return this.$store.state.serviceHoteisError;
			}
		}
	};
})();