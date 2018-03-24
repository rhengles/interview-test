
var RVC = RVC || {};

(function (){

var Utils = {};
RVC.Utils = Utils;

function AjaxError(message, xhr, error) {
	this.name = 'AjaxError';
	this.message = message;
	this.xhr = xhr;
	this.error = error;
	this.stack = (new Error()).stack;
}
AjaxError.prototype = new Error;

Utils.AjaxError = AjaxError;

Utils.forEach = function forEach(list, cb, result) {
	var _break = 1 << 0;
	var _remove = 1 << 1;
	var count = list.length;
	var i;
	if (result instanceof Function && !(cb instanceof Function)) {
		result = [result, cb];
		cb = result[0];
		result = result[1];
	}
	var ctx = {
		_break,
		_remove,
		result: result,
		count: list.length,
		i: 0
	};
	var ret;
	for ( ; ctx.i < ctx.count; ctx.i++ ) {
		ret = cb.call(ctx, list[ctx.i], ctx.i, list);
		if (_remove & ret) {
			list.splice(ctx.i, 1);
			ctx.i--;
			ctx.count--;
		}
		if (_break & ret) {
			break;
		}
	}
	return ctx.result;
};

var hop = Object.prototype.hasOwnProperty;

Utils.forEachProperty = function forEachProperty(obj, cb) {
	var _break = 1 << 0;
	var i = 0;
	var ctx = {
		_break: _break
	};
	var ret;
	for ( var k in obj ) {
		if ( !hop.call(obj, k) ) continue;
		ret = cb.call(ctx, obj[k], k, i);
		if (_break & ret) {
			break;
		}
		i++;
	}
};

Utils.padStart = function padStart(str, len, chars) {
	var strLen = str.length;
	if (strLen >= len) return str;
	var chLen = chars.length;
	var pad = '';
	var padLen = 0;
	var remain = len - strLen;
	while (padLen < remain) {
		pad += chars;
		padLen += chLen;
	}
	return pad.substr(0, remain) + str;
};

Utils.repeat = function repeat(times, item) {
	var list = [];
	while (times) {
		list.push(item);
		times--;
	}
	return list;
};

Utils.parseQuery = function parseQuery(param) {
	param = String(param).replace(/^\?/, '').split('&');
	var obj = {};
	for (var i = 0; i < param.length; i++) {
		var pi = param[i];
		if (!pi) continue;
		var eqpos = pi.indexOf('=');
		//var pair = param[i].split('=');
		var name = window.decodeURIComponent(eqpos==-1?pi:pi.substr(0,eqpos));
		var value = window.decodeURIComponent(eqpos==-1?true:pi.substr(eqpos+1));
		obj[name] = value;
	}
	return obj;
};

Utils.debounce = function debounce(fn, wait) {
	function cancel() {
		_iv && clearTimeout(_iv);
		_iv = null;
	}
	function trigger() {
		cancel();
		_iv = setTimeout(fn, wait);
	}
	function customWait(wait) {
		cancel();
		_iv = setTimeout(fn, wait);
	}
	var _iv;
	trigger.cancel = cancel;
	trigger.customWait = customWait;
	return trigger;
};

Utils.isChildOf = function isChildOf(el, compare) {
	while(el) {
		if (el === compare) {
			return true;
		}
		el = el.parentNode;
	}
	return false;
};

Utils.getEstados = function getEstados() {
	return [
		{ uf: 'AC', nome: 'Acre' },
		{ uf: 'AL', nome: 'Alagoas' },
		{ uf: 'AM', nome: 'Amazonas' },
		{ uf: 'AP', nome: 'Amapá' },
		{ uf: 'BA', nome: 'Bahia' },
		{ uf: 'CE', nome: 'Ceará' },
		{ uf: 'DF', nome: 'Distrito Federal' },
		{ uf: 'ES', nome: 'Espírito Santo' },
		{ uf: 'GO', nome: 'Goiás' },
		{ uf: 'MA', nome: 'Maranhão' },
		{ uf: 'MG', nome: 'Minas Gerais' },
		{ uf: 'MS', nome: 'Mato Grosso do Sul' },
		{ uf: 'MT', nome: 'Mato Grosso' },
		{ uf: 'PA', nome: 'Pará' },
		{ uf: 'PB', nome: 'Paraíba' },
		{ uf: 'PE', nome: 'Pernambuco' },
		{ uf: 'PI', nome: 'Piauí' },
		{ uf: 'PR', nome: 'Paraná' },
		{ uf: 'RJ', nome: 'Rio de Janeiro' },
		{ uf: 'RN', nome: 'Rio Grande do Norte' },
		{ uf: 'RO', nome: 'Rondônia' },
		{ uf: 'RR', nome: 'Roraima' },
		{ uf: 'RS', nome: 'Rio Grande do Sul' },
		{ uf: 'SE', nome: 'Sergipe' },
		{ uf: 'SC', nome: 'Santa Catarina' },
		{ uf: 'SP', nome: 'São Paulo' },
		{ uf: 'TO', nome: 'Tocantins' }
	];
};

Utils.getMonthNamesEN = function getMonthNamesEN() {
	return [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
};

Utils.getWeekDayNamesEN = function getWeekDayNamesEN() {
	return [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];
};

Utils.iso8601Date = function iso8601Date(date) {
	if ('string' === typeof date) {
		date = new Date(date);
	}
	if (!(date && date instanceof Date && date.getTime())) {
		return;
	}
	return [
		Utils.padStart(String(date.getFullYear()), 4, '0'),
		Utils.padStart(String(date.getMonth()+1), 2, '0'),
		Utils.padStart(String(date.getDate()), 2, '0'),
	].join('-');
};

Utils.loadScript = function loadScript(url, cb) {
	var script = document.createElement('script');
	var head = document.getElementsByTagName('head')[0];
	var done = false;
	script.addEventListener('load', function() {
		if (done) {
			console.log('load script too late: ' + url);
			return;
		}
		done = true;
		cb();
	});
	script.addEventListener('error', function(err) {
		if (done) {
			console.log('error script too late: ' + url);
			return;
		}
		done = true;
		cb(err);
	})
	setTimeout(function() {
		if (done) return;
		cb(new Error('load script timeout: '+url));
	}, 30000);
	script.src = url;
	head.appendChild(script);
};

Utils.loadStylesheet = function loadStylesheet(url, cb) {
	var link = document.createElement('link');
	var head = document.getElementsByTagName('head')[0];
	var done = false;
	link.setAttribute('rel', 'stylesheet');
	link.addEventListener('load', function() {
		if (done) {
			console.log('load stylesheet too late: ' + url);
			return;
		}
		done = true;
		cb();
	});
	link.addEventListener('error', function(err) {
		if (done) {
			console.log('error stylesheet too late: ' + url);
			return;
		}
		done = true;
		cb(err);
	})
	setTimeout(function() {
		if (done) return;
		cb(new Error('load stylesheet timeout: '+url));
	}, 30000);
	link.href = url;
	head.appendChild(link);
};

Utils.loadAjax = function loadAjax(opt) {
	var req = new XMLHttpRequest;
	var head = opt.headers;
	req.addEventListener('load', function() {
		var err = null;
		if (req.status < 200 || req.status >= 300) {
			err = new AjaxError('HTTP '+req.status+' '+req.statusText, req);
		}
		opt.cb(err, req.responseText, req);
	});
	req.addEventListener('error', function(err) {
		opt.cb(new AjaxError('Erro de rede', req, err), null, req);
	});
	req.open(opt.method || 'GET', opt.url);
	if (head) {
		Utils.forEach(head, function(h) {
			req.setRequestHeader(h.name, h.value);
		});
	}
	req.send(opt.body);
};

Utils.loadService = function(opt) {
	var req = opt.req;
	var callback = opt.callback;
	var reqError = opt.reqValidate(req);
	if ( reqError ) {
		return callback(false, reqError);
	}
	Utils.loadAjax(opt.envPrepare(req, function(err, data) {
		if (err) {
			return callback(false, {
				message: 'Erro ao carregar o serviço',
				error: err
			});
		}
		try {
			data = JSON.parse(data);
		} catch (e) {
			return callback(false, {
				message: 'Resposta inválida do serviço',
				error: e
			});
		}
		var dataError = opt.dataValidate(data);
		if ( dataError ) {
			return callback(false, dataError);
		}
		return callback(false, null, data);
	}));
	return callback(true);
};

Utils.htmlEntitiesEncode = function(str) {
	var text = document.createTextNode(str);
	var div = document.createElement('div');
	div.appendChild(text);
	return div.innerHTML;
};

Utils.htmlEntitiesDecode = function(str) {
	var div = document.createElement('div');
	div.innerHTML = str.replace(/</g,'&lt;').replace(/>/g,'&gt;');
	return div.firstChild.nodeValue;
};

Utils.easing = (function() {
	/**
	 * @param t
	 * Current time, starting at zero.
	 * @param b
	 * Starting value to ease.
	 * @param c
	 * Ending value.
	 * @param d
	 * Duration in time.
	 */
	function inter(t,b,c,d,fn) {
		return fn(t/d)*(c-b)+b;
	}
	function interMod(t,b,c,d,ease,mod) {
		return mod(t/d, ease)*(c-b)+b;
	}
	var ease = {
		linear: function(x) {
			return x;
		},
		sin: function(x) {
			return 1-Math.sin((1-x)*0.5*Math.PI);
		},
		quad: function(x) {
			return x*x;
		},
		cubic: function(x) {
			return x*x*x;
		},
		quart: function(x) {
			return x*x*x*x;
		}
	};
	var mod = {
		in: function(t, fn) {
			return fn(t);
		},
		out: function(t, fn) {
			return 1-fn(1-t);
		},
		twice: function(t, fn) {
			return fn(t*2)*0.5;
		},
		inOut: function(t, fn) {
			return ( t < 0.5
				? mod.twice(t, fn)
				: mod.out(t, fnMod(fn, mod.twice))
				);
		},
		outIn: function(t, fn) {
			return ( t < 0.5
				? mod.twice(t, fnMod(fn, mod.out))
				: mod.twice(t-0.5, fn)+0.5
				);
		}
	};
	function fnMod(fn, mod) {
		return function(t) {
			return mod(t, fn);
		}
	}
	function fnInter(fn) {
		return function(t,b,c,d) {
			return inter(t,b,c,d,fn);
		};
	}
	return {
		inter: inter,
		interMod: interMod,
		ease: ease,
		mod: mod,
		fnMod: fnMod,
		fnInter: fnInter
	};
})();

Utils.cookie = (function() {

function cookieSet(name, value, days, path, secure) {
	var date = new Date();
	var expires = '';
	var type = typeof (value);
	var valueToUse = '';
	var secureFlag = '';
	path = path || '/';
	if (days) {
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = '; expires=' + date.toUTCString();
	}
	if (type === 'object') {
		valueToUse = encodeURIComponent(JSON.stringify({'': value}));
	} else {
		valueToUse = encodeURIComponent(value);
	}
	if (secure) {
		secureFlag = '; secure';
	}
	document.cookie = name + '=' + valueToUse + expires + '; path=' + path + secureFlag;
}
var objectKey = '{\\:;/}';
var objectPrefix = '{'+JSON.stringify(objectKey)+':';
function cookieGet(name) {
	var nameEQ = name && (name + '=');
	var ca = document.cookie.split(';');
	var value = '';
	var parsed;
	var firstChars;
	var map = (name == null) ? {} : null;
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (map) {
			name = c.substring(0, c.indexOf('='));
			nameEQ = name + '=';
		}
		if (map || c.substring(0, nameEQ.length).indexOf(nameEQ) === 0) {
			value = decodeURIComponent(c.substring(nameEQ.length, c.length));
			if (value == 'undefined') {
				parsed = undefined;
			} else if (value.substring(0, objectPrefix.length) === objectPrefix) {
				try {
					parsed = JSON.parse(value);
					if (objectKey in parsed) parsed = parsed[objectKey];
				} catch (e) {
					parsed = value;
				}
			} else {
				parsed = value;
			}
			if (map) {
				map[name] = parsed;
			} else {
				return parsed;
			}
		}
	}
	return map;
}
function cookieRemove(name) {
	cookieSet(name, '', -1);
}
return {
	get: cookieGet,
	set: cookieSet,
	remove: cookieRemove
};

})();

Utils.digitoVerificador = (function() {

function verifica_cpf_cnpj(valor) {
	valor = String(valor).replace(/[^0-9]/g, '');
	if (valor.length === 11) {
		return 'CPF';
	} else if (valor.length === 14) {
		return 'CNPJ';
	} else {
		return false;
	}
}

function calc_digitos_posicoes(digitos, posicoes, soma_digitos) {
	soma_digitos || (soma_digitos = 0);
	digitos = String(digitos);
	for (var i = 0; i < digitos.length; i++) {
		soma_digitos = soma_digitos + (digitos[i] * posicoes);
		posicoes--;
		if (posicoes < 2) {
			posicoes = 9;
		}
	}
	soma_digitos = soma_digitos % 11;
	if (soma_digitos < 2) {
		soma_digitos = 0;
	} else {
		soma_digitos = 11 - soma_digitos;
	}
	return soma_digitos;
}

function calc_digitos_cpf(valor) {
	valor = String(valor).replace(/[^0-9]/g, '');
	var digitos = valor.substr(0, 9);
	var dv1 = calc_digitos_posicoes(digitos, 10);
	var dv2 = calc_digitos_posicoes(digitos + dv1, 11);
	return String(dv1) + String(dv2);
}

function valida_cpf(valor) {
	valor = String(valor).replace(/[^0-9]/g, '');
	var digitos = valor.substr(0, 9);
	var dv = calc_digitos_cpf(digitos);
	if ((digitos + dv) === valor) {
		return true;
	}
	return false;
}

function calc_digitos_cnpj(valor) {
	valor = String(valor).replace(/[^0-9]/g, '');
	var digitos = valor.substr(0, 12);
	var dv1 = calc_digitos_posicoes(digitos, 5);
	var dv2 = calc_digitos_posicoes(digitos + dv1, 6);
	return String(dv1) + String(dv2);
}

function valida_cnpj(valor) {
	valor = String(valor).replace(/[^0-9]/g, '');
	var digitos = valor.substr(0, 12);
	var dv = calc_digitos_cnpj(digitos);
	if ((digitos + dv) === valor) {
		return true;
	}
	return false;
}

function valida_cpf_cnpj(valor) {
	var valida = verifica_cpf_cnpj(valor);
	valor = String(valor).replace(/[^0-9]/g, '');
	if (valida === 'CPF') {
		return valida_cpf(valor);
	} else if (valida === 'CNPJ') {
		return valida_cnpj(valor);
	} else {
		return false;
	}
}

return {
	cpf: calc_digitos_cpf,
	cnpj: calc_digitos_cnpj,
	posicoes: calc_digitos_posicoes,
	valida: {
		cpf: valida_cpf,
		cnpj: valida_cnpj,
		cpf_cnpj: valida_cpf_cnpj
	}
};

})();

Utils.componentDynamic = function componentDynamic(name, href) {
	//console.log('Component Dynamic: '+id);
	return function(resolve, reject) {
		var html, js;
		var done = function done() {
			if (html && js) {
				js.template = html;
				resolve(js);
			}
		};
		Utils.loadScript(href+'.js', function(err) {
			if (err) {
				return reject({
					message: 'Error loading component '+path+' script',
					error: err
				});
			}
			js = RVC.comp[name];
			done();
		});
		Utils.loadAjax({
			url: href+'.html',
			cb: function(err, response) {
				if (err) {
					return reject({
						message: 'Error loading component '+path+' template',
						error: err
					});
				}
				html = response;
				done();
			}
		});
		Utils.loadStylesheet(href+'.css', function(err) {
			if (err) {
				console.log('Error loading stylesheet for component '+href);
			}
		});
	};
};

})();
