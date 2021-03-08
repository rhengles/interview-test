(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("AriJS/isomorphic/utils/deferred", ["exports", "AriJS/isomorphic/utils/listeners"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./listeners"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.AriJS.isomorphic.utils.listeners);
    global.AriJS = global.AriJS || {};
    global.AriJS.isomorphic = global.AriJS.isomorphic || {};
    global.AriJS.isomorphic.utils = global.AriJS.isomorphic.utils || {};
    global.AriJS.isomorphic.utils.deferred = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _listeners) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.deferred = deferred;
  _exports.deferredPromise = deferredPromise;
  _exports["default"] = void 0;

  function deferred(ref) {
    var listeners = [];
    var ctx, args;
    var obj = {
      ref: ref,
      then: then,
      done: done,
      nevermind: nevermind,
      clear: clear
    };
    return obj;

    function then(fn) {
      if (args) {
        fn.apply(ctx, args);
      } else {
        listeners.push(fn);
      }

      return obj;
    }

    function done() {
      ctx = this;
      args = arguments;
      (0, _listeners.callListeners)(listeners, args, ctx);
      listeners = null;
      return obj;
    }

    function nevermind(fn) {
      var i = 0,
          c = listeners.length;

      for (; i < c; i++) {
        if (listeners[i] === fn) {
          listeners.splice(i, 1);
          return i;
        }
      }

      return -1;
    }

    function clear() {
      listeners = [];
      ctx = args = void 0;
      return obj;
    }
  }

  function deferredPromise(ref) {
    var success = deferred(ref);
    var failure = deferred(ref);
    var promise = {
      then: function then() {
        success.then.apply(this, arguments);
        return promise;
      },
      "catch": function _catch() {
        failure.then.apply(this, arguments);
        return promise;
      },
      unthen: success.nevermind,
      uncatch: failure.nevermind
    };
    return {
      resolve: success.done,
      reject: failure.done,
      promise: promise,
      success: success,
      failure: failure,
      clear: clear
    };

    function clear() {
      success.clear();
      failure.clear();
    }
  }

  var _default = deferred;
  _exports["default"] = _default;
});