(function() {
	var Utils = RVC.Utils;
	var monthNames = Utils.getMonthNamesEN();
	var weekDayNames = Utils.getWeekDayNamesEN();
	RVC.comp['calendar'] = {
		props: {
			date: {
				type: Date,
				required: true
			},
			selectionStart: {
				type: Date,
				required: false
			},
			selectionEnd: {
				type: Date,
				required: false
			},
		},
		computed: {
			daysHeader: function() {
				var dh = [];
				Utils.forEach(weekDayNames, function(d) {
					dh.push(d.substr(0,1));
				});
				return dh;
			},
			monthName: function() {
				return monthNames[this.date.getMonth()];
			},
			year: function() {
				return this.date.getFullYear();
			},
			monthStart: function() {
				var d = this.date;
				return new Date(d.getFullYear(), d.getMonth(), 1);
			},
			monthEnd: function() {
				var d = this.date;
				return new Date(d.getFullYear(), d.getMonth()+1, 0);
			},
			weeks: function() {
				var monthStart = this.monthStart;
				var monthEnd = this.monthEnd;
				var lastDayOfMonth = monthEnd.getDate();
				var currentDate = new Date(monthStart);
				var weeks = [];
				while (currentDate <= monthEnd) {
					var weekDay = currentDate.getDay();
					var monthDay = currentDate.getDate();
					var week = [];
					for ( var i = 0; i < 7; i++ ) {
						var currentMonthDay = monthDay + i - weekDay;
						var currentMonthDate = null;
						if (1 <= currentMonthDay && currentMonthDay <= lastDayOfMonth) {
							currentMonthDate = new Date(
								currentDate.getFullYear(),
								currentDate.getMonth(),
								currentMonthDay
							);
						}
						week.push(currentMonthDate);
					}
					currentDate.setDate(monthDay + 7 - weekDay);
					weeks.push(week);
				}
				return weeks;
			}
		},
		methods: {
			clickDay: function(date) {
				if (!date) return;
				this.$emit('clickDay', date);
			},
			changeMonth: function(change) {
				var d = this.date;
				d = new Date(d.getFullYear(), d.getMonth()+change, 1);
				this.$store.commit('setDateCalendar', d);
			}
		}
	};
})();