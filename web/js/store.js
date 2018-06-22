(function(global) {
/**
	* action types
	**/

var ActionTypes = {
	ADD_TODO: 'ADD_TODO',
	TOGGLE_TODO: 'TOGGLE_TODO',
	SET_VISIBILITY_FILTER: 'SET_VISIBILITY_FILTER',
	REQUEST: 'REQUEST',
	REQUEST_SUCCESS: 'REQUEST_SUCCESS',
	REQUEST_ERROR: 'REQUEST_ERROR'
};

/**
	* other constants
	**/

var ActionResult = {
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR',
	LOADING: 'LOADING'
};

var VisibilityFilters = {
	SHOW_ALL: 'SHOW_ALL',
	SHOW_COMPLETED: 'SHOW_COMPLETED',
	SHOW_ACTIVE: 'SHOW_ACTIVE'
};

/**
	* action creators
	**/

var ActionCreators = {
	addTodo: function (text) {
		return { type: ActionTypes.ADD_TODO, text: text };
	},
	toggleTodo: function (index) {
		return { type: ActionTypes.TOGGLE_TODO, index: index };
	},
	setVisibilityFilter: function (filter) {
		return { type: ActionTypes.SET_VISIBILITY_FILTER, filter: filter };
	},
	request: function (request) {
		return { type: ActionTypes.REQUEST, request: request };
	},
	requestSuccess: function(request, response) {
		return { type: ActionTypes.REQUEST_SUCCESS, request: request, response: response };
	},
	requestError: function(request, error, response) {
		return { type: ActionTypes.REQUEST_ERROR, request: request, error: error, response: response };
	}
};

var Reducers = {
	todos: function todos(state, action) {
		state || (state = []);
		switch (action.type) {
			case ActionTypes.ADD_TODO:
				return state.concat([
					{
						text: action.text,
						completed: false
					}
				]);
			case ActionTypes.TOGGLE_TODO:
				return state.map(function(todo, index) {
					if (index === action.index) {
						return Object.assign({}, todo, {
							completed: !todo.completed
						});
					}
					return todo;
				});
			default:
				return state;
		}
	},
	visibilityFilter: function visibilityFilter(state, action) {
		state || (state = VisibilityFilters.SHOW_ALL);
		switch (action.type) {
			case ActionTypes.SET_VISIBILITY_FILTER:
				return action.filter
			default:
				return state
		}
	},
	requests: function requests(state, action) {
		state || (state = []);
		switch (action.type) {
			case ActionTypes.REQUEST:
				return state.concat([
					{
						request: action.request,
						status: ActionResult.LOADING,
						response: null,
						error: null
					}
				]);
			case ActionTypes.REQUEST_SUCCESS:
				return state.map(function(item) {
					if (item.request === action.request) {
						return Object.assign({}, item, {
							status: ActionResult.SUCCESS,
							response: action.response
						});
					}
					return item;
				});
			case ActionTypes.REQUEST_ERROR:
				return state.map(function(item) {
					if (item.request === action.request) {
						return Object.assign({}, item, {
							status: ActionResult.ERROR,
							response: action.response,
							error: action.error
						});
					}
					return item;
				});
			default:
				return state;
		}
	}
};

var rootReducer = Redux.combineReducers({
	todos: Reducers.todos,
	visibilityFilter: Reducers.visibilityFilter,
	requests: Reducers.requests
});

var store = Redux.createStore(rootReducer);

global.redux = {
	ActionTypes: ActionTypes,
	ActionResult: ActionResult,
	VisibilityFilters: VisibilityFilters,
	ActionCreators: ActionCreators,
	Reducers: Reducers,
	rootReducer: rootReducer,
	store: store
};

})(BNW);