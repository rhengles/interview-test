
var BNW = BNW || {};

(function(global) {

var Utils = global.Utils;
global.compMap = {};
global.containerMap = {};

// var componentLoader = Utils.fnComponentLoader({
// 	prefix: 'bnw--',
// 	createElement: React.createElement,
// 	getHref: function(match) {
// 		return global.BaseUrl + '/comp/' + match.href;
// 	},
// 	fnGetJs: function(match) {
// 		return function() {
// 			return global.compMap[match.name];
// 		};
// 	},
// 	subComponentLoader: Comp
// });

function Comp(props) {
	React.Component.call(this, props);
	this.state = {
		component: null,
		error: null
	};
}

Comp.prepareElement = function(element, match) {
	element.props['comp'] = element.type;
	element.type = Comp;
};
Comp.prototype = Object.create(React.Component.prototype);
Comp.prototype.constructor = Comp;
Comp.prototype.componentDidMount = function() {
	var self = this;
	var id = this.props.comp;
	loadManager(id, function(err, comp) {
		if (err) {
			console.error(err, id, self);
			return self.setState({ error: err });
		}
		return self.setState({ component: comp });
	});
};
Comp.prototype.render = function() {
	var C = this.state.component;
	return C ? React.createElement(C, this.props, null) : null;
};

var compLoader = Utils.fnPrefixLoader();
var containerLoader = Utils.fnPrefixLoader();
var loadManager = Utils.fnLoadManager({
	prefixLoaders: [
		compLoader,
		containerLoader
	],
	createElement: React.createElement,
	createElementMods: [
		Utils.fnCreateElement.fixClassName()
	],
});
compLoader.setOpt({
	prefix: 'bnw--',
	loader: Utils.componentDynamic,
	createElement: loadManager.createElement,
	prepareElement: Comp.prepareElement,
	getUrl: function(match) {
		return global.BaseUrl + 'comp/' + match.href;
	},
	setJs: function(match, callback) {
		global.compMap[match.path](function(err, js) {
			match.js = js;
			callback(err);
		});
	}
});
containerLoader.setOpt({
	prefix: 'bnw-container--',
	loader: Utils.componentDynamic,
	createElement: loadManager.createElement,
	prepareElement: Comp.prepareElement,
	getUrl: function(match) {
		return global.BaseUrl + 'containers/' + match.href;
	},
	setJs: function(match, callback) {
		global.containerMap[match.path](function(err, js) {
			match.js = js;
			callback(err);
		});
	},
	pathHtml: function() { return null; }
});

ReactDOM.render(
	loadManager.createElement(
		'bnw--root',
		{ valProp1:{ valProp2:'abc' } }
	),
	document.getElementById('bnw-mount')
);

// global.store.commit('setScreen', 1);

})(BNW);
