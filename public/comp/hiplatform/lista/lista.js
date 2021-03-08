!function(global) {

global.Comp.map['hiplatform/lista'] = {
	template: null,
	props: {
		lista: Array,
		preKey: String,
	},
	setup: function(_, {emit}) {
		return {
			onItemClick: function(item) {
				emit('item-click', item);
			}
		};
	}
};

}(_app$);
