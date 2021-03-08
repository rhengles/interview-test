(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("AriJS/client/loaders/stylesheet", ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.AriJS = global.AriJS || {};
    global.AriJS.client = global.AriJS.client || {};
    global.AriJS.client.loaders = global.AriJS.client.loaders || {};
    global.AriJS.client.loaders.stylesheet = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.loadStylesheet = loadStylesheet;
  _exports.loadStylesheetPromise = loadStylesheetPromise;
  _exports["default"] = void 0;

  function loadStylesheet(_ref) {
    var url = _ref.url,
        cb = _ref.cb,
        timeout = _ref.timeout,
        cbLog = _ref.cbLog;
    var link = document.createElement('link');
    var head = document.getElementsByTagName('head')[0];
    var done = false;
    link.setAttribute('rel', 'stylesheet');
    link.addEventListener('load', function () {
      if (done) {
        if (cbLog) cbLog('load stylesheet too late', url);
        return;
      }

      done = true;
      cb();
    });
    link.addEventListener('error', function (err) {
      if (done) {
        if (cbLog) cbLog('error stylesheet too late', url, err);
        return;
      }

      done = true;
      cb(err);
    });
    if (timeout == null) timeout = 30000;

    if (timeout > 0) {
      setTimeout(function () {
        if (done) return;
        cb(new Error('load stylesheet timeout: ' + url));
      }, timeout);
    }

    link.href = url;
    head.appendChild(link);
  }

  function loadStylesheetPromise(_ref2) {
    var url = _ref2.url,
        timeout = _ref2.timeout,
        cbLog = _ref2.cbLog;
    return new Promise(function (resolve, reject) {
      var cb = function cb(err) {
        return err ? reject(err) : resolve();
      };

      return loadStylesheet({
        url: url,
        cb: cb,
        timeout: timeout,
        cbLog: cbLog
      });
    });
  }

  var _default = loadStylesheet;
  _exports["default"] = _default;
});