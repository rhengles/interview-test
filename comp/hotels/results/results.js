(function() {
	var Utils = RVC.Utils;
	var monthNames = Utils.getMonthNamesEN();
	RVC.comp['hotels/results'] = {
		computed: {
			dateStart: function() {
				var query = this.$store.state.serviceHoteisQuery;
				var checkin = query.checkin;
				var checkout = query.checkout;
				var yearEq = checkin.getFullYear() === checkout.getFullYear();
				var monthEq = yearEq && (checkin.getMonth() === checkout.getMonth());
				return monthNames[checkin.getMonth()] +
					' ' + checkin.getDate() +
					(yearEq ? '' : ', ' + checkin.getFullYear());
			},
			dateEnd: function() {
				var query = this.$store.state.serviceHoteisQuery;
				var checkin = query.checkin;
				var checkout = query.checkout;
				var yearEq = checkin.getFullYear() === checkout.getFullYear();
				var currentYearEq = (new Date).getFullYear() === checkout.getFullYear();
				var monthEq = yearEq && (checkin.getMonth() === checkout.getMonth());
				return (monthEq ? '' : monthNames[checkout.getMonth()] + ' ') +
					checkout.getDate() +
					(yearEq && currentYearEq ? '' : ', ' + checkout.getFullYear());
			},
			totalDays: function() {
				var query = this.$store.state.serviceHoteisQuery;
				var checkin = query.checkin.getTime();
				var checkout = query.checkout.getTime();
				var msPerDay = 1000 * 60 * 60 * 24;
				return Math.round((checkout - checkin) / msPerDay) + 1;
			},
			serviceData: function() {
				return this.$store.state.serviceHoteis.hotels;
			}
		}
	};
})();