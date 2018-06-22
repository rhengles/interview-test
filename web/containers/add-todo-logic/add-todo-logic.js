(function(global) {

var ActionCreators = global.redux.ActionCreators;

function mapStateToProps(state, ownProps) {
	return {};
}

function mapDispatchToProps(dispatch, ownProps) {
	return {
		addTodo: function(text) {
			dispatch(ActionCreators.addTodo(text));
			var req = { url: text };
			global.Services.getUrl(req, function(loading, error, data) {
				if (loading) {
					return dispatch(ActionCreators.request(req));
				}
				if (error) {
					return dispatch(ActionCreators.requestError(req, error, data));
				} else {
					return dispatch(ActionCreators.requestSuccess(req, data));
				}
			});
		}
	};
}

global.containerMap['add-todo-logic'] = function(callback) {
	global.loadManager.loadMany({
		AddTodo: 'bnw--add-todo'
	}, function(err, comps) {
		if (err) return callback(err);
		return callback(null, ReactRedux.connect(
			mapStateToProps,
			mapDispatchToProps
		)(comps.AddTodo))
	});
};

})(BNW);