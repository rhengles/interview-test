(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("AriJS/isomorphic/loaders/component", ["exports", "AriJS/isomorphic/utils/inspect"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/inspect"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.AriJS.isomorphic.utils.inspect);
    global.AriJS = global.AriJS || {};
    global.AriJS.isomorphic = global.AriJS.isomorphic || {};
    global.AriJS.isomorphic.loaders = global.AriJS.isomorphic.loaders || {};
    global.AriJS.isomorphic.loaders.component = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _inspect) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.setDefaultSetCompHtml = setDefaultSetCompHtml;
  _exports["default"] = loadComponent;
  _inspect = _interopRequireDefault(_inspect);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function echo(x) {
    return x;
  }

  function prepareObjLoad(src, name, opt) {
    var _opt$loaders, _opt$onLoad;

    var obj;

    switch (_typeof(src)) {
      case 'string':
        obj = {
          url: src
        };
        break;

      case 'object':
        obj = _objectSpread({}, src);
        break;
    }

    return _objectSpread(_objectSpread({
      name: name
    }, obj), {}, {
      loader: obj && obj.loader instanceof Function ? obj.loader : (_opt$loaders = opt.loaders) === null || _opt$loaders === void 0 ? void 0 : _opt$loaders[name],
      onLoad: obj && obj.onLoad instanceof Function ? obj.onLoad : ((_opt$onLoad = opt.onLoad) === null || _opt$onLoad === void 0 ? void 0 : _opt$onLoad[name]) || echo,
      done: false,
      error: null,
      data: null
    });
  }

  function callObjLoader(_x, _x2, _x3, _x4, _x5, _x6) {
    return _callObjLoader.apply(this, arguments);
  }

  function _callObjLoader() {
    _callObjLoader = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(opt, obj, fname, order, itemLoad, arg) {
      var data;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return obj.loader(arg || obj);

            case 3:
              data = _context.sent;
              obj.error = null;
              obj.data = obj.onLoad(data, opt, obj); // console.log(' +  O done load', obj.name, 'for', opt.prefix, opt.path, inspectObj(data, 1, 32));

              _context.next = 11;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](0);
              obj.error = _context.t0; // console.log(' +  X fail load', obj.name, 'for', opt.prefix, opt.path, error);

            case 11:
              obj.done = true;
              order.push(obj);
              itemLoad();

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 8]]);
    }));
    return _callObjLoader.apply(this, arguments);
  }

  var defaultSetCompHtml = function defaultSetCompHtml(js, html) {
    js.template = html;
    return js;
  };

  function setDefaultSetCompHtml(sch) {
    defaultSetCompHtml = sch;
  }

  function compLoader(_x7) {
    return _compLoader.apply(this, arguments);
  }

  function _compLoader() {
    _compLoader = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(load) {
      var js, html, err, setCompHtml;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              js = load.js.data;
              html = load.html.data;
              err = [];
              setCompHtml = load.opt.setCompHtml || defaultSetCompHtml;
              if (!js) err.push('javascript');
              if (!html) err.push('html');

              if (!err.length) {
                _context2.next = 10;
                break;
              }

              throw new Error(err.join(', ') + ' not found');

            case 10:
              js.name = load.opt.name;
              _context2.next = 13;
              return setCompHtml(js, html, load);

            case 13:
              js = _context2.sent;
              return _context2.abrupt("return", js);

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _compLoader.apply(this, arguments);
  }

  function loadComponent(opt) {
    return new Promise(function (resolve, reject) {
      var order = [];
      var load = {
        opt: opt,
        order: order,
        html: null,
        js: null,
        css: null,
        comp: null,
        error: null
      };
      var done = false;
      initComp(opt.comp);
      initAsset(opt.html, 'html');
      initAsset(opt.js, 'js');
      initAsset(opt.css, 'css');

      function initComp(comp) {
        var _comp;

        load.comp = comp = prepareObjLoad(comp, ((_comp = comp) === null || _comp === void 0 ? void 0 : _comp.name) || 'comp', opt);
        comp.loader = comp.loader instanceof Function ? comp.loader : compLoader;
      }

      function initAsset(src, name) {
        var obj = load[name] = prepareObjLoad(src, name, opt);

        if (src === opt.js) {
          obj.jsContext = obj.jsContext || opt.jsContext;
          obj.jsOnError = obj.jsOnError || opt.jsOnError; // console.log(' +  load comp js', obj);
        }

        callObjLoader(opt, obj, name, order, itemLoad);
      }

      function anyError() {
        var list = [];
        testErrorItem(load.html, list);
        testErrorItem(load.js, list);
        testErrorItem(load.css, list);
        testErrorItem(load.comp, list);

        if (list.length) {
          load.error = new Error('Component ' + opt.name + ': ' + list.join(', '));
        }
      }

      function testErrorItem(item, list) {
        if (item.error) {
          list.push('(' + item.name + ': ' + String(item.error.message || item.error) + ')');
        }
      }

      function itemLoad() {
        var html = load.html.done;
        var js = load.js.done;
        var css = load.css.done;
        var comp = load.comp.done; // console.log(
        // 	' +  item load for', opt.prefix, opt.path,
        // 	html ? 'O' : 'X', 'html,',
        // 	js   ? 'O' : 'X', 'js,',
        // 	css  ? 'O' : 'X', 'css,',
        // 	comp ? 'O' : 'X', 'comp,',
        // 	done ? 'O' : 'X', 'final'
        // );

        if (done) {// done already called
        } else if (html && js && (css || false === opt.waitCss)) {
          if (comp) {
            anyError();
            done = true;

            if (load.error) {
              reject(load);
            } else {
              resolve(load);
            }
          } else {
            callObjLoader(opt, load.comp, 'comp', order, itemLoad, load);
          }
        }
      }
    });
  }
});