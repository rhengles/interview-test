(function() {

var Utils = RVC.Utils;

RVC.comp['root'] = {
	computed: {
	},
	data: function() {
		return {
			scrollRevert: false,
			mousemove: null,
			mouseup: null
		};
	},
	methods: {
		rootClick: function(event) {
			this.$root.$emit('rootClick', event);
		},
		pageScroll: function() {
			// console.log('pageScroll', window.scrollX, window.scrollY);
			var ws = [
				window.scrollX,
				window.scrollY
			];
			if (this.scrollRevert) {
				var ps = this.$store.state.pageScroll;
				// console.log('scroll reverted', ps, ws);
				window.scrollTo(ps[0], ps[1]);
			} else {
				this.$store.commit('setPageScroll', ws);
				this.scrollEventDebounce();
			}
		},
		revertNextScroll: function() {
			this.scrollRevert = true;
			var vm = this;
			setTimeout(function() {
				vm.scrollRevert = false;
			}, 30);
		},
		observeMouseDrag: function() {
			var self = this;
			var docEl = document.documentElement;
			this.mousemove = function(ev) {
				self.$emit('mousemove', ev);
			};
			this.mouseup = function(ev) {
				docEl.removeEventListener('mousemove', this.mousemove, false);
				docEl.removeEventListener('mouseup', this.mouseup, false);
				self.mousemove = null;
				self.mouseup = null;
				self.$emit('mouseup', ev);
			};
			docEl.addEventListener('mousemove', this.mousemove, false);
			docEl.addEventListener('mouseup', this.mouseup, false);
		}
	},
	created: function() {
		var vm = this;
		this.scrollEventDebounce = Utils.debounce(function() {
			vm.$root.$emit('pageScroll');
		}, 20);
	},
	mounted: function() {
		window.addEventListener('scroll', this.pageScroll);
	},
	beforeDestroy: function() {
		window.removeEventListener('scroll', this.pageScroll);
	}
};

})();
