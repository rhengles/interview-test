
var RVC = RVC || {};

(function() {

var Utils = RVC.Utils;
RVC.comp = {};

var compFactory = {};

Vue.mixin({
	componentDynamic: function(id) {
		//console.log('Component Dynamic: '+id);
		var factory = compFactory[id];
		if (factory) {
			return factory;
		}
		var prefix = 'rvc--';
		var plen = prefix.length;
		if (id.substr(0, plen).toLowerCase() === prefix) {
			var name = id.substr(plen).replace(/--/g,'/');
			var last = name.lastIndexOf('/');
			last = name.substr(last+1);
			var href = (RVC.BaseUrl || '') + '/comp/'+name+'/'+last;
			factory = Utils.componentDynamic(name, href);
			compFactory[id] = factory;
			return factory;
		}
	}
});

Vue.options.componentDynamic('rvc--root')(
	function(compRoot) {
		compRoot.store = RVC.store;
		var CompRoot = Vue.component('rvc--root', compRoot);
		new CompRoot().$mount('#rvc-mount');
	},
	function(err) {
		new Vue({
			el: '#rvc-mount',
			template: Utils.htmlEntitiesEncode(String(err))
		});
	}
);

/*var query = RVC.store.state.query;
if (query.l) {
	RVC.store.dispatch('loadLeadCredit', query.l);
} else if (query.o) {
	RVC.store.dispatch('loadResumoPedido', query.o);
} else if (query.idPlan) {
	var getAbaCanal = function() {
		var aba = RVC.ChatC2c.aba;
		switch(aba) {
			case 'c2c': return 'call';
			case 'chat': return 'chat';
			default: return 'form';
		}
	};
	RVC.store.commit('setChannel', getAbaCanal());
	RVC.store.dispatch('loadPlan', query.idPlan);
}*/

})();
