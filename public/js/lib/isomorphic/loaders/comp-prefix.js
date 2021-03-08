(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("AriJS/isomorphic/loaders/comp-prefix", ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.AriJS = global.AriJS || {};
    global.AriJS.isomorphic = global.AriJS.isomorphic || {};
    global.AriJS.isomorphic.loaders = global.AriJS.isomorphic.loaders || {};
    global.AriJS.isomorphic.loaders["comp-prefix"] = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = prefixMatcher;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var reDash = /--/g;

  function testNamePrefix(name, prefix) {
    var plen = prefix.length;

    if (name.substr(0, plen) === prefix) {
      prefix = prefix.replace(reDash, '/');
      var path = name.substr(plen).replace(reDash, '/');
      return {
        name: name,
        prefix: prefix,
        path: path
      };
    }
  }

  function compPathBase(param, match) {
    return param instanceof Function ? param(match) : match.href;
  }

  function compPathResource(param, url, extension, match) {
    return param === false ? null : param instanceof Function ? param(url, extension, match) : url + extension;
  }

  function compRelPathResource(relPath, path, lastName, ext) {
    relPath = 'string' === typeof relPath ? relPath : '';
    return relPath + path + '/' + lastName + ext;
  }

  function getPrefixPaths(optPrefix, match) {
    var _match = match,
        path = _match.path;
    var _optPrefix$basePath = optPrefix.basePath,
        basePath = _optPrefix$basePath === void 0 ? '' : _optPrefix$basePath,
        _optPrefix$extHtml = optPrefix.extHtml,
        extHtml = _optPrefix$extHtml === void 0 ? '.html' : _optPrefix$extHtml,
        _optPrefix$extJs = optPrefix.extJs,
        extJs = _optPrefix$extJs === void 0 ? '.js' : _optPrefix$extJs,
        _optPrefix$extCss = optPrefix.extCss,
        extCss = _optPrefix$extCss === void 0 ? '.css' : _optPrefix$extCss,
        inputHtml = optPrefix.inputHtml,
        inputJs = optPrefix.inputJs,
        inputCss = optPrefix.inputCss,
        relPath = optPrefix.relPath;
    var lastIndex = path.lastIndexOf('/');
    var lastName = path.substr(lastIndex + 1);
    var href = basePath + path + '/' + lastName;
    match = _objectSpread(_objectSpread(_objectSpread({}, optPrefix), match), {}, {
      path: path,
      lastName: lastName,
      href: href
    });
    var url = compPathBase(optPrefix.getUrl, match);
    var html = compPathResource(inputHtml, url, extHtml, match);
    var js = compPathResource(inputJs, url, extJs, match);
    var css = compPathResource(inputCss, url, extCss, match);
    var htmlRel = compRelPathResource(relPath, path, lastName, extHtml);
    var jsRel = compRelPathResource(relPath, path, lastName, extJs);
    var cssRel = compRelPathResource(relPath, path, lastName, extCss);
    return _objectSpread(_objectSpread({}, match), {}, {
      url: url,
      html: html,
      js: js,
      css: css,
      htmlRel: htmlRel,
      jsRel: jsRel,
      cssRel: cssRel
    });
  }

  function prefixLoader(match) {
    var path = match.path,
        mapCache = match.mapCache,
        mapLoading = match.mapLoading;
    var isCached = mapCache[path];
    if (isCached) return Promise.resolve(isCached);
    var isLoading = mapLoading[path];
    if (isLoading) return isLoading; // console.log(' +  call loadComp prefix for', match.prefix, match.path);

    var promise = match.loadComponent(match).then(function (load) {
      // console.log(' +  resolve loadComp prefix', match.prefix, match.path);
      var onLoadComponent = match.onLoadComponent;
      var loadMod;

      if (onLoadComponent instanceof Function) {
        loadMod = onLoadComponent(match, load);
      }

      return mapCache[path] = load = loadMod || load; //def.
    })["catch"](function (load) {
      // console.log(' +  reject loadComp prefix', match.prefix, match.path, load);
      var onLoadError = match.onLoadError;

      if (onLoadError instanceof Function) {
        onLoadError(match, load);
      }

      throw load;
    });
    return mapLoading[path] = promise; //def.
  }

  function prefixMatcher(optPrefix) {
    optPrefix.loader = prefixMatchName;
    optPrefix.testName = testMatchName;
    optPrefix.mapCache = optPrefix.mapCache || {};
    optPrefix.mapLoading = optPrefix.mapLoading || {};
    return optPrefix;

    function testMatchName(name) {
      return testNamePrefix(name, optPrefix.prefix);
    }

    function prefixMatchName(name) {
      var match = testNamePrefix(name, optPrefix.prefix);

      if (match) {
        var onMatch = optPrefix.onMatch;
        match = getPrefixPaths(optPrefix, match);
        if (onMatch instanceof Function) onMatch(name, match);
        return function () {
          var onMatchLoad = optPrefix.onMatchLoad;
          if (onMatchLoad instanceof Function) onMatchLoad(name, match);
          return prefixLoader(match);
        };
      }
    }
  }
});