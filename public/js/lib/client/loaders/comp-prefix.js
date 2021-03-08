(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("AriJS/client/loaders/comp-prefix", ["exports", "AriJS/isomorphic/loaders/comp-prefix", "AriJS/client/loaders/component"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../isomorphic/loaders/comp-prefix"), require("./component"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.AriJS.isomorphic.loaders["comp-prefix"], global.AriJS.client.loaders.component);
    global.AriJS = global.AriJS || {};
    global.AriJS.client = global.AriJS.client || {};
    global.AriJS.client.loaders = global.AriJS.client.loaders || {};
    global.AriJS.client.loaders["comp-prefix"] = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _compPrefix, _component) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = prefixMatcher;
  _compPrefix = _interopRequireDefault(_compPrefix);
  _component = _interopRequireDefault(_component);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function prefixMatcher(optPrefix) {
    return (0, _compPrefix["default"])(_objectSpread({
      loadComponent: _component["default"]
    }, optPrefix));
  }
});