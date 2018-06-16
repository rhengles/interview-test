
var BNW = BNW || {};

(function(global) {

var Utils = global.Utils;
global.compMap = {};

var compPrefix = 'bnw--';
var compFactory = {};

function Comp(props) {
	React.Component.call(this, props);
	this.state = {
		component: null,
		error: null
	};
}

Comp.prototype = Object.create(React.Component.prototype);
Comp.prototype.constructor = Comp;
Comp.prototype.componentDidMount = function() {
	var self = this;
	var callerProps = this.props;
	var id = callerProps.comp;
	var comp = compFactory[id];
	if (comp) {
		return this.setState({ component: comp });
	}
	var match = Utils.compPrefixPath(compPrefix, id);
	if (match) {
		var href = global.BaseUrl + '/comp/' + match.href;
		var load = Utils.componentDynamic(match.name, href, global.compMap);
		load(function resolve(obj) {
			comp = obj.js;
			var html = buble.transform(obj.html, {jsx:'h'}).code;
			html = new Function('h', 'props', 'state', 'Utils', 'return ('+html+');');
			var h = function() {
				var type = arguments[0];
				var attrs = arguments[1] = arguments[1] || {};
				var typeMatch = Utils.compPrefixPath(compPrefix, type);
				if (typeMatch) {
					attrs['comp'] = type;
					arguments[0] = type = Comp;
				}
				if ('class' in attrs) {
					attrs.className = attrs['class'];
					delete attrs['class'];
				}
				return React.createElement.apply(React, arguments);
			};
			comp.prototype.render = function() {
				return html.call(this, h, callerProps, this.state, Utils);
			};
			return self.setState({ component: comp });
		}, function reject(obj) {
			console.error(obj);
			return self.setState({ error: obj });
		});
	} else {
		console.error(new Error('Unknown component '+id));
	}
};
Comp.prototype.render = function() {
	var C = this.state.component;
	return C ? React.createElement(C, this.props, null) : null;
};

ReactDOM.render(
	React.createElement(
		Comp,
		{ comp: 'bnw--root', valProp1:{ valProp2:'abc' } },
		null
	),
	document.getElementById('bnw-mount')
);

// global.store.commit('setScreen', 1);

})(BNW);
