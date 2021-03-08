(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("AriJS/isomorphic/utils/listeners", ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.AriJS = global.AriJS || {};
    global.AriJS.isomorphic = global.AriJS.isomorphic || {};
    global.AriJS.isomorphic.utils = global.AriJS.isomorphic.utils || {};
    global.AriJS.isomorphic.utils.listeners = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.callListeners = callListeners;
  _exports.applyListeners = applyListeners;

  function callListeners(list, context, a1, a2, a3, a4) {
    for (var i = 0, ii = list.length; i < ii; i++) {
      list[i].call(context, a1, a2, a3, a4);
    }
  }

  function applyListeners(list, args, context) {
    for (var i = 0, ii = list.length; i < ii; i++) {
      list[i].apply(context, args);
    }
  }
});