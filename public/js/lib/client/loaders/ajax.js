(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("AriJS/client/loaders/ajax", ["exports", "AriJS/isomorphic/utils/collection", "AriJS/isomorphic/utils/extend"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../isomorphic/utils/collection"), require("../../isomorphic/utils/extend"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.AriJS.isomorphic.utils.collection, global.AriJS.isomorphic.utils.extend);
    global.AriJS = global.AriJS || {};
    global.AriJS.client = global.AriJS.client || {};
    global.AriJS.client.loaders = global.AriJS.client.loaders || {};
    global.AriJS.client.loaders.ajax = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _collection, _extend) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AjaxError = AjaxError;
  _exports.respGetType = respGetType;
  _exports.respErrorType = respErrorType;
  _exports.createTypeParser = createTypeParser;
  _exports.respTestTypes = respTestTypes;
  _exports.parseOptTypes = parseOptTypes;
  _exports.parseValidate = parseValidate;
  _exports.parseGetError = parseGetError;
  _exports.parseResponse = parseResponse;
  _exports.loadAjax = loadAjax;
  _exports.loadAjaxPromise = loadAjaxPromise;
  _exports["default"] = _exports.ajaxTypeJson = _exports.formatError = void 0;
  _extend = _interopRequireDefault(_extend);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function AjaxError(message, resp, error, type) {
    this.message = message;
    this.resp = resp;
    this.error = error;
    this.type = type;
    this.stack = new Error().stack;
  }

  AjaxError.prototype = new Error();
  AjaxError.prototype.name = 'AjaxError';
  AjaxError.ERROR_APP = 'app';
  AjaxError.ERROR_NET = 'net';
  AjaxError.ERROR_SERVER = 'server';
  AjaxError.ERROR_TYPE = 'type';
  AjaxError.ERROR_PARSE = 'parse';
  AjaxError.ERROR_TIMEOUT = 'timeout';
  var formatError = {
    app: function app(error) {
      return {
        message: error.title || error.message,
        error: error
      };
    },
    net: function net() {
      return {
        message: 'Network error: Your connection or the server is down'
      };
    },
    server: function server(status, text) {
      return {
        message: 'HTTP Error ' + status + (text ? ' ' + text : ''),
        error: {
          status: status,
          text: text
        }
      };
    },
    type: function type(_type, expected) {
      var message = 'Unexpected type ' + JSON.stringify(_type);

      if (expected) {
        message += ', expected ' + JSON.stringify(expected);
      }

      return {
        message: message,
        error: {
          type: _type,
          expected: expected
        }
      };
    },
    parse: function parse(type, error) {
      return {
        message: 'Error parsing ' + JSON.stringify(type),
        error: error
      };
    },
    timeout: function timeout(time) {
      return {
        message: 'Load timeout ' + Number(time / 1000).toFixed(1) + 's',
        error: {
          time: time
        }
      };
    }
  };
  _exports.formatError = formatError;

  function respGetType(resp) {
    return resp.req.getResponseHeader("Content-Type");
  }

  function respErrorType(resp, expected) {
    var _resp$formatError$typ = resp.formatError.type(respGetType(resp), expected, resp),
        message = _resp$formatError$typ.message,
        error = _resp$formatError$typ.error;

    resp.errorType = new AjaxError(message, resp, error, AjaxError.ERROR_TYPE);
  }

  function createTypeParser(opt) {
    var type = {
      opt: opt,
      name: opt.name,
      respIsType: function respIsType(resp) {
        return opt.isType(respGetType(resp), resp);
      },
      respParseCheckType: function respParseCheckType(resp) {
        if (type.respIsType(resp)) {
          type.respParse(resp);
        } else {
          respErrorType(resp, type.name);
        }
      },
      respParse: function respParse(resp) {
        try {
          opt.parse(resp);
        } catch (e) {
          var _resp$formatError$par = resp.formatError.parse(type.name, e, resp),
              message = _resp$formatError$par.message,
              error = _resp$formatError$par.error; // var tl = loadAjaxMessages['error-parse'];
          // var tlVars = {
          // 	error: e.message
          // };
          // {message: printf(tl.message, tlVars)}


          resp.errorParse = new AjaxError(message, resp, error, AjaxError.ERROR_PARSE);
        }
      }
    };
    return type;
  }

  var ajaxTypeJson = createTypeParser({
    name: 'application/json',
    isType: function isType(type) {
      return /\bapplication\/(json|javascript)\b/i.test(type);
    },
    parse: function parse(resp) {
      return resp.data = JSON.parse(resp.data);
    }
  });
  _exports.ajaxTypeJson = ajaxTypeJson;

  function respTestTypes(resp, types) {
    for (var i = 0, c = types.length; i < c; i++) {
      var type = types[i];
      if (type.respIsType(resp)) return type;
    }
  }

  function parseOptTypes(resp) {
    var typeExpect = (0, _collection.arrayFrom)(resp.opt.typeExpect);
    var typeAllow = (0, _collection.arrayFrom)(resp.opt.typeAllow);
    var foundExpect = respTestTypes(resp, typeExpect);
    var foundAllow = respTestTypes(resp, typeAllow);
    if (foundExpect) foundExpect.respParse(resp);else {
      if (foundAllow) foundAllow.respParse(resp);
      if (typeExpect[0]) typeExpect[0].respParseCheckType(resp);
    }
  }

  function parseValidate(resp) {
    var validate = resp.opt.validate;

    if (validate instanceof Function) {
      var err = validate(resp);

      if (err) {
        // var tl = loadAjaxMessages['error-validate'];
        // if (!err.title) err.title = tl.title;
        // if (!err.message) err.message = tl.message;
        var _resp$formatError$app = resp.formatError.app(err, resp),
            message = _resp$formatError$app.message,
            error = _resp$formatError$app.error;

        resp.errorApp = new AjaxError(message, resp, error, AjaxError.ERROR_APP);
      }
    }
  }

  function parseGetError(resp) {
    resp.error = resp.errorApp || resp.errorNet || resp.errorServer || resp.errorType || resp.errorParse || resp.errorTimeout;
  }

  function parseResponse(resp) {
    if (!resp.loading) {
      parseOptTypes(resp);
    }

    parseValidate(resp);
    parseGetError(resp);
    return resp.opt.cb(resp);
  }

  function loadAjax(opt) {
    var req = new XMLHttpRequest();
    var head = opt.headers;
    var hc = head && head.length || 0;
    var parse = opt.parse || parseResponse;
    var timeout = opt.timeout;
    var idTimeout;

    var stopTimeout = function stopTimeout() {
      if (idTimeout) {
        clearTimeout(idTimeout);
        idTimeout = void 0;
        resp.errorTimeout = null;
      }
    };

    var resp = {
      loading: true,
      errorApp: null,
      errorNet: null,
      errorServer: null,
      errorType: null,
      errorParse: null,
      errorTimeout: null,
      error: null,
      data: null,
      req: req,
      opt: opt,
      formatError: opt.formatError || formatError
    };

    if (timeout != null && !isNaN(timeout) && timeout > 0) {
      idTimeout = setTimeout(function () {
        if (!resp.loading) return;

        var _resp$formatError$tim = resp.formatError.timeout(timeout, resp),
            message = _resp$formatError$tim.message,
            error = _resp$formatError$tim.error;

        resp.errorTimeout = new AjaxError(message, resp, error, AjaxError.ERROR_TIMEOUT);
        parse(resp);
      }, timeout);
    }

    req.addEventListener('load', function () {
      // var tl = loadAjaxMessages['error-server'];
      resp.loading = false;
      resp.data = req.responseText;

      if (req.status < 200 || req.status >= 300) {
        // var tlVars = {
        // 	code: req.status,
        // 	statusText: req.statusText
        // };
        // resp.errorServer = new AjaxError(
        // 	printf(tl.title, tlVars),
        // 	resp,
        // 	{ message: printf(tl.message, tlVars) }
        // );
        var _resp$formatError$ser = resp.formatError.server(req.status, req.statusText, resp),
            message = _resp$formatError$ser.message,
            error = _resp$formatError$ser.error;

        resp.errorServer = new AjaxError(message, resp, error, AjaxError.ERROR_SERVER);
      }

      stopTimeout();
      parse(resp);
    });
    req.addEventListener('error', function (ev) {
      // var tl = loadAjaxMessages['error-net'];
      resp.loading = false;

      var _resp$formatError$net = resp.formatError.net(ev, resp),
          message = _resp$formatError$net.message,
          error = _resp$formatError$net.error;

      resp.errorNet = new AjaxError(message, resp, error, AjaxError.ERROR_NET);
      stopTimeout();
      parse(resp);
    });
    req.open(opt.method || 'GET', opt.url);
    if (opt.xhrFields) (0, _extend["default"])(req, opt.xhrFields);

    for (var i = 0; i < hc; i++) {
      var h = head[i];
      h && h.name && req.setRequestHeader(h.name, h.value);
    }

    req.send(opt.body);
    return resp;
  }

  ;

  function loadAjaxPromise(opt) {
    return new Promise(function (resolve, reject) {
      opt.cb = function (resp) {
        return resp.error ? reject(resp) : resolve(resp);
      };

      return loadAjax(opt);
    });
  }

  var _default = loadAjax;
  _exports["default"] = _default;
});