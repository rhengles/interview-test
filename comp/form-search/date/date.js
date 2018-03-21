(function() {
	var Utils = RVC.Utils;
	var monthNames = Utils.getMonthNamesEN();
	RVC.comp['form-search/date'] = {
		props: {
			date: {
				type: Object,
				required: true
			}
		},
		computed: {
			monthName: function() {
				var v = this.date.value;
				return v && v instanceof Date && v.getTime()
					? monthNames[v.getMonth()]
					: '';
			},
			day: function() {
				var v = this.date.value;
				return v && v instanceof Date && v.getTime()
					? v.getDate()
					: '';
			},
			year: function() {
				var v = this.date.value;
				return v && v instanceof Date && v.getTime()
					? v.getFullYear()
					: '';
			}
		}
	};
})();