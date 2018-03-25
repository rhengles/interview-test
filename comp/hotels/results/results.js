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
		},
		data: function() {
			return {
				priceStep: 5,
				priceRangeMin: 0,
				priceRangeMax: 100,
				selectedRangeMin: 0,
				selectedRangeMax: 100,
				selectedRangeMinPos: 0,
				selectedRangeMaxPos: 100,
				minDragStart: 0,
				minDragLastPos: 0,
				minDragPos: 0,
				minDragValue: 0,
				maxDragStart: 0,
				maxDragLastPos: 0,
				maxDragPos: 0,
				maxDragValue: 0,
				rangeTrackLength: 0
			}
		},
		methods: {
			holdHandleMin: function(ev) {
				// console.log(ev);
				this.minDragStart = ev.pageX;
				this.minDragLastPos = 0;
				this.$root.observeMouseDrag();
				this.$root.$on('mousemove', this.moveHandleMin);
				this.$root.$on('mouseup', this.releaseHandleMin);
				ev.preventDefault();
			},
			moveHandleMin: function(ev) {
				var p = ev.pageX - this.minDragStart;
				var m = p - this.minDragLastPos;
				this.minDragLastPos = p;
				// console.log('move min', p, m);
				var pos = this.selectedRangeMinPos + p;
				var step = this.priceStep;
				var trackLen = this.rangeTrackLength;
				var prMin = this.priceRangeMin;
				var prMax = this.priceRangeMax;
				var prRange = prMax - prMin;
				var stepPos = trackLen / (prRange / step);
				var posStep = Math.round(pos/stepPos)*stepPos;
				posStep = Math.max(posStep, 0);
				posStep = Math.min(posStep, this.selectedRangeMaxPos);
				var posValue = (posStep / trackLen) * prRange + prMin;
				posValue = Math.round(posValue/step)*step;
				pos = Math.round(posStep);
				this.minDragPos = pos;
				this.minDragValue = posValue;
			},
			releaseHandleMin: function (ev) {
				this.moveHandleMin(ev);
				this.selectedRangeMinPos = this.minDragPos;
				this.$root.$off('mousemove', this.moveHandleMin);
				this.$root.$off('mouseup', this.releaseHandleMin);
			},
			holdHandleMax: function(ev) {
				// console.log(ev);
				this.maxDragStart = ev.pageX;
				this.maxDragLastPos = 0;
				this.$root.observeMouseDrag();
				this.$root.$on('mousemove', this.moveHandleMax);
				this.$root.$on('mouseup', this.releaseHandleMax);
				ev.preventDefault();
			},
			moveHandleMax: function(ev) {
				var p = ev.pageX - this.maxDragStart;
				var m = p - this.maxDragLastPos;
				this.maxDragLastPos = p;
				// console.log('move max', p, m);
				var pos = this.selectedRangeMaxPos + p;
				var step = this.priceStep;
				var trackLen = this.rangeTrackLength;
				var prMin = this.priceRangeMin;
				var prMax = this.priceRangeMax;
				var prRange = prMax - prMin;
				var stepPos = trackLen / (prRange / step);
				var posStep = Math.round(pos/stepPos)*stepPos;
				posStep = Math.max(posStep, this.selectedRangeMinPos);
				posStep = Math.min(posStep, this.rangeTrackLength);
				var posValue = (posStep / trackLen) * prRange + prMin;
				posValue = Math.round(posValue/step)*step;
				pos = Math.round(posStep);
				this.maxDragPos = pos;
				this.maxDragValue = posValue;
			},
			releaseHandleMax: function(ev) {
				this.moveHandleMax(ev);
				this.selectedRangeMaxPos = this.maxDragPos;
				this.$root.$off('mousemove', this.moveHandleMax);
				this.$root.$off('mouseup', this.releaseHandleMax);
			},
			formatPrice(price) {
				price = Number(price);
				return isNaN(price) ? '' : '$'+price.toFixed(2).replace(/\.00$/,'');
			}
		},
		created: function() {
			var min;
			var max;
			Utils.forEach(this.serviceData, function(hotel) {
				var price = hotel.price;
				if (!isNaN(+price)) {
					if (null == min || price < min) {
						min = price;
					}
					if (null == max || price > max) {
						max = price;
					}
				}
			});
			var step = this.priceStep;
			if (step) {
				min = Math.floor(min/step)*step;
				max = Math.ceil(max/step)*step;
			}
			this.priceRangeMin = min;
			this.selectedRangeMin = min;
			this.minDragValue = min;
			this.priceRangeMax = max;
			this.selectedRangeMax = max;
			this.maxDragValue = max;
		},
		mounted: function() {
			var maxPos = this.$refs.priceRangeTrack.offsetWidth;
			this.rangeTrackLength = maxPos;
			this.maxDragPos = maxPos;
			this.selectedRangeMaxPos = maxPos;
		}
	};
})();