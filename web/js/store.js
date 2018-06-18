/**
	* action types
	**/
​
var Actions = {
	ADD_TODO: 'ADD_TODO',
	TOGGLE_TODO: 'TOGGLE_TODO',
	SET_VISIBILITY_FILTER: 'SET_VISIBILITY_FILTER'
​};

/**
	* other constants
	**/
​
var VisibilityFilters = {
	SHOW_ALL: 'SHOW_ALL',
	SHOW_COMPLETED: 'SHOW_COMPLETED',
	SHOW_ACTIVE: 'SHOW_ACTIVE'
};
​
/**
	* action creators
	**/
​
var ActionCreators = {
	addTodo: function (text) {
	  return { type: ADD_TODO, text }
	},
	toggleTodo: function (index) {
	  return { type: TOGGLE_TODO, index }
	},
	setVisibilityFilter: function (filter) {
	  return { type: SET_VISIBILITY_FILTER, filter }
	}
};

function todos(state, action) {
	state || (state = []);
	switch (action.type) {
		case Actions.ADD_TODO:
			return state.concat([
				{
					text: action.text,
					completed: false
				}
			]);
		case Actions.TOGGLE_TODO:
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
}
​
function visibilityFilter(state, action) {
	state || (state = VisibilityFilters.SHOW_ALL);
	switch (action.type) {
		case Actions.SET_VISIBILITY_FILTER:
			return action.filter
		default:
			return state
	}
}

var todoApp = Redux.combineReducers({
	visibilityFilter: visibilityFilter,
	todos: todos
});

var store = Redux.createStore(todoApp);