!function(global) {

global.Comp.map['hiplatform/item'] = {
	template: null,
	props: {
		item: Object,
		preKey: String,
	},
	setup: function(props, {emit}) {
		var numChildren = Vue.ref(props.item.children.length);
		return {
			numChildren,
			onItemClick: function(item) {
				emit('item-click', item);
			},
			onClickExpand: function() {
				var item = props.item;
				item.expandOpen = !item.expandOpen;
			}
		};
	}
};

}(_app$);
