!function(global) {

global.docMetaDefault = {
	title: 'Vue Next (v3) example',
	description: 'Project scaffolding template for a Single Page Application using Vue 3 components without any build tool during development'
};

var objStr = {}.toString();
global.getErrorMessage = function(err) {
	if ('string' === typeof err) return err;
	else if ('object' === typeof err) {
		if (err instanceof Object) {
			var errStr = err.toString();
			if (errStr === objStr) return JSON.stringify(err);
			else return errStr;
		}
		else return JSON.stringify(err);
	}
	else return typeof err;
};

var hop = Object.prototype.hasOwnProperty;

global.initHiPlatformData = function () {
	var data = global.hiPlatformData;
	if (data) return data;
	global.hiPlatformData = data = {
		lista: Vue.ref(),
		loading: Vue.ref(false),
		error: Vue.ref(),
		getAll: function() {
			return Vue.computed(function() {
				return data.lista.value;
			});
		},
		load: function() {
			console.log(' // init HiPlatform Data: load init');
			if (data.lista.value) return;
			var initial = global.services.initialState;
			initial = initial && initial.hiPlatformData;
			if (initial) {
				return onLoadData(initial);
			} else {
				return data.reload();
			}
		},
		reload: function() {
			console.log(' // init HiPlatform Data: reload init');
			data.loading.value = true;
			data.lista.value = undefined;
			data.error.value = undefined;
			var promise = global.services.getHiPlatformData()
				.then(onLoadDataSuccess);
			promise.catch(onLoadDataError);
			return promise;
		}
	};

	return data;

	function onLoadData(resp) {
		console.log(' // init HiPlatform Data: onLoadUsers init');
		if (resp.error) {
			onLoadDataError(resp);
			return Promise.reject(resp);
		}
		else if (resp.data) {
			onLoadDataSuccess(resp);
			return Promise.resolve(resp);
		}
		else {
			resp.error = new Error('HiPlatform Data not found');
			onLoadDataError(resp);
			return Promise.reject(resp);
		}
	}
	function onLoadDataSuccess(resp) {
		var rdata = resp.data;
		var all = processDataRec(rdata);
		console.log(' // init HiPlatform Data: onLoadDataSuccess init '+all.leavesTotal+' '+all.data.length);
		data.loading.value = false;
		data.lista.value = all;
	}
	function onLoadDataError(resp) {
		console.log(' // init HiPlatform Data: onLoadUsersError init');
		var error = resp.error;
		console.error('Error when loading HiPlatform Data', error);
		data.loading.value = false;
		data.error.value = error;
	}
	function countProps(o) {
		var c = 0;
		if (o) for (var k in o) if (hop.call(o, k)) c += 1;
		return c;
	}
	function processDataRec(data) {
		var leavesTotal = 0;
		data = Object.values(data);
		data.forEach(function(item) {
			var subTotal = countProps(item.children);
			var children, itemLeaves;
			if (subTotal) {
				({
					data: children,
					leavesTotal: itemLeaves,
				} = processDataRec(item.children));
				item.children = children;
				leavesTotal += itemLeaves;
			} else {
				item.children = [];
				itemLeaves = 0;
				leavesTotal += 1;
			}
			item.expandOpen = false;
			item.subTotal = subTotal;
			item.subSelected = 0;
			item.subPartialSelected = 0;
			item.leavesTotal = itemLeaves;
			item.leavesSelected = 0;
			item.selfSelected = false;
		});
		return {data, leavesTotal};
	}
};

global.initHiPlatformData();

global.initUsers = function () {
	var users = global.users;
	if (users) return users;
	global.users = users = {
		lista: Vue.ref(),
		loading: Vue.ref(false),
		error: Vue.ref(),
		getByIndex: function(index) {
			return Vue.computed(function() {
				var lista = users.lista.value;
				return lista instanceof Array ? lista[index] : undefined;
			});
		},
		getAll: function() {
			return Vue.computed(function() {
				return users.lista.value;
			});
		},
		load: function() {
			console.log(' // init users: load init');
			if (users.lista.value instanceof Array) return;
			var initial = global.services.initialState;
			initial = initial && initial.users;
			if (initial) {
				return onLoadUsers(initial);
			} else {
				return users.reload();
			}
		},
		reload: function() {
			console.log(' // init users: reload init');
			users.loading.value = true;
			users.lista.value = undefined;
			users.error.value = undefined;
			var promise = global.services.getUsersLista()
				.then(onLoadUsersSuccess);
			promise.catch(onLoadUsersError);
			return promise;
		}
	};

	return users;

	function onLoadUsers(resp) {
		console.log(' // init users: onLoadUsers init');
		if (resp.error) {
			onLoadUsersError(resp);
			return Promise.reject(resp);
		}
		else if (resp.data) {
			onLoadUsersSuccess(resp);
			return Promise.resolve(resp);
		}
		else {
			resp.error = new Error('User data not found');
			onLoadUsersError(resp);
			return Promise.reject(resp);
		}
	}
	function onLoadUsersSuccess(resp) {
		console.log(' // init users: onLoadUsersSuccess init');
		var data = resp.data;
		users.loading.value = false;
		users.lista.value = data && data.data || [];
	}
	function onLoadUsersError(resp) {
		console.log(' // init users: onLoadUsersError init');
		var error = resp.error;
		console.error('Error when loading users list', error);
		users.loading.value = false;
		users.error.value = error;
	}
};

global.initUsers();

}(_app$);
