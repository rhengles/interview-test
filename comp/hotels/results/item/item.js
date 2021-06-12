(function() {
	var Utils = RVC.Utils;
	RVC.comp['hotels/results/item'] = {
		props: {
			hotel: {
				type: Object,
				required: true
			},
			days: {
				type: Number
			},
			show: {
				type: Boolean,
				default: true
			}
		},
		computed: {
		},
		methods: {
			formatPrice(price) {
				price = Number(price);
				return isNaN(price) ? '' : '$'+price.toFixed(2).replace(/\.00$/,'');
			}
		}
	};
})();