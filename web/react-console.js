var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/react/cjs/react.production.min.js
var require_react_production_min = __commonJS({
  "node_modules/react/cjs/react.production.min.js"(exports) {
    "use strict";
    var l = /* @__PURE__ */ Symbol.for("react.element");
    var n = /* @__PURE__ */ Symbol.for("react.portal");
    var p = /* @__PURE__ */ Symbol.for("react.fragment");
    var q = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var r = /* @__PURE__ */ Symbol.for("react.profiler");
    var t = /* @__PURE__ */ Symbol.for("react.provider");
    var u = /* @__PURE__ */ Symbol.for("react.context");
    var v = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var w = /* @__PURE__ */ Symbol.for("react.suspense");
    var x = /* @__PURE__ */ Symbol.for("react.memo");
    var y = /* @__PURE__ */ Symbol.for("react.lazy");
    var z = Symbol.iterator;
    function A(a) {
      if (null === a || "object" !== typeof a) return null;
      a = z && a[z] || a["@@iterator"];
      return "function" === typeof a ? a : null;
    }
    var B = { isMounted: function() {
      return false;
    }, enqueueForceUpdate: function() {
    }, enqueueReplaceState: function() {
    }, enqueueSetState: function() {
    } };
    var C = Object.assign;
    var D = {};
    function E(a, b, e) {
      this.props = a;
      this.context = b;
      this.refs = D;
      this.updater = e || B;
    }
    E.prototype.isReactComponent = {};
    E.prototype.setState = function(a, b) {
      if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, a, b, "setState");
    };
    E.prototype.forceUpdate = function(a) {
      this.updater.enqueueForceUpdate(this, a, "forceUpdate");
    };
    function F() {
    }
    F.prototype = E.prototype;
    function G(a, b, e) {
      this.props = a;
      this.context = b;
      this.refs = D;
      this.updater = e || B;
    }
    var H = G.prototype = new F();
    H.constructor = G;
    C(H, E.prototype);
    H.isPureReactComponent = true;
    var I = Array.isArray;
    var J = Object.prototype.hasOwnProperty;
    var K = { current: null };
    var L = { key: true, ref: true, __self: true, __source: true };
    function M(a, b, e) {
      var d, c = {}, k = null, h = null;
      if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k = "" + b.key), b) J.call(b, d) && !L.hasOwnProperty(d) && (c[d] = b[d]);
      var g = arguments.length - 2;
      if (1 === g) c.children = e;
      else if (1 < g) {
        for (var f = Array(g), m = 0; m < g; m++) f[m] = arguments[m + 2];
        c.children = f;
      }
      if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
      return { $$typeof: l, type: a, key: k, ref: h, props: c, _owner: K.current };
    }
    function N(a, b) {
      return { $$typeof: l, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
    }
    function O(a) {
      return "object" === typeof a && null !== a && a.$$typeof === l;
    }
    function escape(a) {
      var b = { "=": "=0", ":": "=2" };
      return "$" + a.replace(/[=:]/g, function(a2) {
        return b[a2];
      });
    }
    var P = /\/+/g;
    function Q(a, b) {
      return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
    }
    function R(a, b, e, d, c) {
      var k = typeof a;
      if ("undefined" === k || "boolean" === k) a = null;
      var h = false;
      if (null === a) h = true;
      else switch (k) {
        case "string":
        case "number":
          h = true;
          break;
        case "object":
          switch (a.$$typeof) {
            case l:
            case n:
              h = true;
          }
      }
      if (h) return h = a, c = c(h), a = "" === d ? "." + Q(h, 0) : d, I(c) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c, b, e, "", function(a2) {
        return a2;
      })) : null != c && (O(c) && (c = N(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P, "$&/") + "/") + a)), b.push(c)), 1;
      h = 0;
      d = "" === d ? "." : d + ":";
      if (I(a)) for (var g = 0; g < a.length; g++) {
        k = a[g];
        var f = d + Q(k, g);
        h += R(k, b, e, f, c);
      }
      else if (f = A(a), "function" === typeof f) for (a = f.call(a), g = 0; !(k = a.next()).done; ) k = k.value, f = d + Q(k, g++), h += R(k, b, e, f, c);
      else if ("object" === k) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
      return h;
    }
    function S(a, b, e) {
      if (null == a) return a;
      var d = [], c = 0;
      R(a, d, "", "", function(a2) {
        return b.call(e, a2, c++);
      });
      return d;
    }
    function T(a) {
      if (-1 === a._status) {
        var b = a._result;
        b = b();
        b.then(function(b2) {
          if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
        }, function(b2) {
          if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
        });
        -1 === a._status && (a._status = 0, a._result = b);
      }
      if (1 === a._status) return a._result.default;
      throw a._result;
    }
    var U = { current: null };
    var V = { transition: null };
    var W = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: V, ReactCurrentOwner: K };
    function X() {
      throw Error("act(...) is not supported in production builds of React.");
    }
    exports.Children = { map: S, forEach: function(a, b, e) {
      S(a, function() {
        b.apply(this, arguments);
      }, e);
    }, count: function(a) {
      var b = 0;
      S(a, function() {
        b++;
      });
      return b;
    }, toArray: function(a) {
      return S(a, function(a2) {
        return a2;
      }) || [];
    }, only: function(a) {
      if (!O(a)) throw Error("React.Children.only expected to receive a single React element child.");
      return a;
    } };
    exports.Component = E;
    exports.Fragment = p;
    exports.Profiler = r;
    exports.PureComponent = G;
    exports.StrictMode = q;
    exports.Suspense = w;
    exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
    exports.act = X;
    exports.cloneElement = function(a, b, e) {
      if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
      var d = C({}, a.props), c = a.key, k = a.ref, h = a._owner;
      if (null != b) {
        void 0 !== b.ref && (k = b.ref, h = K.current);
        void 0 !== b.key && (c = "" + b.key);
        if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
        for (f in b) J.call(b, f) && !L.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
      }
      var f = arguments.length - 2;
      if (1 === f) d.children = e;
      else if (1 < f) {
        g = Array(f);
        for (var m = 0; m < f; m++) g[m] = arguments[m + 2];
        d.children = g;
      }
      return { $$typeof: l, type: a.type, key: c, ref: k, props: d, _owner: h };
    };
    exports.createContext = function(a) {
      a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
      a.Provider = { $$typeof: t, _context: a };
      return a.Consumer = a;
    };
    exports.createElement = M;
    exports.createFactory = function(a) {
      var b = M.bind(null, a);
      b.type = a;
      return b;
    };
    exports.createRef = function() {
      return { current: null };
    };
    exports.forwardRef = function(a) {
      return { $$typeof: v, render: a };
    };
    exports.isValidElement = O;
    exports.lazy = function(a) {
      return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T };
    };
    exports.memo = function(a, b) {
      return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
    };
    exports.startTransition = function(a) {
      var b = V.transition;
      V.transition = {};
      try {
        a();
      } finally {
        V.transition = b;
      }
    };
    exports.unstable_act = X;
    exports.useCallback = function(a, b) {
      return U.current.useCallback(a, b);
    };
    exports.useContext = function(a) {
      return U.current.useContext(a);
    };
    exports.useDebugValue = function() {
    };
    exports.useDeferredValue = function(a) {
      return U.current.useDeferredValue(a);
    };
    exports.useEffect = function(a, b) {
      return U.current.useEffect(a, b);
    };
    exports.useId = function() {
      return U.current.useId();
    };
    exports.useImperativeHandle = function(a, b, e) {
      return U.current.useImperativeHandle(a, b, e);
    };
    exports.useInsertionEffect = function(a, b) {
      return U.current.useInsertionEffect(a, b);
    };
    exports.useLayoutEffect = function(a, b) {
      return U.current.useLayoutEffect(a, b);
    };
    exports.useMemo = function(a, b) {
      return U.current.useMemo(a, b);
    };
    exports.useReducer = function(a, b, e) {
      return U.current.useReducer(a, b, e);
    };
    exports.useRef = function(a) {
      return U.current.useRef(a);
    };
    exports.useState = function(a) {
      return U.current.useState(a);
    };
    exports.useSyncExternalStore = function(a, b, e) {
      return U.current.useSyncExternalStore(a, b, e);
    };
    exports.useTransition = function() {
      return U.current.useTransition();
    };
    exports.version = "18.3.1";
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    if (true) {
      module.exports = require_react_production_min();
    } else {
      module.exports = null;
    }
  }
});

// node_modules/scheduler/cjs/scheduler.production.min.js
var require_scheduler_production_min = __commonJS({
  "node_modules/scheduler/cjs/scheduler.production.min.js"(exports) {
    "use strict";
    function f(a, b) {
      var c = a.length;
      a.push(b);
      a: for (; 0 < c; ) {
        var d = c - 1 >>> 1, e = a[d];
        if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
        else break a;
      }
    }
    function h(a) {
      return 0 === a.length ? null : a[0];
    }
    function k(a) {
      if (0 === a.length) return null;
      var b = a[0], c = a.pop();
      if (c !== b) {
        a[0] = c;
        a: for (var d = 0, e = a.length, w = e >>> 1; d < w; ) {
          var m = 2 * (d + 1) - 1, C = a[m], n = m + 1, x = a[n];
          if (0 > g(C, c)) n < e && 0 > g(x, C) ? (a[d] = x, a[n] = c, d = n) : (a[d] = C, a[m] = c, d = m);
          else if (n < e && 0 > g(x, c)) a[d] = x, a[n] = c, d = n;
          else break a;
        }
      }
      return b;
    }
    function g(a, b) {
      var c = a.sortIndex - b.sortIndex;
      return 0 !== c ? c : a.id - b.id;
    }
    if ("object" === typeof performance && "function" === typeof performance.now) {
      l = performance;
      exports.unstable_now = function() {
        return l.now();
      };
    } else {
      p = Date, q = p.now();
      exports.unstable_now = function() {
        return p.now() - q;
      };
    }
    var l;
    var p;
    var q;
    var r = [];
    var t = [];
    var u = 1;
    var v = null;
    var y = 3;
    var z = false;
    var A = false;
    var B = false;
    var D = "function" === typeof setTimeout ? setTimeout : null;
    var E = "function" === typeof clearTimeout ? clearTimeout : null;
    var F = "undefined" !== typeof setImmediate ? setImmediate : null;
    "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function G(a) {
      for (var b = h(t); null !== b; ) {
        if (null === b.callback) k(t);
        else if (b.startTime <= a) k(t), b.sortIndex = b.expirationTime, f(r, b);
        else break;
        b = h(t);
      }
    }
    function H(a) {
      B = false;
      G(a);
      if (!A) if (null !== h(r)) A = true, I(J);
      else {
        var b = h(t);
        null !== b && K(H, b.startTime - a);
      }
    }
    function J(a, b) {
      A = false;
      B && (B = false, E(L), L = -1);
      z = true;
      var c = y;
      try {
        G(b);
        for (v = h(r); null !== v && (!(v.expirationTime > b) || a && !M()); ) {
          var d = v.callback;
          if ("function" === typeof d) {
            v.callback = null;
            y = v.priorityLevel;
            var e = d(v.expirationTime <= b);
            b = exports.unstable_now();
            "function" === typeof e ? v.callback = e : v === h(r) && k(r);
            G(b);
          } else k(r);
          v = h(r);
        }
        if (null !== v) var w = true;
        else {
          var m = h(t);
          null !== m && K(H, m.startTime - b);
          w = false;
        }
        return w;
      } finally {
        v = null, y = c, z = false;
      }
    }
    var N = false;
    var O = null;
    var L = -1;
    var P = 5;
    var Q = -1;
    function M() {
      return exports.unstable_now() - Q < P ? false : true;
    }
    function R() {
      if (null !== O) {
        var a = exports.unstable_now();
        Q = a;
        var b = true;
        try {
          b = O(true, a);
        } finally {
          b ? S() : (N = false, O = null);
        }
      } else N = false;
    }
    var S;
    if ("function" === typeof F) S = function() {
      F(R);
    };
    else if ("undefined" !== typeof MessageChannel) {
      T = new MessageChannel(), U = T.port2;
      T.port1.onmessage = R;
      S = function() {
        U.postMessage(null);
      };
    } else S = function() {
      D(R, 0);
    };
    var T;
    var U;
    function I(a) {
      O = a;
      N || (N = true, S());
    }
    function K(a, b) {
      L = D(function() {
        a(exports.unstable_now());
      }, b);
    }
    exports.unstable_IdlePriority = 5;
    exports.unstable_ImmediatePriority = 1;
    exports.unstable_LowPriority = 4;
    exports.unstable_NormalPriority = 3;
    exports.unstable_Profiling = null;
    exports.unstable_UserBlockingPriority = 2;
    exports.unstable_cancelCallback = function(a) {
      a.callback = null;
    };
    exports.unstable_continueExecution = function() {
      A || z || (A = true, I(J));
    };
    exports.unstable_forceFrameRate = function(a) {
      0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P = 0 < a ? Math.floor(1e3 / a) : 5;
    };
    exports.unstable_getCurrentPriorityLevel = function() {
      return y;
    };
    exports.unstable_getFirstCallbackNode = function() {
      return h(r);
    };
    exports.unstable_next = function(a) {
      switch (y) {
        case 1:
        case 2:
        case 3:
          var b = 3;
          break;
        default:
          b = y;
      }
      var c = y;
      y = b;
      try {
        return a();
      } finally {
        y = c;
      }
    };
    exports.unstable_pauseExecution = function() {
    };
    exports.unstable_requestPaint = function() {
    };
    exports.unstable_runWithPriority = function(a, b) {
      switch (a) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          a = 3;
      }
      var c = y;
      y = a;
      try {
        return b();
      } finally {
        y = c;
      }
    };
    exports.unstable_scheduleCallback = function(a, b, c) {
      var d = exports.unstable_now();
      "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
      switch (a) {
        case 1:
          var e = -1;
          break;
        case 2:
          e = 250;
          break;
        case 5:
          e = 1073741823;
          break;
        case 4:
          e = 1e4;
          break;
        default:
          e = 5e3;
      }
      e = c + e;
      a = { id: u++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
      c > d ? (a.sortIndex = c, f(t, a), null === h(r) && a === h(t) && (B ? (E(L), L = -1) : B = true, K(H, c - d))) : (a.sortIndex = e, f(r, a), A || z || (A = true, I(J)));
      return a;
    };
    exports.unstable_shouldYield = M;
    exports.unstable_wrapCallback = function(a) {
      var b = y;
      return function() {
        var c = y;
        y = b;
        try {
          return a.apply(this, arguments);
        } finally {
          y = c;
        }
      };
    };
  }
});

// node_modules/scheduler/index.js
var require_scheduler = __commonJS({
  "node_modules/scheduler/index.js"(exports, module) {
    "use strict";
    if (true) {
      module.exports = require_scheduler_production_min();
    } else {
      module.exports = null;
    }
  }
});

// node_modules/react-dom/cjs/react-dom.production.min.js
var require_react_dom_production_min = __commonJS({
  "node_modules/react-dom/cjs/react-dom.production.min.js"(exports) {
    "use strict";
    var aa = require_react();
    var ca = require_scheduler();
    function p(a) {
      for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
      return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    var da = /* @__PURE__ */ new Set();
    var ea = {};
    function fa(a, b) {
      ha(a, b);
      ha(a + "Capture", b);
    }
    function ha(a, b) {
      ea[a] = b;
      for (a = 0; a < b.length; a++) da.add(b[a]);
    }
    var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement);
    var ja = Object.prototype.hasOwnProperty;
    var ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/;
    var la = {};
    var ma = {};
    function oa(a) {
      if (ja.call(ma, a)) return true;
      if (ja.call(la, a)) return false;
      if (ka.test(a)) return ma[a] = true;
      la[a] = true;
      return false;
    }
    function pa(a, b, c, d) {
      if (null !== c && 0 === c.type) return false;
      switch (typeof b) {
        case "function":
        case "symbol":
          return true;
        case "boolean":
          if (d) return false;
          if (null !== c) return !c.acceptsBooleans;
          a = a.toLowerCase().slice(0, 5);
          return "data-" !== a && "aria-" !== a;
        default:
          return false;
      }
    }
    function qa(a, b, c, d) {
      if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
      if (d) return false;
      if (null !== c) switch (c.type) {
        case 3:
          return !b;
        case 4:
          return false === b;
        case 5:
          return isNaN(b);
        case 6:
          return isNaN(b) || 1 > b;
      }
      return false;
    }
    function v(a, b, c, d, e, f, g) {
      this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
      this.attributeName = d;
      this.attributeNamespace = e;
      this.mustUseProperty = c;
      this.propertyName = a;
      this.type = b;
      this.sanitizeURL = f;
      this.removeEmptyString = g;
    }
    var z = {};
    "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
      z[a] = new v(a, 0, false, a, null, false, false);
    });
    [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
      var b = a[0];
      z[b] = new v(b, 1, false, a[1], null, false, false);
    });
    ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
      z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
    });
    ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
      z[a] = new v(a, 2, false, a, null, false, false);
    });
    "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
      z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
    });
    ["checked", "multiple", "muted", "selected"].forEach(function(a) {
      z[a] = new v(a, 3, true, a, null, false, false);
    });
    ["capture", "download"].forEach(function(a) {
      z[a] = new v(a, 4, false, a, null, false, false);
    });
    ["cols", "rows", "size", "span"].forEach(function(a) {
      z[a] = new v(a, 6, false, a, null, false, false);
    });
    ["rowSpan", "start"].forEach(function(a) {
      z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
    });
    var ra = /[\-:]([a-z])/g;
    function sa(a) {
      return a[1].toUpperCase();
    }
    "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
      var b = a.replace(
        ra,
        sa
      );
      z[b] = new v(b, 1, false, a, null, false, false);
    });
    "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
      var b = a.replace(ra, sa);
      z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
    });
    ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
      var b = a.replace(ra, sa);
      z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
    });
    ["tabIndex", "crossOrigin"].forEach(function(a) {
      z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
    });
    z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
    ["src", "href", "action", "formAction"].forEach(function(a) {
      z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
    });
    function ta(a, b, c, d) {
      var e = z.hasOwnProperty(b) ? z[b] : null;
      if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
    }
    var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    var va = /* @__PURE__ */ Symbol.for("react.element");
    var wa = /* @__PURE__ */ Symbol.for("react.portal");
    var ya = /* @__PURE__ */ Symbol.for("react.fragment");
    var za = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var Aa = /* @__PURE__ */ Symbol.for("react.profiler");
    var Ba = /* @__PURE__ */ Symbol.for("react.provider");
    var Ca = /* @__PURE__ */ Symbol.for("react.context");
    var Da = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var Ea = /* @__PURE__ */ Symbol.for("react.suspense");
    var Fa = /* @__PURE__ */ Symbol.for("react.suspense_list");
    var Ga = /* @__PURE__ */ Symbol.for("react.memo");
    var Ha = /* @__PURE__ */ Symbol.for("react.lazy");
    var Ia = /* @__PURE__ */ Symbol.for("react.offscreen");
    var Ja = Symbol.iterator;
    function Ka(a) {
      if (null === a || "object" !== typeof a) return null;
      a = Ja && a[Ja] || a["@@iterator"];
      return "function" === typeof a ? a : null;
    }
    var A = Object.assign;
    var La;
    function Ma(a) {
      if (void 0 === La) try {
        throw Error();
      } catch (c) {
        var b = c.stack.trim().match(/\n( *(at )?)/);
        La = b && b[1] || "";
      }
      return "\n" + La + a;
    }
    var Na = false;
    function Oa(a, b) {
      if (!a || Na) return "";
      Na = true;
      var c = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        if (b) if (b = function() {
          throw Error();
        }, Object.defineProperty(b.prototype, "props", { set: function() {
          throw Error();
        } }), "object" === typeof Reflect && Reflect.construct) {
          try {
            Reflect.construct(b, []);
          } catch (l) {
            var d = l;
          }
          Reflect.construct(a, [], b);
        } else {
          try {
            b.call();
          } catch (l) {
            d = l;
          }
          a.call(b.prototype);
        }
        else {
          try {
            throw Error();
          } catch (l) {
            d = l;
          }
          a();
        }
      } catch (l) {
        if (l && d && "string" === typeof l.stack) {
          for (var e = l.stack.split("\n"), f = d.stack.split("\n"), g = e.length - 1, h = f.length - 1; 1 <= g && 0 <= h && e[g] !== f[h]; ) h--;
          for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f[h]) {
            if (1 !== g || 1 !== h) {
              do
                if (g--, h--, 0 > h || e[g] !== f[h]) {
                  var k = "\n" + e[g].replace(" at new ", " at ");
                  a.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", a.displayName));
                  return k;
                }
              while (1 <= g && 0 <= h);
            }
            break;
          }
        }
      } finally {
        Na = false, Error.prepareStackTrace = c;
      }
      return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
    }
    function Pa(a) {
      switch (a.tag) {
        case 5:
          return Ma(a.type);
        case 16:
          return Ma("Lazy");
        case 13:
          return Ma("Suspense");
        case 19:
          return Ma("SuspenseList");
        case 0:
        case 2:
        case 15:
          return a = Oa(a.type, false), a;
        case 11:
          return a = Oa(a.type.render, false), a;
        case 1:
          return a = Oa(a.type, true), a;
        default:
          return "";
      }
    }
    function Qa(a) {
      if (null == a) return null;
      if ("function" === typeof a) return a.displayName || a.name || null;
      if ("string" === typeof a) return a;
      switch (a) {
        case ya:
          return "Fragment";
        case wa:
          return "Portal";
        case Aa:
          return "Profiler";
        case za:
          return "StrictMode";
        case Ea:
          return "Suspense";
        case Fa:
          return "SuspenseList";
      }
      if ("object" === typeof a) switch (a.$$typeof) {
        case Ca:
          return (a.displayName || "Context") + ".Consumer";
        case Ba:
          return (a._context.displayName || "Context") + ".Provider";
        case Da:
          var b = a.render;
          a = a.displayName;
          a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
          return a;
        case Ga:
          return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
        case Ha:
          b = a._payload;
          a = a._init;
          try {
            return Qa(a(b));
          } catch (c) {
          }
      }
      return null;
    }
    function Ra(a) {
      var b = a.type;
      switch (a.tag) {
        case 24:
          return "Cache";
        case 9:
          return (b.displayName || "Context") + ".Consumer";
        case 10:
          return (b._context.displayName || "Context") + ".Provider";
        case 18:
          return "DehydratedFragment";
        case 11:
          return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
        case 7:
          return "Fragment";
        case 5:
          return b;
        case 4:
          return "Portal";
        case 3:
          return "Root";
        case 6:
          return "Text";
        case 16:
          return Qa(b);
        case 8:
          return b === za ? "StrictMode" : "Mode";
        case 22:
          return "Offscreen";
        case 12:
          return "Profiler";
        case 21:
          return "Scope";
        case 13:
          return "Suspense";
        case 19:
          return "SuspenseList";
        case 25:
          return "TracingMarker";
        case 1:
        case 0:
        case 17:
        case 2:
        case 14:
        case 15:
          if ("function" === typeof b) return b.displayName || b.name || null;
          if ("string" === typeof b) return b;
      }
      return null;
    }
    function Sa(a) {
      switch (typeof a) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return a;
        case "object":
          return a;
        default:
          return "";
      }
    }
    function Ta(a) {
      var b = a.type;
      return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
    }
    function Ua(a) {
      var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
      if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
        var e = c.get, f = c.set;
        Object.defineProperty(a, b, { configurable: true, get: function() {
          return e.call(this);
        }, set: function(a2) {
          d = "" + a2;
          f.call(this, a2);
        } });
        Object.defineProperty(a, b, { enumerable: c.enumerable });
        return { getValue: function() {
          return d;
        }, setValue: function(a2) {
          d = "" + a2;
        }, stopTracking: function() {
          a._valueTracker = null;
          delete a[b];
        } };
      }
    }
    function Va(a) {
      a._valueTracker || (a._valueTracker = Ua(a));
    }
    function Wa(a) {
      if (!a) return false;
      var b = a._valueTracker;
      if (!b) return true;
      var c = b.getValue();
      var d = "";
      a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
      a = d;
      return a !== c ? (b.setValue(a), true) : false;
    }
    function Xa(a) {
      a = a || ("undefined" !== typeof document ? document : void 0);
      if ("undefined" === typeof a) return null;
      try {
        return a.activeElement || a.body;
      } catch (b) {
        return a.body;
      }
    }
    function Ya(a, b) {
      var c = b.checked;
      return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
    }
    function Za(a, b) {
      var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
      c = Sa(null != b.value ? b.value : c);
      a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
    }
    function ab(a, b) {
      b = b.checked;
      null != b && ta(a, "checked", b, false);
    }
    function bb(a, b) {
      ab(a, b);
      var c = Sa(b.value), d = b.type;
      if (null != c) if ("number" === d) {
        if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
      } else a.value !== "" + c && (a.value = "" + c);
      else if ("submit" === d || "reset" === d) {
        a.removeAttribute("value");
        return;
      }
      b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
      null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
    }
    function db(a, b, c) {
      if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
        var d = b.type;
        if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
        b = "" + a._wrapperState.initialValue;
        c || b === a.value || (a.value = b);
        a.defaultValue = b;
      }
      c = a.name;
      "" !== c && (a.name = "");
      a.defaultChecked = !!a._wrapperState.initialChecked;
      "" !== c && (a.name = c);
    }
    function cb(a, b, c) {
      if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
    }
    var eb = Array.isArray;
    function fb(a, b, c, d) {
      a = a.options;
      if (b) {
        b = {};
        for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
        for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
      } else {
        c = "" + Sa(c);
        b = null;
        for (e = 0; e < a.length; e++) {
          if (a[e].value === c) {
            a[e].selected = true;
            d && (a[e].defaultSelected = true);
            return;
          }
          null !== b || a[e].disabled || (b = a[e]);
        }
        null !== b && (b.selected = true);
      }
    }
    function gb(a, b) {
      if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
      return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
    }
    function hb(a, b) {
      var c = b.value;
      if (null == c) {
        c = b.children;
        b = b.defaultValue;
        if (null != c) {
          if (null != b) throw Error(p(92));
          if (eb(c)) {
            if (1 < c.length) throw Error(p(93));
            c = c[0];
          }
          b = c;
        }
        null == b && (b = "");
        c = b;
      }
      a._wrapperState = { initialValue: Sa(c) };
    }
    function ib(a, b) {
      var c = Sa(b.value), d = Sa(b.defaultValue);
      null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
      null != d && (a.defaultValue = "" + d);
    }
    function jb(a) {
      var b = a.textContent;
      b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
    }
    function kb(a) {
      switch (a) {
        case "svg":
          return "http://www.w3.org/2000/svg";
        case "math":
          return "http://www.w3.org/1998/Math/MathML";
        default:
          return "http://www.w3.org/1999/xhtml";
      }
    }
    function lb(a, b) {
      return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
    }
    var mb;
    var nb = (function(a) {
      return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
        MSApp.execUnsafeLocalFunction(function() {
          return a(b, c, d, e);
        });
      } : a;
    })(function(a, b) {
      if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
      else {
        mb = mb || document.createElement("div");
        mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
        for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
        for (; b.firstChild; ) a.appendChild(b.firstChild);
      }
    });
    function ob(a, b) {
      if (b) {
        var c = a.firstChild;
        if (c && c === a.lastChild && 3 === c.nodeType) {
          c.nodeValue = b;
          return;
        }
      }
      a.textContent = b;
    }
    var pb = {
      animationIterationCount: true,
      aspectRatio: true,
      borderImageOutset: true,
      borderImageSlice: true,
      borderImageWidth: true,
      boxFlex: true,
      boxFlexGroup: true,
      boxOrdinalGroup: true,
      columnCount: true,
      columns: true,
      flex: true,
      flexGrow: true,
      flexPositive: true,
      flexShrink: true,
      flexNegative: true,
      flexOrder: true,
      gridArea: true,
      gridRow: true,
      gridRowEnd: true,
      gridRowSpan: true,
      gridRowStart: true,
      gridColumn: true,
      gridColumnEnd: true,
      gridColumnSpan: true,
      gridColumnStart: true,
      fontWeight: true,
      lineClamp: true,
      lineHeight: true,
      opacity: true,
      order: true,
      orphans: true,
      tabSize: true,
      widows: true,
      zIndex: true,
      zoom: true,
      fillOpacity: true,
      floodOpacity: true,
      stopOpacity: true,
      strokeDasharray: true,
      strokeDashoffset: true,
      strokeMiterlimit: true,
      strokeOpacity: true,
      strokeWidth: true
    };
    var qb = ["Webkit", "ms", "Moz", "O"];
    Object.keys(pb).forEach(function(a) {
      qb.forEach(function(b) {
        b = b + a.charAt(0).toUpperCase() + a.substring(1);
        pb[b] = pb[a];
      });
    });
    function rb(a, b, c) {
      return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
    }
    function sb(a, b) {
      a = a.style;
      for (var c in b) if (b.hasOwnProperty(c)) {
        var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
        "float" === c && (c = "cssFloat");
        d ? a.setProperty(c, e) : a[c] = e;
      }
    }
    var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
    function ub(a, b) {
      if (b) {
        if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
        if (null != b.dangerouslySetInnerHTML) {
          if (null != b.children) throw Error(p(60));
          if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
        }
        if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
      }
    }
    function vb(a, b) {
      if (-1 === a.indexOf("-")) return "string" === typeof b.is;
      switch (a) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return false;
        default:
          return true;
      }
    }
    var wb = null;
    function xb(a) {
      a = a.target || a.srcElement || window;
      a.correspondingUseElement && (a = a.correspondingUseElement);
      return 3 === a.nodeType ? a.parentNode : a;
    }
    var yb = null;
    var zb = null;
    var Ab = null;
    function Bb(a) {
      if (a = Cb(a)) {
        if ("function" !== typeof yb) throw Error(p(280));
        var b = a.stateNode;
        b && (b = Db(b), yb(a.stateNode, a.type, b));
      }
    }
    function Eb(a) {
      zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
    }
    function Fb() {
      if (zb) {
        var a = zb, b = Ab;
        Ab = zb = null;
        Bb(a);
        if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
      }
    }
    function Gb(a, b) {
      return a(b);
    }
    function Hb() {
    }
    var Ib = false;
    function Jb(a, b, c) {
      if (Ib) return a(b, c);
      Ib = true;
      try {
        return Gb(a, b, c);
      } finally {
        if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
      }
    }
    function Kb(a, b) {
      var c = a.stateNode;
      if (null === c) return null;
      var d = Db(c);
      if (null === d) return null;
      c = d[b];
      a: switch (b) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
          a = !d;
          break a;
        default:
          a = false;
      }
      if (a) return null;
      if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
      return c;
    }
    var Lb = false;
    if (ia) try {
      Mb = {};
      Object.defineProperty(Mb, "passive", { get: function() {
        Lb = true;
      } });
      window.addEventListener("test", Mb, Mb);
      window.removeEventListener("test", Mb, Mb);
    } catch (a) {
      Lb = false;
    }
    var Mb;
    function Nb(a, b, c, d, e, f, g, h, k) {
      var l = Array.prototype.slice.call(arguments, 3);
      try {
        b.apply(c, l);
      } catch (m) {
        this.onError(m);
      }
    }
    var Ob = false;
    var Pb = null;
    var Qb = false;
    var Rb = null;
    var Sb = { onError: function(a) {
      Ob = true;
      Pb = a;
    } };
    function Tb(a, b, c, d, e, f, g, h, k) {
      Ob = false;
      Pb = null;
      Nb.apply(Sb, arguments);
    }
    function Ub(a, b, c, d, e, f, g, h, k) {
      Tb.apply(this, arguments);
      if (Ob) {
        if (Ob) {
          var l = Pb;
          Ob = false;
          Pb = null;
        } else throw Error(p(198));
        Qb || (Qb = true, Rb = l);
      }
    }
    function Vb(a) {
      var b = a, c = a;
      if (a.alternate) for (; b.return; ) b = b.return;
      else {
        a = b;
        do
          b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
        while (a);
      }
      return 3 === b.tag ? c : null;
    }
    function Wb(a) {
      if (13 === a.tag) {
        var b = a.memoizedState;
        null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
        if (null !== b) return b.dehydrated;
      }
      return null;
    }
    function Xb(a) {
      if (Vb(a) !== a) throw Error(p(188));
    }
    function Yb(a) {
      var b = a.alternate;
      if (!b) {
        b = Vb(a);
        if (null === b) throw Error(p(188));
        return b !== a ? null : a;
      }
      for (var c = a, d = b; ; ) {
        var e = c.return;
        if (null === e) break;
        var f = e.alternate;
        if (null === f) {
          d = e.return;
          if (null !== d) {
            c = d;
            continue;
          }
          break;
        }
        if (e.child === f.child) {
          for (f = e.child; f; ) {
            if (f === c) return Xb(e), a;
            if (f === d) return Xb(e), b;
            f = f.sibling;
          }
          throw Error(p(188));
        }
        if (c.return !== d.return) c = e, d = f;
        else {
          for (var g = false, h = e.child; h; ) {
            if (h === c) {
              g = true;
              c = e;
              d = f;
              break;
            }
            if (h === d) {
              g = true;
              d = e;
              c = f;
              break;
            }
            h = h.sibling;
          }
          if (!g) {
            for (h = f.child; h; ) {
              if (h === c) {
                g = true;
                c = f;
                d = e;
                break;
              }
              if (h === d) {
                g = true;
                d = f;
                c = e;
                break;
              }
              h = h.sibling;
            }
            if (!g) throw Error(p(189));
          }
        }
        if (c.alternate !== d) throw Error(p(190));
      }
      if (3 !== c.tag) throw Error(p(188));
      return c.stateNode.current === c ? a : b;
    }
    function Zb(a) {
      a = Yb(a);
      return null !== a ? $b(a) : null;
    }
    function $b(a) {
      if (5 === a.tag || 6 === a.tag) return a;
      for (a = a.child; null !== a; ) {
        var b = $b(a);
        if (null !== b) return b;
        a = a.sibling;
      }
      return null;
    }
    var ac = ca.unstable_scheduleCallback;
    var bc = ca.unstable_cancelCallback;
    var cc = ca.unstable_shouldYield;
    var dc = ca.unstable_requestPaint;
    var B = ca.unstable_now;
    var ec = ca.unstable_getCurrentPriorityLevel;
    var fc = ca.unstable_ImmediatePriority;
    var gc = ca.unstable_UserBlockingPriority;
    var hc = ca.unstable_NormalPriority;
    var ic = ca.unstable_LowPriority;
    var jc = ca.unstable_IdlePriority;
    var kc = null;
    var lc = null;
    function mc(a) {
      if (lc && "function" === typeof lc.onCommitFiberRoot) try {
        lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
      } catch (b) {
      }
    }
    var oc = Math.clz32 ? Math.clz32 : nc;
    var pc = Math.log;
    var qc = Math.LN2;
    function nc(a) {
      a >>>= 0;
      return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
    }
    var rc = 64;
    var sc = 4194304;
    function tc(a) {
      switch (a & -a) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return a & 4194240;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          return a & 130023424;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 1073741824;
        default:
          return a;
      }
    }
    function uc(a, b) {
      var c = a.pendingLanes;
      if (0 === c) return 0;
      var d = 0, e = a.suspendedLanes, f = a.pingedLanes, g = c & 268435455;
      if (0 !== g) {
        var h = g & ~e;
        0 !== h ? d = tc(h) : (f &= g, 0 !== f && (d = tc(f)));
      } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f && (d = tc(f));
      if (0 === d) return 0;
      if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f = b & -b, e >= f || 16 === e && 0 !== (f & 4194240))) return b;
      0 !== (d & 4) && (d |= c & 16);
      b = a.entangledLanes;
      if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
      return d;
    }
    function vc(a, b) {
      switch (a) {
        case 1:
        case 2:
        case 4:
          return b + 250;
        case 8:
        case 16:
        case 32:
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return b + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          return -1;
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function wc(a, b) {
      for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f = a.pendingLanes; 0 < f; ) {
        var g = 31 - oc(f), h = 1 << g, k = e[g];
        if (-1 === k) {
          if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
        } else k <= b && (a.expiredLanes |= h);
        f &= ~h;
      }
    }
    function xc(a) {
      a = a.pendingLanes & -1073741825;
      return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
    }
    function yc() {
      var a = rc;
      rc <<= 1;
      0 === (rc & 4194240) && (rc = 64);
      return a;
    }
    function zc(a) {
      for (var b = [], c = 0; 31 > c; c++) b.push(a);
      return b;
    }
    function Ac(a, b, c) {
      a.pendingLanes |= b;
      536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
      a = a.eventTimes;
      b = 31 - oc(b);
      a[b] = c;
    }
    function Bc(a, b) {
      var c = a.pendingLanes & ~b;
      a.pendingLanes = b;
      a.suspendedLanes = 0;
      a.pingedLanes = 0;
      a.expiredLanes &= b;
      a.mutableReadLanes &= b;
      a.entangledLanes &= b;
      b = a.entanglements;
      var d = a.eventTimes;
      for (a = a.expirationTimes; 0 < c; ) {
        var e = 31 - oc(c), f = 1 << e;
        b[e] = 0;
        d[e] = -1;
        a[e] = -1;
        c &= ~f;
      }
    }
    function Cc(a, b) {
      var c = a.entangledLanes |= b;
      for (a = a.entanglements; c; ) {
        var d = 31 - oc(c), e = 1 << d;
        e & b | a[d] & b && (a[d] |= b);
        c &= ~e;
      }
    }
    var C = 0;
    function Dc(a) {
      a &= -a;
      return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
    }
    var Ec;
    var Fc;
    var Gc;
    var Hc;
    var Ic;
    var Jc = false;
    var Kc = [];
    var Lc = null;
    var Mc = null;
    var Nc = null;
    var Oc = /* @__PURE__ */ new Map();
    var Pc = /* @__PURE__ */ new Map();
    var Qc = [];
    var Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
    function Sc(a, b) {
      switch (a) {
        case "focusin":
        case "focusout":
          Lc = null;
          break;
        case "dragenter":
        case "dragleave":
          Mc = null;
          break;
        case "mouseover":
        case "mouseout":
          Nc = null;
          break;
        case "pointerover":
        case "pointerout":
          Oc.delete(b.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          Pc.delete(b.pointerId);
      }
    }
    function Tc(a, b, c, d, e, f) {
      if (null === a || a.nativeEvent !== f) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
      a.eventSystemFlags |= d;
      b = a.targetContainers;
      null !== e && -1 === b.indexOf(e) && b.push(e);
      return a;
    }
    function Uc(a, b, c, d, e) {
      switch (b) {
        case "focusin":
          return Lc = Tc(Lc, a, b, c, d, e), true;
        case "dragenter":
          return Mc = Tc(Mc, a, b, c, d, e), true;
        case "mouseover":
          return Nc = Tc(Nc, a, b, c, d, e), true;
        case "pointerover":
          var f = e.pointerId;
          Oc.set(f, Tc(Oc.get(f) || null, a, b, c, d, e));
          return true;
        case "gotpointercapture":
          return f = e.pointerId, Pc.set(f, Tc(Pc.get(f) || null, a, b, c, d, e)), true;
      }
      return false;
    }
    function Vc(a) {
      var b = Wc(a.target);
      if (null !== b) {
        var c = Vb(b);
        if (null !== c) {
          if (b = c.tag, 13 === b) {
            if (b = Wb(c), null !== b) {
              a.blockedOn = b;
              Ic(a.priority, function() {
                Gc(c);
              });
              return;
            }
          } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
            a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
            return;
          }
        }
      }
      a.blockedOn = null;
    }
    function Xc(a) {
      if (null !== a.blockedOn) return false;
      for (var b = a.targetContainers; 0 < b.length; ) {
        var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
        if (null === c) {
          c = a.nativeEvent;
          var d = new c.constructor(c.type, c);
          wb = d;
          c.target.dispatchEvent(d);
          wb = null;
        } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
        b.shift();
      }
      return true;
    }
    function Zc(a, b, c) {
      Xc(a) && c.delete(b);
    }
    function $c() {
      Jc = false;
      null !== Lc && Xc(Lc) && (Lc = null);
      null !== Mc && Xc(Mc) && (Mc = null);
      null !== Nc && Xc(Nc) && (Nc = null);
      Oc.forEach(Zc);
      Pc.forEach(Zc);
    }
    function ad(a, b) {
      a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
    }
    function bd(a) {
      function b(b2) {
        return ad(b2, a);
      }
      if (0 < Kc.length) {
        ad(Kc[0], a);
        for (var c = 1; c < Kc.length; c++) {
          var d = Kc[c];
          d.blockedOn === a && (d.blockedOn = null);
        }
      }
      null !== Lc && ad(Lc, a);
      null !== Mc && ad(Mc, a);
      null !== Nc && ad(Nc, a);
      Oc.forEach(b);
      Pc.forEach(b);
      for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
      for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
    }
    var cd = ua.ReactCurrentBatchConfig;
    var dd = true;
    function ed(a, b, c, d) {
      var e = C, f = cd.transition;
      cd.transition = null;
      try {
        C = 1, fd(a, b, c, d);
      } finally {
        C = e, cd.transition = f;
      }
    }
    function gd(a, b, c, d) {
      var e = C, f = cd.transition;
      cd.transition = null;
      try {
        C = 4, fd(a, b, c, d);
      } finally {
        C = e, cd.transition = f;
      }
    }
    function fd(a, b, c, d) {
      if (dd) {
        var e = Yc(a, b, c, d);
        if (null === e) hd(a, b, d, id, c), Sc(a, d);
        else if (Uc(e, a, b, c, d)) d.stopPropagation();
        else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
          for (; null !== e; ) {
            var f = Cb(e);
            null !== f && Ec(f);
            f = Yc(a, b, c, d);
            null === f && hd(a, b, d, id, c);
            if (f === e) break;
            e = f;
          }
          null !== e && d.stopPropagation();
        } else hd(a, b, d, null, c);
      }
    }
    var id = null;
    function Yc(a, b, c, d) {
      id = null;
      a = xb(d);
      a = Wc(a);
      if (null !== a) if (b = Vb(a), null === b) a = null;
      else if (c = b.tag, 13 === c) {
        a = Wb(b);
        if (null !== a) return a;
        a = null;
      } else if (3 === c) {
        if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
        a = null;
      } else b !== a && (a = null);
      id = a;
      return null;
    }
    function jd(a) {
      switch (a) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return 1;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return 4;
        case "message":
          switch (ec()) {
            case fc:
              return 1;
            case gc:
              return 4;
            case hc:
            case ic:
              return 16;
            case jc:
              return 536870912;
            default:
              return 16;
          }
        default:
          return 16;
      }
    }
    var kd = null;
    var ld = null;
    var md = null;
    function nd() {
      if (md) return md;
      var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f = e.length;
      for (a = 0; a < c && b[a] === e[a]; a++) ;
      var g = c - a;
      for (d = 1; d <= g && b[c - d] === e[f - d]; d++) ;
      return md = e.slice(a, 1 < d ? 1 - d : void 0);
    }
    function od(a) {
      var b = a.keyCode;
      "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
      10 === a && (a = 13);
      return 32 <= a || 13 === a ? a : 0;
    }
    function pd() {
      return true;
    }
    function qd() {
      return false;
    }
    function rd(a) {
      function b(b2, d, e, f, g) {
        this._reactName = b2;
        this._targetInst = e;
        this.type = d;
        this.nativeEvent = f;
        this.target = g;
        this.currentTarget = null;
        for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f) : f[c]);
        this.isDefaultPrevented = (null != f.defaultPrevented ? f.defaultPrevented : false === f.returnValue) ? pd : qd;
        this.isPropagationStopped = qd;
        return this;
      }
      A(b.prototype, { preventDefault: function() {
        this.defaultPrevented = true;
        var a2 = this.nativeEvent;
        a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
      }, stopPropagation: function() {
        var a2 = this.nativeEvent;
        a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
      }, persist: function() {
      }, isPersistent: pd });
      return b;
    }
    var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
      return a.timeStamp || Date.now();
    }, defaultPrevented: 0, isTrusted: 0 };
    var td = rd(sd);
    var ud = A({}, sd, { view: 0, detail: 0 });
    var vd = rd(ud);
    var wd;
    var xd;
    var yd;
    var Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
      return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
    }, movementX: function(a) {
      if ("movementX" in a) return a.movementX;
      a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
      return wd;
    }, movementY: function(a) {
      return "movementY" in a ? a.movementY : xd;
    } });
    var Bd = rd(Ad);
    var Cd = A({}, Ad, { dataTransfer: 0 });
    var Dd = rd(Cd);
    var Ed = A({}, ud, { relatedTarget: 0 });
    var Fd = rd(Ed);
    var Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 });
    var Hd = rd(Gd);
    var Id = A({}, sd, { clipboardData: function(a) {
      return "clipboardData" in a ? a.clipboardData : window.clipboardData;
    } });
    var Jd = rd(Id);
    var Kd = A({}, sd, { data: 0 });
    var Ld = rd(Kd);
    var Md = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    };
    var Nd = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    var Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
    function Pd(a) {
      var b = this.nativeEvent;
      return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
    }
    function zd() {
      return Pd;
    }
    var Qd = A({}, ud, { key: function(a) {
      if (a.key) {
        var b = Md[a.key] || a.key;
        if ("Unidentified" !== b) return b;
      }
      return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
    }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
      return "keypress" === a.type ? od(a) : 0;
    }, keyCode: function(a) {
      return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
    }, which: function(a) {
      return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
    } });
    var Rd = rd(Qd);
    var Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 });
    var Td = rd(Sd);
    var Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd });
    var Vd = rd(Ud);
    var Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 });
    var Xd = rd(Wd);
    var Yd = A({}, Ad, {
      deltaX: function(a) {
        return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
      },
      deltaY: function(a) {
        return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    });
    var Zd = rd(Yd);
    var $d = [9, 13, 27, 32];
    var ae = ia && "CompositionEvent" in window;
    var be = null;
    ia && "documentMode" in document && (be = document.documentMode);
    var ce = ia && "TextEvent" in window && !be;
    var de = ia && (!ae || be && 8 < be && 11 >= be);
    var ee = String.fromCharCode(32);
    var fe = false;
    function ge(a, b) {
      switch (a) {
        case "keyup":
          return -1 !== $d.indexOf(b.keyCode);
        case "keydown":
          return 229 !== b.keyCode;
        case "keypress":
        case "mousedown":
        case "focusout":
          return true;
        default:
          return false;
      }
    }
    function he(a) {
      a = a.detail;
      return "object" === typeof a && "data" in a ? a.data : null;
    }
    var ie = false;
    function je(a, b) {
      switch (a) {
        case "compositionend":
          return he(b);
        case "keypress":
          if (32 !== b.which) return null;
          fe = true;
          return ee;
        case "textInput":
          return a = b.data, a === ee && fe ? null : a;
        default:
          return null;
      }
    }
    function ke(a, b) {
      if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
      switch (a) {
        case "paste":
          return null;
        case "keypress":
          if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
            if (b.char && 1 < b.char.length) return b.char;
            if (b.which) return String.fromCharCode(b.which);
          }
          return null;
        case "compositionend":
          return de && "ko" !== b.locale ? null : b.data;
        default:
          return null;
      }
    }
    var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
    function me(a) {
      var b = a && a.nodeName && a.nodeName.toLowerCase();
      return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
    }
    function ne(a, b, c, d) {
      Eb(d);
      b = oe(b, "onChange");
      0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
    }
    var pe = null;
    var qe = null;
    function re(a) {
      se(a, 0);
    }
    function te(a) {
      var b = ue(a);
      if (Wa(b)) return a;
    }
    function ve(a, b) {
      if ("change" === a) return b;
    }
    var we = false;
    if (ia) {
      if (ia) {
        ye = "oninput" in document;
        if (!ye) {
          ze = document.createElement("div");
          ze.setAttribute("oninput", "return;");
          ye = "function" === typeof ze.oninput;
        }
        xe = ye;
      } else xe = false;
      we = xe && (!document.documentMode || 9 < document.documentMode);
    }
    var xe;
    var ye;
    var ze;
    function Ae() {
      pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
    }
    function Be(a) {
      if ("value" === a.propertyName && te(qe)) {
        var b = [];
        ne(b, qe, a, xb(a));
        Jb(re, b);
      }
    }
    function Ce(a, b, c) {
      "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
    }
    function De(a) {
      if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
    }
    function Ee(a, b) {
      if ("click" === a) return te(b);
    }
    function Fe(a, b) {
      if ("input" === a || "change" === a) return te(b);
    }
    function Ge(a, b) {
      return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
    }
    var He = "function" === typeof Object.is ? Object.is : Ge;
    function Ie(a, b) {
      if (He(a, b)) return true;
      if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
      var c = Object.keys(a), d = Object.keys(b);
      if (c.length !== d.length) return false;
      for (d = 0; d < c.length; d++) {
        var e = c[d];
        if (!ja.call(b, e) || !He(a[e], b[e])) return false;
      }
      return true;
    }
    function Je(a) {
      for (; a && a.firstChild; ) a = a.firstChild;
      return a;
    }
    function Ke(a, b) {
      var c = Je(a);
      a = 0;
      for (var d; c; ) {
        if (3 === c.nodeType) {
          d = a + c.textContent.length;
          if (a <= b && d >= b) return { node: c, offset: b - a };
          a = d;
        }
        a: {
          for (; c; ) {
            if (c.nextSibling) {
              c = c.nextSibling;
              break a;
            }
            c = c.parentNode;
          }
          c = void 0;
        }
        c = Je(c);
      }
    }
    function Le(a, b) {
      return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
    }
    function Me() {
      for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
        try {
          var c = "string" === typeof b.contentWindow.location.href;
        } catch (d) {
          c = false;
        }
        if (c) a = b.contentWindow;
        else break;
        b = Xa(a.document);
      }
      return b;
    }
    function Ne(a) {
      var b = a && a.nodeName && a.nodeName.toLowerCase();
      return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
    }
    function Oe(a) {
      var b = Me(), c = a.focusedElem, d = a.selectionRange;
      if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
        if (null !== d && Ne(c)) {
          if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
          else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
            a = a.getSelection();
            var e = c.textContent.length, f = Math.min(d.start, e);
            d = void 0 === d.end ? f : Math.min(d.end, e);
            !a.extend && f > d && (e = d, d = f, f = e);
            e = Ke(c, f);
            var g = Ke(
              c,
              d
            );
            e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
          }
        }
        b = [];
        for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
        "function" === typeof c.focus && c.focus();
        for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
      }
    }
    var Pe = ia && "documentMode" in document && 11 >= document.documentMode;
    var Qe = null;
    var Re = null;
    var Se = null;
    var Te = false;
    function Ue(a, b, c) {
      var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
      Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
    }
    function Ve(a, b) {
      var c = {};
      c[a.toLowerCase()] = b.toLowerCase();
      c["Webkit" + a] = "webkit" + b;
      c["Moz" + a] = "moz" + b;
      return c;
    }
    var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") };
    var Xe = {};
    var Ye = {};
    ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
    function Ze(a) {
      if (Xe[a]) return Xe[a];
      if (!We[a]) return a;
      var b = We[a], c;
      for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
      return a;
    }
    var $e = Ze("animationend");
    var af = Ze("animationiteration");
    var bf = Ze("animationstart");
    var cf = Ze("transitionend");
    var df = /* @__PURE__ */ new Map();
    var ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    function ff(a, b) {
      df.set(a, b);
      fa(b, [a]);
    }
    for (gf = 0; gf < ef.length; gf++) {
      hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
      ff(jf, "on" + kf);
    }
    var hf;
    var jf;
    var kf;
    var gf;
    ff($e, "onAnimationEnd");
    ff(af, "onAnimationIteration");
    ff(bf, "onAnimationStart");
    ff("dblclick", "onDoubleClick");
    ff("focusin", "onFocus");
    ff("focusout", "onBlur");
    ff(cf, "onTransitionEnd");
    ha("onMouseEnter", ["mouseout", "mouseover"]);
    ha("onMouseLeave", ["mouseout", "mouseover"]);
    ha("onPointerEnter", ["pointerout", "pointerover"]);
    ha("onPointerLeave", ["pointerout", "pointerover"]);
    fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
    fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
    fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
    fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
    fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
    fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" ");
    var mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
    function nf(a, b, c) {
      var d = a.type || "unknown-event";
      a.currentTarget = c;
      Ub(d, b, void 0, a);
      a.currentTarget = null;
    }
    function se(a, b) {
      b = 0 !== (b & 4);
      for (var c = 0; c < a.length; c++) {
        var d = a[c], e = d.event;
        d = d.listeners;
        a: {
          var f = void 0;
          if (b) for (var g = d.length - 1; 0 <= g; g--) {
            var h = d[g], k = h.instance, l = h.currentTarget;
            h = h.listener;
            if (k !== f && e.isPropagationStopped()) break a;
            nf(e, h, l);
            f = k;
          }
          else for (g = 0; g < d.length; g++) {
            h = d[g];
            k = h.instance;
            l = h.currentTarget;
            h = h.listener;
            if (k !== f && e.isPropagationStopped()) break a;
            nf(e, h, l);
            f = k;
          }
        }
      }
      if (Qb) throw a = Rb, Qb = false, Rb = null, a;
    }
    function D(a, b) {
      var c = b[of];
      void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
      var d = a + "__bubble";
      c.has(d) || (pf(b, a, 2, false), c.add(d));
    }
    function qf(a, b, c) {
      var d = 0;
      b && (d |= 4);
      pf(c, a, d, b);
    }
    var rf = "_reactListening" + Math.random().toString(36).slice(2);
    function sf(a) {
      if (!a[rf]) {
        a[rf] = true;
        da.forEach(function(b2) {
          "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
        });
        var b = 9 === a.nodeType ? a : a.ownerDocument;
        null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
      }
    }
    function pf(a, b, c, d) {
      switch (jd(b)) {
        case 1:
          var e = ed;
          break;
        case 4:
          e = gd;
          break;
        default:
          e = fd;
      }
      c = e.bind(null, b, c, a);
      e = void 0;
      !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
      d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
    }
    function hd(a, b, c, d, e) {
      var f = d;
      if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
        if (null === d) return;
        var g = d.tag;
        if (3 === g || 4 === g) {
          var h = d.stateNode.containerInfo;
          if (h === e || 8 === h.nodeType && h.parentNode === e) break;
          if (4 === g) for (g = d.return; null !== g; ) {
            var k = g.tag;
            if (3 === k || 4 === k) {
              if (k = g.stateNode.containerInfo, k === e || 8 === k.nodeType && k.parentNode === e) return;
            }
            g = g.return;
          }
          for (; null !== h; ) {
            g = Wc(h);
            if (null === g) return;
            k = g.tag;
            if (5 === k || 6 === k) {
              d = f = g;
              continue a;
            }
            h = h.parentNode;
          }
        }
        d = d.return;
      }
      Jb(function() {
        var d2 = f, e2 = xb(c), g2 = [];
        a: {
          var h2 = df.get(a);
          if (void 0 !== h2) {
            var k2 = td, n = a;
            switch (a) {
              case "keypress":
                if (0 === od(c)) break a;
              case "keydown":
              case "keyup":
                k2 = Rd;
                break;
              case "focusin":
                n = "focus";
                k2 = Fd;
                break;
              case "focusout":
                n = "blur";
                k2 = Fd;
                break;
              case "beforeblur":
              case "afterblur":
                k2 = Fd;
                break;
              case "click":
                if (2 === c.button) break a;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                k2 = Bd;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                k2 = Dd;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                k2 = Vd;
                break;
              case $e:
              case af:
              case bf:
                k2 = Hd;
                break;
              case cf:
                k2 = Xd;
                break;
              case "scroll":
                k2 = vd;
                break;
              case "wheel":
                k2 = Zd;
                break;
              case "copy":
              case "cut":
              case "paste":
                k2 = Jd;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                k2 = Td;
            }
            var t = 0 !== (b & 4), J = !t && "scroll" === a, x = t ? null !== h2 ? h2 + "Capture" : null : h2;
            t = [];
            for (var w = d2, u; null !== w; ) {
              u = w;
              var F = u.stateNode;
              5 === u.tag && null !== F && (u = F, null !== x && (F = Kb(w, x), null != F && t.push(tf(w, F, u))));
              if (J) break;
              w = w.return;
            }
            0 < t.length && (h2 = new k2(h2, n, null, c, e2), g2.push({ event: h2, listeners: t }));
          }
        }
        if (0 === (b & 7)) {
          a: {
            h2 = "mouseover" === a || "pointerover" === a;
            k2 = "mouseout" === a || "pointerout" === a;
            if (h2 && c !== wb && (n = c.relatedTarget || c.fromElement) && (Wc(n) || n[uf])) break a;
            if (k2 || h2) {
              h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
              if (k2) {
                if (n = c.relatedTarget || c.toElement, k2 = d2, n = n ? Wc(n) : null, null !== n && (J = Vb(n), n !== J || 5 !== n.tag && 6 !== n.tag)) n = null;
              } else k2 = null, n = d2;
              if (k2 !== n) {
                t = Bd;
                F = "onMouseLeave";
                x = "onMouseEnter";
                w = "mouse";
                if ("pointerout" === a || "pointerover" === a) t = Td, F = "onPointerLeave", x = "onPointerEnter", w = "pointer";
                J = null == k2 ? h2 : ue(k2);
                u = null == n ? h2 : ue(n);
                h2 = new t(F, w + "leave", k2, c, e2);
                h2.target = J;
                h2.relatedTarget = u;
                F = null;
                Wc(e2) === d2 && (t = new t(x, w + "enter", n, c, e2), t.target = u, t.relatedTarget = J, F = t);
                J = F;
                if (k2 && n) b: {
                  t = k2;
                  x = n;
                  w = 0;
                  for (u = t; u; u = vf(u)) w++;
                  u = 0;
                  for (F = x; F; F = vf(F)) u++;
                  for (; 0 < w - u; ) t = vf(t), w--;
                  for (; 0 < u - w; ) x = vf(x), u--;
                  for (; w--; ) {
                    if (t === x || null !== x && t === x.alternate) break b;
                    t = vf(t);
                    x = vf(x);
                  }
                  t = null;
                }
                else t = null;
                null !== k2 && wf(g2, h2, k2, t, false);
                null !== n && null !== J && wf(g2, J, n, t, true);
              }
            }
          }
          a: {
            h2 = d2 ? ue(d2) : window;
            k2 = h2.nodeName && h2.nodeName.toLowerCase();
            if ("select" === k2 || "input" === k2 && "file" === h2.type) var na = ve;
            else if (me(h2)) if (we) na = Fe;
            else {
              na = De;
              var xa = Ce;
            }
            else (k2 = h2.nodeName) && "input" === k2.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
            if (na && (na = na(a, d2))) {
              ne(g2, na, c, e2);
              break a;
            }
            xa && xa(a, h2, d2);
            "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
          }
          xa = d2 ? ue(d2) : window;
          switch (a) {
            case "focusin":
              if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
              break;
            case "focusout":
              Se = Re = Qe = null;
              break;
            case "mousedown":
              Te = true;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              Te = false;
              Ue(g2, c, e2);
              break;
            case "selectionchange":
              if (Pe) break;
            case "keydown":
            case "keyup":
              Ue(g2, c, e2);
          }
          var $a;
          if (ae) b: {
            switch (a) {
              case "compositionstart":
                var ba = "onCompositionStart";
                break b;
              case "compositionend":
                ba = "onCompositionEnd";
                break b;
              case "compositionupdate":
                ba = "onCompositionUpdate";
                break b;
            }
            ba = void 0;
          }
          else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
          ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
          if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
        }
        se(g2, b);
      });
    }
    function tf(a, b, c) {
      return { instance: a, listener: b, currentTarget: c };
    }
    function oe(a, b) {
      for (var c = b + "Capture", d = []; null !== a; ) {
        var e = a, f = e.stateNode;
        5 === e.tag && null !== f && (e = f, f = Kb(a, c), null != f && d.unshift(tf(a, f, e)), f = Kb(a, b), null != f && d.push(tf(a, f, e)));
        a = a.return;
      }
      return d;
    }
    function vf(a) {
      if (null === a) return null;
      do
        a = a.return;
      while (a && 5 !== a.tag);
      return a ? a : null;
    }
    function wf(a, b, c, d, e) {
      for (var f = b._reactName, g = []; null !== c && c !== d; ) {
        var h = c, k = h.alternate, l = h.stateNode;
        if (null !== k && k === d) break;
        5 === h.tag && null !== l && (h = l, e ? (k = Kb(c, f), null != k && g.unshift(tf(c, k, h))) : e || (k = Kb(c, f), null != k && g.push(tf(c, k, h))));
        c = c.return;
      }
      0 !== g.length && a.push({ event: b, listeners: g });
    }
    var xf = /\r\n?/g;
    var yf = /\u0000|\uFFFD/g;
    function zf(a) {
      return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
    }
    function Af(a, b, c) {
      b = zf(b);
      if (zf(a) !== b && c) throw Error(p(425));
    }
    function Bf() {
    }
    var Cf = null;
    var Df = null;
    function Ef(a, b) {
      return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
    }
    var Ff = "function" === typeof setTimeout ? setTimeout : void 0;
    var Gf = "function" === typeof clearTimeout ? clearTimeout : void 0;
    var Hf = "function" === typeof Promise ? Promise : void 0;
    var Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
      return Hf.resolve(null).then(a).catch(If);
    } : Ff;
    function If(a) {
      setTimeout(function() {
        throw a;
      });
    }
    function Kf(a, b) {
      var c = b, d = 0;
      do {
        var e = c.nextSibling;
        a.removeChild(c);
        if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
          if (0 === d) {
            a.removeChild(e);
            bd(b);
            return;
          }
          d--;
        } else "$" !== c && "$?" !== c && "$!" !== c || d++;
        c = e;
      } while (c);
      bd(b);
    }
    function Lf(a) {
      for (; null != a; a = a.nextSibling) {
        var b = a.nodeType;
        if (1 === b || 3 === b) break;
        if (8 === b) {
          b = a.data;
          if ("$" === b || "$!" === b || "$?" === b) break;
          if ("/$" === b) return null;
        }
      }
      return a;
    }
    function Mf(a) {
      a = a.previousSibling;
      for (var b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("$" === c || "$!" === c || "$?" === c) {
            if (0 === b) return a;
            b--;
          } else "/$" === c && b++;
        }
        a = a.previousSibling;
      }
      return null;
    }
    var Nf = Math.random().toString(36).slice(2);
    var Of = "__reactFiber$" + Nf;
    var Pf = "__reactProps$" + Nf;
    var uf = "__reactContainer$" + Nf;
    var of = "__reactEvents$" + Nf;
    var Qf = "__reactListeners$" + Nf;
    var Rf = "__reactHandles$" + Nf;
    function Wc(a) {
      var b = a[Of];
      if (b) return b;
      for (var c = a.parentNode; c; ) {
        if (b = c[uf] || c[Of]) {
          c = b.alternate;
          if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
            if (c = a[Of]) return c;
            a = Mf(a);
          }
          return b;
        }
        a = c;
        c = a.parentNode;
      }
      return null;
    }
    function Cb(a) {
      a = a[Of] || a[uf];
      return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
    }
    function ue(a) {
      if (5 === a.tag || 6 === a.tag) return a.stateNode;
      throw Error(p(33));
    }
    function Db(a) {
      return a[Pf] || null;
    }
    var Sf = [];
    var Tf = -1;
    function Uf(a) {
      return { current: a };
    }
    function E(a) {
      0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
    }
    function G(a, b) {
      Tf++;
      Sf[Tf] = a.current;
      a.current = b;
    }
    var Vf = {};
    var H = Uf(Vf);
    var Wf = Uf(false);
    var Xf = Vf;
    function Yf(a, b) {
      var c = a.type.contextTypes;
      if (!c) return Vf;
      var d = a.stateNode;
      if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
      var e = {}, f;
      for (f in c) e[f] = b[f];
      d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
      return e;
    }
    function Zf(a) {
      a = a.childContextTypes;
      return null !== a && void 0 !== a;
    }
    function $f() {
      E(Wf);
      E(H);
    }
    function ag(a, b, c) {
      if (H.current !== Vf) throw Error(p(168));
      G(H, b);
      G(Wf, c);
    }
    function bg(a, b, c) {
      var d = a.stateNode;
      b = b.childContextTypes;
      if ("function" !== typeof d.getChildContext) return c;
      d = d.getChildContext();
      for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
      return A({}, c, d);
    }
    function cg(a) {
      a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
      Xf = H.current;
      G(H, a);
      G(Wf, Wf.current);
      return true;
    }
    function dg(a, b, c) {
      var d = a.stateNode;
      if (!d) throw Error(p(169));
      c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
      G(Wf, c);
    }
    var eg = null;
    var fg = false;
    var gg = false;
    function hg(a) {
      null === eg ? eg = [a] : eg.push(a);
    }
    function ig(a) {
      fg = true;
      hg(a);
    }
    function jg() {
      if (!gg && null !== eg) {
        gg = true;
        var a = 0, b = C;
        try {
          var c = eg;
          for (C = 1; a < c.length; a++) {
            var d = c[a];
            do
              d = d(true);
            while (null !== d);
          }
          eg = null;
          fg = false;
        } catch (e) {
          throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
        } finally {
          C = b, gg = false;
        }
      }
      return null;
    }
    var kg = [];
    var lg = 0;
    var mg = null;
    var ng = 0;
    var og = [];
    var pg = 0;
    var qg = null;
    var rg = 1;
    var sg = "";
    function tg(a, b) {
      kg[lg++] = ng;
      kg[lg++] = mg;
      mg = a;
      ng = b;
    }
    function ug(a, b, c) {
      og[pg++] = rg;
      og[pg++] = sg;
      og[pg++] = qg;
      qg = a;
      var d = rg;
      a = sg;
      var e = 32 - oc(d) - 1;
      d &= ~(1 << e);
      c += 1;
      var f = 32 - oc(b) + e;
      if (30 < f) {
        var g = e - e % 5;
        f = (d & (1 << g) - 1).toString(32);
        d >>= g;
        e -= g;
        rg = 1 << 32 - oc(b) + e | c << e | d;
        sg = f + a;
      } else rg = 1 << f | c << e | d, sg = a;
    }
    function vg(a) {
      null !== a.return && (tg(a, 1), ug(a, 1, 0));
    }
    function wg(a) {
      for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
      for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
    }
    var xg = null;
    var yg = null;
    var I = false;
    var zg = null;
    function Ag(a, b) {
      var c = Bg(5, null, null, 0);
      c.elementType = "DELETED";
      c.stateNode = b;
      c.return = a;
      b = a.deletions;
      null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
    }
    function Cg(a, b) {
      switch (a.tag) {
        case 5:
          var c = a.type;
          b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
          return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
        case 6:
          return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
        case 13:
          return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
        default:
          return false;
      }
    }
    function Dg(a) {
      return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
    }
    function Eg(a) {
      if (I) {
        var b = yg;
        if (b) {
          var c = b;
          if (!Cg(a, b)) {
            if (Dg(a)) throw Error(p(418));
            b = Lf(c.nextSibling);
            var d = xg;
            b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
          }
        } else {
          if (Dg(a)) throw Error(p(418));
          a.flags = a.flags & -4097 | 2;
          I = false;
          xg = a;
        }
      }
    }
    function Fg(a) {
      for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
      xg = a;
    }
    function Gg(a) {
      if (a !== xg) return false;
      if (!I) return Fg(a), I = true, false;
      var b;
      (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
      if (b && (b = yg)) {
        if (Dg(a)) throw Hg(), Error(p(418));
        for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
      }
      Fg(a);
      if (13 === a.tag) {
        a = a.memoizedState;
        a = null !== a ? a.dehydrated : null;
        if (!a) throw Error(p(317));
        a: {
          a = a.nextSibling;
          for (b = 0; a; ) {
            if (8 === a.nodeType) {
              var c = a.data;
              if ("/$" === c) {
                if (0 === b) {
                  yg = Lf(a.nextSibling);
                  break a;
                }
                b--;
              } else "$" !== c && "$!" !== c && "$?" !== c || b++;
            }
            a = a.nextSibling;
          }
          yg = null;
        }
      } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
      return true;
    }
    function Hg() {
      for (var a = yg; a; ) a = Lf(a.nextSibling);
    }
    function Ig() {
      yg = xg = null;
      I = false;
    }
    function Jg(a) {
      null === zg ? zg = [a] : zg.push(a);
    }
    var Kg = ua.ReactCurrentBatchConfig;
    function Lg(a, b, c) {
      a = c.ref;
      if (null !== a && "function" !== typeof a && "object" !== typeof a) {
        if (c._owner) {
          c = c._owner;
          if (c) {
            if (1 !== c.tag) throw Error(p(309));
            var d = c.stateNode;
          }
          if (!d) throw Error(p(147, a));
          var e = d, f = "" + a;
          if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f) return b.ref;
          b = function(a2) {
            var b2 = e.refs;
            null === a2 ? delete b2[f] : b2[f] = a2;
          };
          b._stringRef = f;
          return b;
        }
        if ("string" !== typeof a) throw Error(p(284));
        if (!c._owner) throw Error(p(290, a));
      }
      return a;
    }
    function Mg(a, b) {
      a = Object.prototype.toString.call(b);
      throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
    }
    function Ng(a) {
      var b = a._init;
      return b(a._payload);
    }
    function Og(a) {
      function b(b2, c2) {
        if (a) {
          var d2 = b2.deletions;
          null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
        }
      }
      function c(c2, d2) {
        if (!a) return null;
        for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
        return null;
      }
      function d(a2, b2) {
        for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
        return a2;
      }
      function e(a2, b2) {
        a2 = Pg(a2, b2);
        a2.index = 0;
        a2.sibling = null;
        return a2;
      }
      function f(b2, c2, d2) {
        b2.index = d2;
        if (!a) return b2.flags |= 1048576, c2;
        d2 = b2.alternate;
        if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
        b2.flags |= 2;
        return c2;
      }
      function g(b2) {
        a && null === b2.alternate && (b2.flags |= 2);
        return b2;
      }
      function h(a2, b2, c2, d2) {
        if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
        b2 = e(b2, c2);
        b2.return = a2;
        return b2;
      }
      function k(a2, b2, c2, d2) {
        var f2 = c2.type;
        if (f2 === ya) return m(a2, b2, c2.props.children, d2, c2.key);
        if (null !== b2 && (b2.elementType === f2 || "object" === typeof f2 && null !== f2 && f2.$$typeof === Ha && Ng(f2) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
        d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
        d2.ref = Lg(a2, b2, c2);
        d2.return = a2;
        return d2;
      }
      function l(a2, b2, c2, d2) {
        if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
        b2 = e(b2, c2.children || []);
        b2.return = a2;
        return b2;
      }
      function m(a2, b2, c2, d2, f2) {
        if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f2), b2.return = a2, b2;
        b2 = e(b2, c2);
        b2.return = a2;
        return b2;
      }
      function q(a2, b2, c2) {
        if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
        if ("object" === typeof b2 && null !== b2) {
          switch (b2.$$typeof) {
            case va:
              return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
            case wa:
              return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
            case Ha:
              var d2 = b2._init;
              return q(a2, d2(b2._payload), c2);
          }
          if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
          Mg(a2, b2);
        }
        return null;
      }
      function r(a2, b2, c2, d2) {
        var e2 = null !== b2 ? b2.key : null;
        if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
        if ("object" === typeof c2 && null !== c2) {
          switch (c2.$$typeof) {
            case va:
              return c2.key === e2 ? k(a2, b2, c2, d2) : null;
            case wa:
              return c2.key === e2 ? l(a2, b2, c2, d2) : null;
            case Ha:
              return e2 = c2._init, r(
                a2,
                b2,
                e2(c2._payload),
                d2
              );
          }
          if (eb(c2) || Ka(c2)) return null !== e2 ? null : m(a2, b2, c2, d2, null);
          Mg(a2, c2);
        }
        return null;
      }
      function y(a2, b2, c2, d2, e2) {
        if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
        if ("object" === typeof d2 && null !== d2) {
          switch (d2.$$typeof) {
            case va:
              return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k(b2, a2, d2, e2);
            case wa:
              return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l(b2, a2, d2, e2);
            case Ha:
              var f2 = d2._init;
              return y(a2, b2, c2, f2(d2._payload), e2);
          }
          if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m(b2, a2, d2, e2, null);
          Mg(b2, d2);
        }
        return null;
      }
      function n(e2, g2, h2, k2) {
        for (var l2 = null, m2 = null, u = g2, w = g2 = 0, x = null; null !== u && w < h2.length; w++) {
          u.index > w ? (x = u, u = null) : x = u.sibling;
          var n2 = r(e2, u, h2[w], k2);
          if (null === n2) {
            null === u && (u = x);
            break;
          }
          a && u && null === n2.alternate && b(e2, u);
          g2 = f(n2, g2, w);
          null === m2 ? l2 = n2 : m2.sibling = n2;
          m2 = n2;
          u = x;
        }
        if (w === h2.length) return c(e2, u), I && tg(e2, w), l2;
        if (null === u) {
          for (; w < h2.length; w++) u = q(e2, h2[w], k2), null !== u && (g2 = f(u, g2, w), null === m2 ? l2 = u : m2.sibling = u, m2 = u);
          I && tg(e2, w);
          return l2;
        }
        for (u = d(e2, u); w < h2.length; w++) x = y(u, e2, w, h2[w], k2), null !== x && (a && null !== x.alternate && u.delete(null === x.key ? w : x.key), g2 = f(x, g2, w), null === m2 ? l2 = x : m2.sibling = x, m2 = x);
        a && u.forEach(function(a2) {
          return b(e2, a2);
        });
        I && tg(e2, w);
        return l2;
      }
      function t(e2, g2, h2, k2) {
        var l2 = Ka(h2);
        if ("function" !== typeof l2) throw Error(p(150));
        h2 = l2.call(h2);
        if (null == h2) throw Error(p(151));
        for (var u = l2 = null, m2 = g2, w = g2 = 0, x = null, n2 = h2.next(); null !== m2 && !n2.done; w++, n2 = h2.next()) {
          m2.index > w ? (x = m2, m2 = null) : x = m2.sibling;
          var t2 = r(e2, m2, n2.value, k2);
          if (null === t2) {
            null === m2 && (m2 = x);
            break;
          }
          a && m2 && null === t2.alternate && b(e2, m2);
          g2 = f(t2, g2, w);
          null === u ? l2 = t2 : u.sibling = t2;
          u = t2;
          m2 = x;
        }
        if (n2.done) return c(
          e2,
          m2
        ), I && tg(e2, w), l2;
        if (null === m2) {
          for (; !n2.done; w++, n2 = h2.next()) n2 = q(e2, n2.value, k2), null !== n2 && (g2 = f(n2, g2, w), null === u ? l2 = n2 : u.sibling = n2, u = n2);
          I && tg(e2, w);
          return l2;
        }
        for (m2 = d(e2, m2); !n2.done; w++, n2 = h2.next()) n2 = y(m2, e2, w, n2.value, k2), null !== n2 && (a && null !== n2.alternate && m2.delete(null === n2.key ? w : n2.key), g2 = f(n2, g2, w), null === u ? l2 = n2 : u.sibling = n2, u = n2);
        a && m2.forEach(function(a2) {
          return b(e2, a2);
        });
        I && tg(e2, w);
        return l2;
      }
      function J(a2, d2, f2, h2) {
        "object" === typeof f2 && null !== f2 && f2.type === ya && null === f2.key && (f2 = f2.props.children);
        if ("object" === typeof f2 && null !== f2) {
          switch (f2.$$typeof) {
            case va:
              a: {
                for (var k2 = f2.key, l2 = d2; null !== l2; ) {
                  if (l2.key === k2) {
                    k2 = f2.type;
                    if (k2 === ya) {
                      if (7 === l2.tag) {
                        c(a2, l2.sibling);
                        d2 = e(l2, f2.props.children);
                        d2.return = a2;
                        a2 = d2;
                        break a;
                      }
                    } else if (l2.elementType === k2 || "object" === typeof k2 && null !== k2 && k2.$$typeof === Ha && Ng(k2) === l2.type) {
                      c(a2, l2.sibling);
                      d2 = e(l2, f2.props);
                      d2.ref = Lg(a2, l2, f2);
                      d2.return = a2;
                      a2 = d2;
                      break a;
                    }
                    c(a2, l2);
                    break;
                  } else b(a2, l2);
                  l2 = l2.sibling;
                }
                f2.type === ya ? (d2 = Tg(f2.props.children, a2.mode, h2, f2.key), d2.return = a2, a2 = d2) : (h2 = Rg(f2.type, f2.key, f2.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f2), h2.return = a2, a2 = h2);
              }
              return g(a2);
            case wa:
              a: {
                for (l2 = f2.key; null !== d2; ) {
                  if (d2.key === l2) if (4 === d2.tag && d2.stateNode.containerInfo === f2.containerInfo && d2.stateNode.implementation === f2.implementation) {
                    c(a2, d2.sibling);
                    d2 = e(d2, f2.children || []);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  } else {
                    c(a2, d2);
                    break;
                  }
                  else b(a2, d2);
                  d2 = d2.sibling;
                }
                d2 = Sg(f2, a2.mode, h2);
                d2.return = a2;
                a2 = d2;
              }
              return g(a2);
            case Ha:
              return l2 = f2._init, J(a2, d2, l2(f2._payload), h2);
          }
          if (eb(f2)) return n(a2, d2, f2, h2);
          if (Ka(f2)) return t(a2, d2, f2, h2);
          Mg(a2, f2);
        }
        return "string" === typeof f2 && "" !== f2 || "number" === typeof f2 ? (f2 = "" + f2, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f2), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f2, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
      }
      return J;
    }
    var Ug = Og(true);
    var Vg = Og(false);
    var Wg = Uf(null);
    var Xg = null;
    var Yg = null;
    var Zg = null;
    function $g() {
      Zg = Yg = Xg = null;
    }
    function ah(a) {
      var b = Wg.current;
      E(Wg);
      a._currentValue = b;
    }
    function bh(a, b, c) {
      for (; null !== a; ) {
        var d = a.alternate;
        (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
        if (a === c) break;
        a = a.return;
      }
    }
    function ch(a, b) {
      Xg = a;
      Zg = Yg = null;
      a = a.dependencies;
      null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
    }
    function eh(a) {
      var b = a._currentValue;
      if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
        if (null === Xg) throw Error(p(308));
        Yg = a;
        Xg.dependencies = { lanes: 0, firstContext: a };
      } else Yg = Yg.next = a;
      return b;
    }
    var fh = null;
    function gh(a) {
      null === fh ? fh = [a] : fh.push(a);
    }
    function hh(a, b, c, d) {
      var e = b.interleaved;
      null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
      b.interleaved = c;
      return ih(a, d);
    }
    function ih(a, b) {
      a.lanes |= b;
      var c = a.alternate;
      null !== c && (c.lanes |= b);
      c = a;
      for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
      return 3 === c.tag ? c.stateNode : null;
    }
    var jh = false;
    function kh(a) {
      a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
    }
    function lh(a, b) {
      a = a.updateQueue;
      b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
    }
    function mh(a, b) {
      return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
    }
    function nh(a, b, c) {
      var d = a.updateQueue;
      if (null === d) return null;
      d = d.shared;
      if (0 !== (K & 2)) {
        var e = d.pending;
        null === e ? b.next = b : (b.next = e.next, e.next = b);
        d.pending = b;
        return ih(a, c);
      }
      e = d.interleaved;
      null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
      d.interleaved = b;
      return ih(a, c);
    }
    function oh(a, b, c) {
      b = b.updateQueue;
      if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
        var d = b.lanes;
        d &= a.pendingLanes;
        c |= d;
        b.lanes = c;
        Cc(a, c);
      }
    }
    function ph(a, b) {
      var c = a.updateQueue, d = a.alternate;
      if (null !== d && (d = d.updateQueue, c === d)) {
        var e = null, f = null;
        c = c.firstBaseUpdate;
        if (null !== c) {
          do {
            var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
            null === f ? e = f = g : f = f.next = g;
            c = c.next;
          } while (null !== c);
          null === f ? e = f = b : f = f.next = b;
        } else e = f = b;
        c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f, shared: d.shared, effects: d.effects };
        a.updateQueue = c;
        return;
      }
      a = c.lastBaseUpdate;
      null === a ? c.firstBaseUpdate = b : a.next = b;
      c.lastBaseUpdate = b;
    }
    function qh(a, b, c, d) {
      var e = a.updateQueue;
      jh = false;
      var f = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
      if (null !== h) {
        e.shared.pending = null;
        var k = h, l = k.next;
        k.next = null;
        null === g ? f = l : g.next = l;
        g = k;
        var m = a.alternate;
        null !== m && (m = m.updateQueue, h = m.lastBaseUpdate, h !== g && (null === h ? m.firstBaseUpdate = l : h.next = l, m.lastBaseUpdate = k));
      }
      if (null !== f) {
        var q = e.baseState;
        g = 0;
        m = l = k = null;
        h = f;
        do {
          var r = h.lane, y = h.eventTime;
          if ((d & r) === r) {
            null !== m && (m = m.next = {
              eventTime: y,
              lane: 0,
              tag: h.tag,
              payload: h.payload,
              callback: h.callback,
              next: null
            });
            a: {
              var n = a, t = h;
              r = b;
              y = c;
              switch (t.tag) {
                case 1:
                  n = t.payload;
                  if ("function" === typeof n) {
                    q = n.call(y, q, r);
                    break a;
                  }
                  q = n;
                  break a;
                case 3:
                  n.flags = n.flags & -65537 | 128;
                case 0:
                  n = t.payload;
                  r = "function" === typeof n ? n.call(y, q, r) : n;
                  if (null === r || void 0 === r) break a;
                  q = A({}, q, r);
                  break a;
                case 2:
                  jh = true;
              }
            }
            null !== h.callback && 0 !== h.lane && (a.flags |= 64, r = e.effects, null === r ? e.effects = [h] : r.push(h));
          } else y = { eventTime: y, lane: r, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m ? (l = m = y, k = q) : m = m.next = y, g |= r;
          h = h.next;
          if (null === h) if (h = e.shared.pending, null === h) break;
          else r = h, h = r.next, r.next = null, e.lastBaseUpdate = r, e.shared.pending = null;
        } while (1);
        null === m && (k = q);
        e.baseState = k;
        e.firstBaseUpdate = l;
        e.lastBaseUpdate = m;
        b = e.shared.interleaved;
        if (null !== b) {
          e = b;
          do
            g |= e.lane, e = e.next;
          while (e !== b);
        } else null === f && (e.shared.lanes = 0);
        rh |= g;
        a.lanes = g;
        a.memoizedState = q;
      }
    }
    function sh(a, b, c) {
      a = b.effects;
      b.effects = null;
      if (null !== a) for (b = 0; b < a.length; b++) {
        var d = a[b], e = d.callback;
        if (null !== e) {
          d.callback = null;
          d = c;
          if ("function" !== typeof e) throw Error(p(191, e));
          e.call(d);
        }
      }
    }
    var th = {};
    var uh = Uf(th);
    var vh = Uf(th);
    var wh = Uf(th);
    function xh(a) {
      if (a === th) throw Error(p(174));
      return a;
    }
    function yh(a, b) {
      G(wh, b);
      G(vh, a);
      G(uh, th);
      a = b.nodeType;
      switch (a) {
        case 9:
        case 11:
          b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
          break;
        default:
          a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
      }
      E(uh);
      G(uh, b);
    }
    function zh() {
      E(uh);
      E(vh);
      E(wh);
    }
    function Ah(a) {
      xh(wh.current);
      var b = xh(uh.current);
      var c = lb(b, a.type);
      b !== c && (G(vh, a), G(uh, c));
    }
    function Bh(a) {
      vh.current === a && (E(uh), E(vh));
    }
    var L = Uf(0);
    function Ch(a) {
      for (var b = a; null !== b; ) {
        if (13 === b.tag) {
          var c = b.memoizedState;
          if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
        } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
          if (0 !== (b.flags & 128)) return b;
        } else if (null !== b.child) {
          b.child.return = b;
          b = b.child;
          continue;
        }
        if (b === a) break;
        for (; null === b.sibling; ) {
          if (null === b.return || b.return === a) return null;
          b = b.return;
        }
        b.sibling.return = b.return;
        b = b.sibling;
      }
      return null;
    }
    var Dh = [];
    function Eh() {
      for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
      Dh.length = 0;
    }
    var Fh = ua.ReactCurrentDispatcher;
    var Gh = ua.ReactCurrentBatchConfig;
    var Hh = 0;
    var M = null;
    var N = null;
    var O = null;
    var Ih = false;
    var Jh = false;
    var Kh = 0;
    var Lh = 0;
    function P() {
      throw Error(p(321));
    }
    function Mh(a, b) {
      if (null === b) return false;
      for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
      return true;
    }
    function Nh(a, b, c, d, e, f) {
      Hh = f;
      M = b;
      b.memoizedState = null;
      b.updateQueue = null;
      b.lanes = 0;
      Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
      a = c(d, e);
      if (Jh) {
        f = 0;
        do {
          Jh = false;
          Kh = 0;
          if (25 <= f) throw Error(p(301));
          f += 1;
          O = N = null;
          b.updateQueue = null;
          Fh.current = Qh;
          a = c(d, e);
        } while (Jh);
      }
      Fh.current = Rh;
      b = null !== N && null !== N.next;
      Hh = 0;
      O = N = M = null;
      Ih = false;
      if (b) throw Error(p(300));
      return a;
    }
    function Sh() {
      var a = 0 !== Kh;
      Kh = 0;
      return a;
    }
    function Th() {
      var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
      null === O ? M.memoizedState = O = a : O = O.next = a;
      return O;
    }
    function Uh() {
      if (null === N) {
        var a = M.alternate;
        a = null !== a ? a.memoizedState : null;
      } else a = N.next;
      var b = null === O ? M.memoizedState : O.next;
      if (null !== b) O = b, N = a;
      else {
        if (null === a) throw Error(p(310));
        N = a;
        a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
        null === O ? M.memoizedState = O = a : O = O.next = a;
      }
      return O;
    }
    function Vh(a, b) {
      return "function" === typeof b ? b(a) : b;
    }
    function Wh(a) {
      var b = Uh(), c = b.queue;
      if (null === c) throw Error(p(311));
      c.lastRenderedReducer = a;
      var d = N, e = d.baseQueue, f = c.pending;
      if (null !== f) {
        if (null !== e) {
          var g = e.next;
          e.next = f.next;
          f.next = g;
        }
        d.baseQueue = e = f;
        c.pending = null;
      }
      if (null !== e) {
        f = e.next;
        d = d.baseState;
        var h = g = null, k = null, l = f;
        do {
          var m = l.lane;
          if ((Hh & m) === m) null !== k && (k = k.next = { lane: 0, action: l.action, hasEagerState: l.hasEagerState, eagerState: l.eagerState, next: null }), d = l.hasEagerState ? l.eagerState : a(d, l.action);
          else {
            var q = {
              lane: m,
              action: l.action,
              hasEagerState: l.hasEagerState,
              eagerState: l.eagerState,
              next: null
            };
            null === k ? (h = k = q, g = d) : k = k.next = q;
            M.lanes |= m;
            rh |= m;
          }
          l = l.next;
        } while (null !== l && l !== f);
        null === k ? g = d : k.next = h;
        He(d, b.memoizedState) || (dh = true);
        b.memoizedState = d;
        b.baseState = g;
        b.baseQueue = k;
        c.lastRenderedState = d;
      }
      a = c.interleaved;
      if (null !== a) {
        e = a;
        do
          f = e.lane, M.lanes |= f, rh |= f, e = e.next;
        while (e !== a);
      } else null === e && (c.lanes = 0);
      return [b.memoizedState, c.dispatch];
    }
    function Xh(a) {
      var b = Uh(), c = b.queue;
      if (null === c) throw Error(p(311));
      c.lastRenderedReducer = a;
      var d = c.dispatch, e = c.pending, f = b.memoizedState;
      if (null !== e) {
        c.pending = null;
        var g = e = e.next;
        do
          f = a(f, g.action), g = g.next;
        while (g !== e);
        He(f, b.memoizedState) || (dh = true);
        b.memoizedState = f;
        null === b.baseQueue && (b.baseState = f);
        c.lastRenderedState = f;
      }
      return [f, d];
    }
    function Yh() {
    }
    function Zh(a, b) {
      var c = M, d = Uh(), e = b(), f = !He(d.memoizedState, e);
      f && (d.memoizedState = e, dh = true);
      d = d.queue;
      $h(ai.bind(null, c, d, a), [a]);
      if (d.getSnapshot !== b || f || null !== O && O.memoizedState.tag & 1) {
        c.flags |= 2048;
        bi(9, ci.bind(null, c, d, e, b), void 0, null);
        if (null === Q) throw Error(p(349));
        0 !== (Hh & 30) || di(c, b, e);
      }
      return e;
    }
    function di(a, b, c) {
      a.flags |= 16384;
      a = { getSnapshot: b, value: c };
      b = M.updateQueue;
      null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
    }
    function ci(a, b, c, d) {
      b.value = c;
      b.getSnapshot = d;
      ei(b) && fi(a);
    }
    function ai(a, b, c) {
      return c(function() {
        ei(b) && fi(a);
      });
    }
    function ei(a) {
      var b = a.getSnapshot;
      a = a.value;
      try {
        var c = b();
        return !He(a, c);
      } catch (d) {
        return true;
      }
    }
    function fi(a) {
      var b = ih(a, 1);
      null !== b && gi(b, a, 1, -1);
    }
    function hi(a) {
      var b = Th();
      "function" === typeof a && (a = a());
      b.memoizedState = b.baseState = a;
      a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
      b.queue = a;
      a = a.dispatch = ii.bind(null, M, a);
      return [b.memoizedState, a];
    }
    function bi(a, b, c, d) {
      a = { tag: a, create: b, destroy: c, deps: d, next: null };
      b = M.updateQueue;
      null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
      return a;
    }
    function ji() {
      return Uh().memoizedState;
    }
    function ki(a, b, c, d) {
      var e = Th();
      M.flags |= a;
      e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
    }
    function li(a, b, c, d) {
      var e = Uh();
      d = void 0 === d ? null : d;
      var f = void 0;
      if (null !== N) {
        var g = N.memoizedState;
        f = g.destroy;
        if (null !== d && Mh(d, g.deps)) {
          e.memoizedState = bi(b, c, f, d);
          return;
        }
      }
      M.flags |= a;
      e.memoizedState = bi(1 | b, c, f, d);
    }
    function mi(a, b) {
      return ki(8390656, 8, a, b);
    }
    function $h(a, b) {
      return li(2048, 8, a, b);
    }
    function ni(a, b) {
      return li(4, 2, a, b);
    }
    function oi(a, b) {
      return li(4, 4, a, b);
    }
    function pi(a, b) {
      if ("function" === typeof b) return a = a(), b(a), function() {
        b(null);
      };
      if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
        b.current = null;
      };
    }
    function qi(a, b, c) {
      c = null !== c && void 0 !== c ? c.concat([a]) : null;
      return li(4, 4, pi.bind(null, b, a), c);
    }
    function ri() {
    }
    function si(a, b) {
      var c = Uh();
      b = void 0 === b ? null : b;
      var d = c.memoizedState;
      if (null !== d && null !== b && Mh(b, d[1])) return d[0];
      c.memoizedState = [a, b];
      return a;
    }
    function ti(a, b) {
      var c = Uh();
      b = void 0 === b ? null : b;
      var d = c.memoizedState;
      if (null !== d && null !== b && Mh(b, d[1])) return d[0];
      a = a();
      c.memoizedState = [a, b];
      return a;
    }
    function ui(a, b, c) {
      if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
      He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
      return b;
    }
    function vi(a, b) {
      var c = C;
      C = 0 !== c && 4 > c ? c : 4;
      a(true);
      var d = Gh.transition;
      Gh.transition = {};
      try {
        a(false), b();
      } finally {
        C = c, Gh.transition = d;
      }
    }
    function wi() {
      return Uh().memoizedState;
    }
    function xi(a, b, c) {
      var d = yi(a);
      c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
      if (zi(a)) Ai(b, c);
      else if (c = hh(a, b, c, d), null !== c) {
        var e = R();
        gi(c, a, d, e);
        Bi(c, b, d);
      }
    }
    function ii(a, b, c) {
      var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
      if (zi(a)) Ai(b, e);
      else {
        var f = a.alternate;
        if (0 === a.lanes && (null === f || 0 === f.lanes) && (f = b.lastRenderedReducer, null !== f)) try {
          var g = b.lastRenderedState, h = f(g, c);
          e.hasEagerState = true;
          e.eagerState = h;
          if (He(h, g)) {
            var k = b.interleaved;
            null === k ? (e.next = e, gh(b)) : (e.next = k.next, k.next = e);
            b.interleaved = e;
            return;
          }
        } catch (l) {
        } finally {
        }
        c = hh(a, b, e, d);
        null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
      }
    }
    function zi(a) {
      var b = a.alternate;
      return a === M || null !== b && b === M;
    }
    function Ai(a, b) {
      Jh = Ih = true;
      var c = a.pending;
      null === c ? b.next = b : (b.next = c.next, c.next = b);
      a.pending = b;
    }
    function Bi(a, b, c) {
      if (0 !== (c & 4194240)) {
        var d = b.lanes;
        d &= a.pendingLanes;
        c |= d;
        b.lanes = c;
        Cc(a, c);
      }
    }
    var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false };
    var Oh = { readContext: eh, useCallback: function(a, b) {
      Th().memoizedState = [a, void 0 === b ? null : b];
      return a;
    }, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
      c = null !== c && void 0 !== c ? c.concat([a]) : null;
      return ki(
        4194308,
        4,
        pi.bind(null, b, a),
        c
      );
    }, useLayoutEffect: function(a, b) {
      return ki(4194308, 4, a, b);
    }, useInsertionEffect: function(a, b) {
      return ki(4, 2, a, b);
    }, useMemo: function(a, b) {
      var c = Th();
      b = void 0 === b ? null : b;
      a = a();
      c.memoizedState = [a, b];
      return a;
    }, useReducer: function(a, b, c) {
      var d = Th();
      b = void 0 !== c ? c(b) : b;
      d.memoizedState = d.baseState = b;
      a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
      d.queue = a;
      a = a.dispatch = xi.bind(null, M, a);
      return [d.memoizedState, a];
    }, useRef: function(a) {
      var b = Th();
      a = { current: a };
      return b.memoizedState = a;
    }, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
      return Th().memoizedState = a;
    }, useTransition: function() {
      var a = hi(false), b = a[0];
      a = vi.bind(null, a[1]);
      Th().memoizedState = a;
      return [b, a];
    }, useMutableSource: function() {
    }, useSyncExternalStore: function(a, b, c) {
      var d = M, e = Th();
      if (I) {
        if (void 0 === c) throw Error(p(407));
        c = c();
      } else {
        c = b();
        if (null === Q) throw Error(p(349));
        0 !== (Hh & 30) || di(d, b, c);
      }
      e.memoizedState = c;
      var f = { value: c, getSnapshot: b };
      e.queue = f;
      mi(ai.bind(
        null,
        d,
        f,
        a
      ), [a]);
      d.flags |= 2048;
      bi(9, ci.bind(null, d, f, c, b), void 0, null);
      return c;
    }, useId: function() {
      var a = Th(), b = Q.identifierPrefix;
      if (I) {
        var c = sg;
        var d = rg;
        c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
        b = ":" + b + "R" + c;
        c = Kh++;
        0 < c && (b += "H" + c.toString(32));
        b += ":";
      } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
      return a.memoizedState = b;
    }, unstable_isNewReconciler: false };
    var Ph = {
      readContext: eh,
      useCallback: si,
      useContext: eh,
      useEffect: $h,
      useImperativeHandle: qi,
      useInsertionEffect: ni,
      useLayoutEffect: oi,
      useMemo: ti,
      useReducer: Wh,
      useRef: ji,
      useState: function() {
        return Wh(Vh);
      },
      useDebugValue: ri,
      useDeferredValue: function(a) {
        var b = Uh();
        return ui(b, N.memoizedState, a);
      },
      useTransition: function() {
        var a = Wh(Vh)[0], b = Uh().memoizedState;
        return [a, b];
      },
      useMutableSource: Yh,
      useSyncExternalStore: Zh,
      useId: wi,
      unstable_isNewReconciler: false
    };
    var Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
      return Xh(Vh);
    }, useDebugValue: ri, useDeferredValue: function(a) {
      var b = Uh();
      return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
    }, useTransition: function() {
      var a = Xh(Vh)[0], b = Uh().memoizedState;
      return [a, b];
    }, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
    function Ci(a, b) {
      if (a && a.defaultProps) {
        b = A({}, b);
        a = a.defaultProps;
        for (var c in a) void 0 === b[c] && (b[c] = a[c]);
        return b;
      }
      return b;
    }
    function Di(a, b, c, d) {
      b = a.memoizedState;
      c = c(d, b);
      c = null === c || void 0 === c ? b : A({}, b, c);
      a.memoizedState = c;
      0 === a.lanes && (a.updateQueue.baseState = c);
    }
    var Ei = { isMounted: function(a) {
      return (a = a._reactInternals) ? Vb(a) === a : false;
    }, enqueueSetState: function(a, b, c) {
      a = a._reactInternals;
      var d = R(), e = yi(a), f = mh(d, e);
      f.payload = b;
      void 0 !== c && null !== c && (f.callback = c);
      b = nh(a, f, e);
      null !== b && (gi(b, a, e, d), oh(b, a, e));
    }, enqueueReplaceState: function(a, b, c) {
      a = a._reactInternals;
      var d = R(), e = yi(a), f = mh(d, e);
      f.tag = 1;
      f.payload = b;
      void 0 !== c && null !== c && (f.callback = c);
      b = nh(a, f, e);
      null !== b && (gi(b, a, e, d), oh(b, a, e));
    }, enqueueForceUpdate: function(a, b) {
      a = a._reactInternals;
      var c = R(), d = yi(a), e = mh(c, d);
      e.tag = 2;
      void 0 !== b && null !== b && (e.callback = b);
      b = nh(a, e, d);
      null !== b && (gi(b, a, d, c), oh(b, a, d));
    } };
    function Fi(a, b, c, d, e, f, g) {
      a = a.stateNode;
      return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f) : true;
    }
    function Gi(a, b, c) {
      var d = false, e = Vf;
      var f = b.contextType;
      "object" === typeof f && null !== f ? f = eh(f) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
      b = new b(c, f);
      a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
      b.updater = Ei;
      a.stateNode = b;
      b._reactInternals = a;
      d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f);
      return b;
    }
    function Hi(a, b, c, d) {
      a = b.state;
      "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
      "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
      b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
    }
    function Ii(a, b, c, d) {
      var e = a.stateNode;
      e.props = c;
      e.state = a.memoizedState;
      e.refs = {};
      kh(a);
      var f = b.contextType;
      "object" === typeof f && null !== f ? e.context = eh(f) : (f = Zf(b) ? Xf : H.current, e.context = Yf(a, f));
      e.state = a.memoizedState;
      f = b.getDerivedStateFromProps;
      "function" === typeof f && (Di(a, b, f, c), e.state = a.memoizedState);
      "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
      "function" === typeof e.componentDidMount && (a.flags |= 4194308);
    }
    function Ji(a, b) {
      try {
        var c = "", d = b;
        do
          c += Pa(d), d = d.return;
        while (d);
        var e = c;
      } catch (f) {
        e = "\nError generating stack: " + f.message + "\n" + f.stack;
      }
      return { value: a, source: b, stack: e, digest: null };
    }
    function Ki(a, b, c) {
      return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
    }
    function Li(a, b) {
      try {
        console.error(b.value);
      } catch (c) {
        setTimeout(function() {
          throw c;
        });
      }
    }
    var Mi = "function" === typeof WeakMap ? WeakMap : Map;
    function Ni(a, b, c) {
      c = mh(-1, c);
      c.tag = 3;
      c.payload = { element: null };
      var d = b.value;
      c.callback = function() {
        Oi || (Oi = true, Pi = d);
        Li(a, b);
      };
      return c;
    }
    function Qi(a, b, c) {
      c = mh(-1, c);
      c.tag = 3;
      var d = a.type.getDerivedStateFromError;
      if ("function" === typeof d) {
        var e = b.value;
        c.payload = function() {
          return d(e);
        };
        c.callback = function() {
          Li(a, b);
        };
      }
      var f = a.stateNode;
      null !== f && "function" === typeof f.componentDidCatch && (c.callback = function() {
        Li(a, b);
        "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
        var c2 = b.stack;
        this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
      });
      return c;
    }
    function Si(a, b, c) {
      var d = a.pingCache;
      if (null === d) {
        d = a.pingCache = new Mi();
        var e = /* @__PURE__ */ new Set();
        d.set(b, e);
      } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
      e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
    }
    function Ui(a) {
      do {
        var b;
        if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
        if (b) return a;
        a = a.return;
      } while (null !== a);
      return null;
    }
    function Vi(a, b, c, d, e) {
      if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
      a.flags |= 65536;
      a.lanes = e;
      return a;
    }
    var Wi = ua.ReactCurrentOwner;
    var dh = false;
    function Xi(a, b, c, d) {
      b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
    }
    function Yi(a, b, c, d, e) {
      c = c.render;
      var f = b.ref;
      ch(b, e);
      d = Nh(a, b, c, d, f, e);
      c = Sh();
      if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
      I && c && vg(b);
      b.flags |= 1;
      Xi(a, b, d, e);
      return b.child;
    }
    function $i(a, b, c, d, e) {
      if (null === a) {
        var f = c.type;
        if ("function" === typeof f && !aj(f) && void 0 === f.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f, bj(a, b, f, d, e);
        a = Rg(c.type, null, d, b, b.mode, e);
        a.ref = b.ref;
        a.return = b;
        return b.child = a;
      }
      f = a.child;
      if (0 === (a.lanes & e)) {
        var g = f.memoizedProps;
        c = c.compare;
        c = null !== c ? c : Ie;
        if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
      }
      b.flags |= 1;
      a = Pg(f, d);
      a.ref = b.ref;
      a.return = b;
      return b.child = a;
    }
    function bj(a, b, c, d, e) {
      if (null !== a) {
        var f = a.memoizedProps;
        if (Ie(f, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
        else return b.lanes = a.lanes, Zi(a, b, e);
      }
      return cj(a, b, c, d, e);
    }
    function dj(a, b, c) {
      var d = b.pendingProps, e = d.children, f = null !== a ? a.memoizedState : null;
      if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
      else {
        if (0 === (c & 1073741824)) return a = null !== f ? f.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
        b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
        d = null !== f ? f.baseLanes : c;
        G(ej, fj);
        fj |= d;
      }
      else null !== f ? (d = f.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
      Xi(a, b, e, c);
      return b.child;
    }
    function gj(a, b) {
      var c = b.ref;
      if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
    }
    function cj(a, b, c, d, e) {
      var f = Zf(c) ? Xf : H.current;
      f = Yf(b, f);
      ch(b, e);
      c = Nh(a, b, c, d, f, e);
      d = Sh();
      if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
      I && d && vg(b);
      b.flags |= 1;
      Xi(a, b, c, e);
      return b.child;
    }
    function hj(a, b, c, d, e) {
      if (Zf(c)) {
        var f = true;
        cg(b);
      } else f = false;
      ch(b, e);
      if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
      else if (null === a) {
        var g = b.stateNode, h = b.memoizedProps;
        g.props = h;
        var k = g.context, l = c.contextType;
        "object" === typeof l && null !== l ? l = eh(l) : (l = Zf(c) ? Xf : H.current, l = Yf(b, l));
        var m = c.getDerivedStateFromProps, q = "function" === typeof m || "function" === typeof g.getSnapshotBeforeUpdate;
        q || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k !== l) && Hi(b, g, d, l);
        jh = false;
        var r = b.memoizedState;
        g.state = r;
        qh(b, d, g, e);
        k = b.memoizedState;
        h !== d || r !== k || Wf.current || jh ? ("function" === typeof m && (Di(b, c, m, d), k = b.memoizedState), (h = jh || Fi(b, c, h, d, r, k, l)) ? (q || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k), g.props = d, g.state = k, g.context = l, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
      } else {
        g = b.stateNode;
        lh(a, b);
        h = b.memoizedProps;
        l = b.type === b.elementType ? h : Ci(b.type, h);
        g.props = l;
        q = b.pendingProps;
        r = g.context;
        k = c.contextType;
        "object" === typeof k && null !== k ? k = eh(k) : (k = Zf(c) ? Xf : H.current, k = Yf(b, k));
        var y = c.getDerivedStateFromProps;
        (m = "function" === typeof y || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q || r !== k) && Hi(b, g, d, k);
        jh = false;
        r = b.memoizedState;
        g.state = r;
        qh(b, d, g, e);
        var n = b.memoizedState;
        h !== q || r !== n || Wf.current || jh ? ("function" === typeof y && (Di(b, c, y, d), n = b.memoizedState), (l = jh || Fi(b, c, l, d, r, n, k) || false) ? (m || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n, k), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n, k)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n), g.props = d, g.state = n, g.context = k, d = l) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), d = false);
      }
      return jj(a, b, c, d, f, e);
    }
    function jj(a, b, c, d, e, f) {
      gj(a, b);
      var g = 0 !== (b.flags & 128);
      if (!d && !g) return e && dg(b, c, false), Zi(a, b, f);
      d = b.stateNode;
      Wi.current = b;
      var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
      b.flags |= 1;
      null !== a && g ? (b.child = Ug(b, a.child, null, f), b.child = Ug(b, null, h, f)) : Xi(a, b, h, f);
      b.memoizedState = d.state;
      e && dg(b, c, true);
      return b.child;
    }
    function kj(a) {
      var b = a.stateNode;
      b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
      yh(a, b.containerInfo);
    }
    function lj(a, b, c, d, e) {
      Ig();
      Jg(e);
      b.flags |= 256;
      Xi(a, b, c, d);
      return b.child;
    }
    var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
    function nj(a) {
      return { baseLanes: a, cachePool: null, transitions: null };
    }
    function oj(a, b, c) {
      var d = b.pendingProps, e = L.current, f = false, g = 0 !== (b.flags & 128), h;
      (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
      if (h) f = true, b.flags &= -129;
      else if (null === a || null !== a.memoizedState) e |= 1;
      G(L, e & 1);
      if (null === a) {
        Eg(b);
        a = b.memoizedState;
        if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
        g = d.children;
        a = d.fallback;
        return f ? (d = b.mode, f = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f ? (f.childLanes = 0, f.pendingProps = g) : f = pj(g, d, 0, null), a = Tg(a, d, c, null), f.return = b, a.return = b, f.sibling = a, b.child = f, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
      }
      e = a.memoizedState;
      if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
      if (f) {
        f = d.fallback;
        g = b.mode;
        e = a.child;
        h = e.sibling;
        var k = { mode: "hidden", children: d.children };
        0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k, b.deletions = null) : (d = Pg(e, k), d.subtreeFlags = e.subtreeFlags & 14680064);
        null !== h ? f = Pg(h, f) : (f = Tg(f, g, c, null), f.flags |= 2);
        f.return = b;
        d.return = b;
        d.sibling = f;
        b.child = d;
        d = f;
        f = b.child;
        g = a.child.memoizedState;
        g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
        f.memoizedState = g;
        f.childLanes = a.childLanes & ~c;
        b.memoizedState = mj;
        return d;
      }
      f = a.child;
      a = f.sibling;
      d = Pg(f, { mode: "visible", children: d.children });
      0 === (b.mode & 1) && (d.lanes = c);
      d.return = b;
      d.sibling = null;
      null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
      b.child = d;
      b.memoizedState = null;
      return d;
    }
    function qj(a, b) {
      b = pj({ mode: "visible", children: b }, a.mode, 0, null);
      b.return = a;
      return a.child = b;
    }
    function sj(a, b, c, d) {
      null !== d && Jg(d);
      Ug(b, a.child, null, c);
      a = qj(b, b.pendingProps.children);
      a.flags |= 2;
      b.memoizedState = null;
      return a;
    }
    function rj(a, b, c, d, e, f, g) {
      if (c) {
        if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
        if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
        f = d.fallback;
        e = b.mode;
        d = pj({ mode: "visible", children: d.children }, e, 0, null);
        f = Tg(f, e, g, null);
        f.flags |= 2;
        d.return = b;
        f.return = b;
        d.sibling = f;
        b.child = d;
        0 !== (b.mode & 1) && Ug(b, a.child, null, g);
        b.child.memoizedState = nj(g);
        b.memoizedState = mj;
        return f;
      }
      if (0 === (b.mode & 1)) return sj(a, b, g, null);
      if ("$!" === e.data) {
        d = e.nextSibling && e.nextSibling.dataset;
        if (d) var h = d.dgst;
        d = h;
        f = Error(p(419));
        d = Ki(f, d, void 0);
        return sj(a, b, g, d);
      }
      h = 0 !== (g & a.childLanes);
      if (dh || h) {
        d = Q;
        if (null !== d) {
          switch (g & -g) {
            case 4:
              e = 2;
              break;
            case 16:
              e = 8;
              break;
            case 64:
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152:
            case 4194304:
            case 8388608:
            case 16777216:
            case 33554432:
            case 67108864:
              e = 32;
              break;
            case 536870912:
              e = 268435456;
              break;
            default:
              e = 0;
          }
          e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
          0 !== e && e !== f.retryLane && (f.retryLane = e, ih(a, e), gi(d, a, e, -1));
        }
        tj();
        d = Ki(Error(p(421)));
        return sj(a, b, g, d);
      }
      if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
      a = f.treeContext;
      yg = Lf(e.nextSibling);
      xg = b;
      I = true;
      zg = null;
      null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
      b = qj(b, d.children);
      b.flags |= 4096;
      return b;
    }
    function vj(a, b, c) {
      a.lanes |= b;
      var d = a.alternate;
      null !== d && (d.lanes |= b);
      bh(a.return, b, c);
    }
    function wj(a, b, c, d, e) {
      var f = a.memoizedState;
      null === f ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f.isBackwards = b, f.rendering = null, f.renderingStartTime = 0, f.last = d, f.tail = c, f.tailMode = e);
    }
    function xj(a, b, c) {
      var d = b.pendingProps, e = d.revealOrder, f = d.tail;
      Xi(a, b, d.children, c);
      d = L.current;
      if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
      else {
        if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
          if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
          else if (19 === a.tag) vj(a, c, b);
          else if (null !== a.child) {
            a.child.return = a;
            a = a.child;
            continue;
          }
          if (a === b) break a;
          for (; null === a.sibling; ) {
            if (null === a.return || a.return === b) break a;
            a = a.return;
          }
          a.sibling.return = a.return;
          a = a.sibling;
        }
        d &= 1;
      }
      G(L, d);
      if (0 === (b.mode & 1)) b.memoizedState = null;
      else switch (e) {
        case "forwards":
          c = b.child;
          for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
          c = e;
          null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
          wj(b, false, e, c, f);
          break;
        case "backwards":
          c = null;
          e = b.child;
          for (b.child = null; null !== e; ) {
            a = e.alternate;
            if (null !== a && null === Ch(a)) {
              b.child = e;
              break;
            }
            a = e.sibling;
            e.sibling = c;
            c = e;
            e = a;
          }
          wj(b, true, c, null, f);
          break;
        case "together":
          wj(b, false, null, null, void 0);
          break;
        default:
          b.memoizedState = null;
      }
      return b.child;
    }
    function ij(a, b) {
      0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
    }
    function Zi(a, b, c) {
      null !== a && (b.dependencies = a.dependencies);
      rh |= b.lanes;
      if (0 === (c & b.childLanes)) return null;
      if (null !== a && b.child !== a.child) throw Error(p(153));
      if (null !== b.child) {
        a = b.child;
        c = Pg(a, a.pendingProps);
        b.child = c;
        for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
        c.sibling = null;
      }
      return b.child;
    }
    function yj(a, b, c) {
      switch (b.tag) {
        case 3:
          kj(b);
          Ig();
          break;
        case 5:
          Ah(b);
          break;
        case 1:
          Zf(b.type) && cg(b);
          break;
        case 4:
          yh(b, b.stateNode.containerInfo);
          break;
        case 10:
          var d = b.type._context, e = b.memoizedProps.value;
          G(Wg, d._currentValue);
          d._currentValue = e;
          break;
        case 13:
          d = b.memoizedState;
          if (null !== d) {
            if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
            if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
            G(L, L.current & 1);
            a = Zi(a, b, c);
            return null !== a ? a.sibling : null;
          }
          G(L, L.current & 1);
          break;
        case 19:
          d = 0 !== (c & b.childLanes);
          if (0 !== (a.flags & 128)) {
            if (d) return xj(a, b, c);
            b.flags |= 128;
          }
          e = b.memoizedState;
          null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
          G(L, L.current);
          if (d) break;
          else return null;
        case 22:
        case 23:
          return b.lanes = 0, dj(a, b, c);
      }
      return Zi(a, b, c);
    }
    var zj;
    var Aj;
    var Bj;
    var Cj;
    zj = function(a, b) {
      for (var c = b.child; null !== c; ) {
        if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
        else if (4 !== c.tag && null !== c.child) {
          c.child.return = c;
          c = c.child;
          continue;
        }
        if (c === b) break;
        for (; null === c.sibling; ) {
          if (null === c.return || c.return === b) return;
          c = c.return;
        }
        c.sibling.return = c.return;
        c = c.sibling;
      }
    };
    Aj = function() {
    };
    Bj = function(a, b, c, d) {
      var e = a.memoizedProps;
      if (e !== d) {
        a = b.stateNode;
        xh(uh.current);
        var f = null;
        switch (c) {
          case "input":
            e = Ya(a, e);
            d = Ya(a, d);
            f = [];
            break;
          case "select":
            e = A({}, e, { value: void 0 });
            d = A({}, d, { value: void 0 });
            f = [];
            break;
          case "textarea":
            e = gb(a, e);
            d = gb(a, d);
            f = [];
            break;
          default:
            "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
        }
        ub(c, d);
        var g;
        c = null;
        for (l in e) if (!d.hasOwnProperty(l) && e.hasOwnProperty(l) && null != e[l]) if ("style" === l) {
          var h = e[l];
          for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
        } else "dangerouslySetInnerHTML" !== l && "children" !== l && "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && "autoFocus" !== l && (ea.hasOwnProperty(l) ? f || (f = []) : (f = f || []).push(l, null));
        for (l in d) {
          var k = d[l];
          h = null != e ? e[l] : void 0;
          if (d.hasOwnProperty(l) && k !== h && (null != k || null != h)) if ("style" === l) if (h) {
            for (g in h) !h.hasOwnProperty(g) || k && k.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
            for (g in k) k.hasOwnProperty(g) && h[g] !== k[g] && (c || (c = {}), c[g] = k[g]);
          } else c || (f || (f = []), f.push(
            l,
            c
          )), c = k;
          else "dangerouslySetInnerHTML" === l ? (k = k ? k.__html : void 0, h = h ? h.__html : void 0, null != k && h !== k && (f = f || []).push(l, k)) : "children" === l ? "string" !== typeof k && "number" !== typeof k || (f = f || []).push(l, "" + k) : "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && (ea.hasOwnProperty(l) ? (null != k && "onScroll" === l && D("scroll", a), f || h === k || (f = [])) : (f = f || []).push(l, k));
        }
        c && (f = f || []).push("style", c);
        var l = f;
        if (b.updateQueue = l) b.flags |= 4;
      }
    };
    Cj = function(a, b, c, d) {
      c !== d && (b.flags |= 4);
    };
    function Dj(a, b) {
      if (!I) switch (a.tailMode) {
        case "hidden":
          b = a.tail;
          for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
          null === c ? a.tail = null : c.sibling = null;
          break;
        case "collapsed":
          c = a.tail;
          for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
          null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
      }
    }
    function S(a) {
      var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
      if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
      else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
      a.subtreeFlags |= d;
      a.childLanes = c;
      return b;
    }
    function Ej(a, b, c) {
      var d = b.pendingProps;
      wg(b);
      switch (b.tag) {
        case 2:
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return S(b), null;
        case 1:
          return Zf(b.type) && $f(), S(b), null;
        case 3:
          d = b.stateNode;
          zh();
          E(Wf);
          E(H);
          Eh();
          d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
          if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
          Aj(a, b);
          S(b);
          return null;
        case 5:
          Bh(b);
          var e = xh(wh.current);
          c = b.type;
          if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
          else {
            if (!d) {
              if (null === b.stateNode) throw Error(p(166));
              S(b);
              return null;
            }
            a = xh(uh.current);
            if (Gg(b)) {
              d = b.stateNode;
              c = b.type;
              var f = b.memoizedProps;
              d[Of] = b;
              d[Pf] = f;
              a = 0 !== (b.mode & 1);
              switch (c) {
                case "dialog":
                  D("cancel", d);
                  D("close", d);
                  break;
                case "iframe":
                case "object":
                case "embed":
                  D("load", d);
                  break;
                case "video":
                case "audio":
                  for (e = 0; e < lf.length; e++) D(lf[e], d);
                  break;
                case "source":
                  D("error", d);
                  break;
                case "img":
                case "image":
                case "link":
                  D(
                    "error",
                    d
                  );
                  D("load", d);
                  break;
                case "details":
                  D("toggle", d);
                  break;
                case "input":
                  Za(d, f);
                  D("invalid", d);
                  break;
                case "select":
                  d._wrapperState = { wasMultiple: !!f.multiple };
                  D("invalid", d);
                  break;
                case "textarea":
                  hb(d, f), D("invalid", d);
              }
              ub(c, f);
              e = null;
              for (var g in f) if (f.hasOwnProperty(g)) {
                var h = f[g];
                "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f.suppressHydrationWarning && Af(
                  d.textContent,
                  h,
                  a
                ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
              }
              switch (c) {
                case "input":
                  Va(d);
                  db(d, f, true);
                  break;
                case "textarea":
                  Va(d);
                  jb(d);
                  break;
                case "select":
                case "option":
                  break;
                default:
                  "function" === typeof f.onClick && (d.onclick = Bf);
              }
              d = e;
              b.updateQueue = d;
              null !== d && (b.flags |= 4);
            } else {
              g = 9 === e.nodeType ? e : e.ownerDocument;
              "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
              "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
              a[Of] = b;
              a[Pf] = d;
              zj(a, b, false, false);
              b.stateNode = a;
              a: {
                g = vb(c, d);
                switch (c) {
                  case "dialog":
                    D("cancel", a);
                    D("close", a);
                    e = d;
                    break;
                  case "iframe":
                  case "object":
                  case "embed":
                    D("load", a);
                    e = d;
                    break;
                  case "video":
                  case "audio":
                    for (e = 0; e < lf.length; e++) D(lf[e], a);
                    e = d;
                    break;
                  case "source":
                    D("error", a);
                    e = d;
                    break;
                  case "img":
                  case "image":
                  case "link":
                    D(
                      "error",
                      a
                    );
                    D("load", a);
                    e = d;
                    break;
                  case "details":
                    D("toggle", a);
                    e = d;
                    break;
                  case "input":
                    Za(a, d);
                    e = Ya(a, d);
                    D("invalid", a);
                    break;
                  case "option":
                    e = d;
                    break;
                  case "select":
                    a._wrapperState = { wasMultiple: !!d.multiple };
                    e = A({}, d, { value: void 0 });
                    D("invalid", a);
                    break;
                  case "textarea":
                    hb(a, d);
                    e = gb(a, d);
                    D("invalid", a);
                    break;
                  default:
                    e = d;
                }
                ub(c, e);
                h = e;
                for (f in h) if (h.hasOwnProperty(f)) {
                  var k = h[f];
                  "style" === f ? sb(a, k) : "dangerouslySetInnerHTML" === f ? (k = k ? k.__html : void 0, null != k && nb(a, k)) : "children" === f ? "string" === typeof k ? ("textarea" !== c || "" !== k) && ob(a, k) : "number" === typeof k && ob(a, "" + k) : "suppressContentEditableWarning" !== f && "suppressHydrationWarning" !== f && "autoFocus" !== f && (ea.hasOwnProperty(f) ? null != k && "onScroll" === f && D("scroll", a) : null != k && ta(a, f, k, g));
                }
                switch (c) {
                  case "input":
                    Va(a);
                    db(a, d, false);
                    break;
                  case "textarea":
                    Va(a);
                    jb(a);
                    break;
                  case "option":
                    null != d.value && a.setAttribute("value", "" + Sa(d.value));
                    break;
                  case "select":
                    a.multiple = !!d.multiple;
                    f = d.value;
                    null != f ? fb(a, !!d.multiple, f, false) : null != d.defaultValue && fb(
                      a,
                      !!d.multiple,
                      d.defaultValue,
                      true
                    );
                    break;
                  default:
                    "function" === typeof e.onClick && (a.onclick = Bf);
                }
                switch (c) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    d = !!d.autoFocus;
                    break a;
                  case "img":
                    d = true;
                    break a;
                  default:
                    d = false;
                }
              }
              d && (b.flags |= 4);
            }
            null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
          }
          S(b);
          return null;
        case 6:
          if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
          else {
            if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
            c = xh(wh.current);
            xh(uh.current);
            if (Gg(b)) {
              d = b.stateNode;
              c = b.memoizedProps;
              d[Of] = b;
              if (f = d.nodeValue !== c) {
                if (a = xg, null !== a) switch (a.tag) {
                  case 3:
                    Af(d.nodeValue, c, 0 !== (a.mode & 1));
                    break;
                  case 5:
                    true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
                }
              }
              f && (b.flags |= 4);
            } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
          }
          S(b);
          return null;
        case 13:
          E(L);
          d = b.memoizedState;
          if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
            if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f = false;
            else if (f = Gg(b), null !== d && null !== d.dehydrated) {
              if (null === a) {
                if (!f) throw Error(p(318));
                f = b.memoizedState;
                f = null !== f ? f.dehydrated : null;
                if (!f) throw Error(p(317));
                f[Of] = b;
              } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
              S(b);
              f = false;
            } else null !== zg && (Fj(zg), zg = null), f = true;
            if (!f) return b.flags & 65536 ? b : null;
          }
          if (0 !== (b.flags & 128)) return b.lanes = c, b;
          d = null !== d;
          d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
          null !== b.updateQueue && (b.flags |= 4);
          S(b);
          return null;
        case 4:
          return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
        case 10:
          return ah(b.type._context), S(b), null;
        case 17:
          return Zf(b.type) && $f(), S(b), null;
        case 19:
          E(L);
          f = b.memoizedState;
          if (null === f) return S(b), null;
          d = 0 !== (b.flags & 128);
          g = f.rendering;
          if (null === g) if (d) Dj(f, false);
          else {
            if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
              g = Ch(a);
              if (null !== g) {
                b.flags |= 128;
                Dj(f, false);
                d = g.updateQueue;
                null !== d && (b.updateQueue = d, b.flags |= 4);
                b.subtreeFlags = 0;
                d = c;
                for (c = b.child; null !== c; ) f = c, a = d, f.flags &= 14680066, g = f.alternate, null === g ? (f.childLanes = 0, f.lanes = a, f.child = null, f.subtreeFlags = 0, f.memoizedProps = null, f.memoizedState = null, f.updateQueue = null, f.dependencies = null, f.stateNode = null) : (f.childLanes = g.childLanes, f.lanes = g.lanes, f.child = g.child, f.subtreeFlags = 0, f.deletions = null, f.memoizedProps = g.memoizedProps, f.memoizedState = g.memoizedState, f.updateQueue = g.updateQueue, f.type = g.type, a = g.dependencies, f.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
                G(L, L.current & 1 | 2);
                return b.child;
              }
              a = a.sibling;
            }
            null !== f.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f, false), b.lanes = 4194304);
          }
          else {
            if (!d) if (a = Ch(g), null !== a) {
              if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f, true), null === f.tail && "hidden" === f.tailMode && !g.alternate && !I) return S(b), null;
            } else 2 * B() - f.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f, false), b.lanes = 4194304);
            f.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f.last, null !== c ? c.sibling = g : b.child = g, f.last = g);
          }
          if (null !== f.tail) return b = f.tail, f.rendering = b, f.tail = b.sibling, f.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
          S(b);
          return null;
        case 22:
        case 23:
          return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
        case 24:
          return null;
        case 25:
          return null;
      }
      throw Error(p(156, b.tag));
    }
    function Ij(a, b) {
      wg(b);
      switch (b.tag) {
        case 1:
          return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
        case 3:
          return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
        case 5:
          return Bh(b), null;
        case 13:
          E(L);
          a = b.memoizedState;
          if (null !== a && null !== a.dehydrated) {
            if (null === b.alternate) throw Error(p(340));
            Ig();
          }
          a = b.flags;
          return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
        case 19:
          return E(L), null;
        case 4:
          return zh(), null;
        case 10:
          return ah(b.type._context), null;
        case 22:
        case 23:
          return Hj(), null;
        case 24:
          return null;
        default:
          return null;
      }
    }
    var Jj = false;
    var U = false;
    var Kj = "function" === typeof WeakSet ? WeakSet : Set;
    var V = null;
    function Lj(a, b) {
      var c = a.ref;
      if (null !== c) if ("function" === typeof c) try {
        c(null);
      } catch (d) {
        W(a, b, d);
      }
      else c.current = null;
    }
    function Mj(a, b, c) {
      try {
        c();
      } catch (d) {
        W(a, b, d);
      }
    }
    var Nj = false;
    function Oj(a, b) {
      Cf = dd;
      a = Me();
      if (Ne(a)) {
        if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
        else a: {
          c = (c = a.ownerDocument) && c.defaultView || window;
          var d = c.getSelection && c.getSelection();
          if (d && 0 !== d.rangeCount) {
            c = d.anchorNode;
            var e = d.anchorOffset, f = d.focusNode;
            d = d.focusOffset;
            try {
              c.nodeType, f.nodeType;
            } catch (F) {
              c = null;
              break a;
            }
            var g = 0, h = -1, k = -1, l = 0, m = 0, q = a, r = null;
            b: for (; ; ) {
              for (var y; ; ) {
                q !== c || 0 !== e && 3 !== q.nodeType || (h = g + e);
                q !== f || 0 !== d && 3 !== q.nodeType || (k = g + d);
                3 === q.nodeType && (g += q.nodeValue.length);
                if (null === (y = q.firstChild)) break;
                r = q;
                q = y;
              }
              for (; ; ) {
                if (q === a) break b;
                r === c && ++l === e && (h = g);
                r === f && ++m === d && (k = g);
                if (null !== (y = q.nextSibling)) break;
                q = r;
                r = q.parentNode;
              }
              q = y;
            }
            c = -1 === h || -1 === k ? null : { start: h, end: k };
          } else c = null;
        }
        c = c || { start: 0, end: 0 };
      } else c = null;
      Df = { focusedElem: a, selectionRange: c };
      dd = false;
      for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
      else for (; null !== V; ) {
        b = V;
        try {
          var n = b.alternate;
          if (0 !== (b.flags & 1024)) switch (b.tag) {
            case 0:
            case 11:
            case 15:
              break;
            case 1:
              if (null !== n) {
                var t = n.memoizedProps, J = n.memoizedState, x = b.stateNode, w = x.getSnapshotBeforeUpdate(b.elementType === b.type ? t : Ci(b.type, t), J);
                x.__reactInternalSnapshotBeforeUpdate = w;
              }
              break;
            case 3:
              var u = b.stateNode.containerInfo;
              1 === u.nodeType ? u.textContent = "" : 9 === u.nodeType && u.documentElement && u.removeChild(u.documentElement);
              break;
            case 5:
            case 6:
            case 4:
            case 17:
              break;
            default:
              throw Error(p(163));
          }
        } catch (F) {
          W(b, b.return, F);
        }
        a = b.sibling;
        if (null !== a) {
          a.return = b.return;
          V = a;
          break;
        }
        V = b.return;
      }
      n = Nj;
      Nj = false;
      return n;
    }
    function Pj(a, b, c) {
      var d = b.updateQueue;
      d = null !== d ? d.lastEffect : null;
      if (null !== d) {
        var e = d = d.next;
        do {
          if ((e.tag & a) === a) {
            var f = e.destroy;
            e.destroy = void 0;
            void 0 !== f && Mj(b, c, f);
          }
          e = e.next;
        } while (e !== d);
      }
    }
    function Qj(a, b) {
      b = b.updateQueue;
      b = null !== b ? b.lastEffect : null;
      if (null !== b) {
        var c = b = b.next;
        do {
          if ((c.tag & a) === a) {
            var d = c.create;
            c.destroy = d();
          }
          c = c.next;
        } while (c !== b);
      }
    }
    function Rj(a) {
      var b = a.ref;
      if (null !== b) {
        var c = a.stateNode;
        switch (a.tag) {
          case 5:
            a = c;
            break;
          default:
            a = c;
        }
        "function" === typeof b ? b(a) : b.current = a;
      }
    }
    function Sj(a) {
      var b = a.alternate;
      null !== b && (a.alternate = null, Sj(b));
      a.child = null;
      a.deletions = null;
      a.sibling = null;
      5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
      a.stateNode = null;
      a.return = null;
      a.dependencies = null;
      a.memoizedProps = null;
      a.memoizedState = null;
      a.pendingProps = null;
      a.stateNode = null;
      a.updateQueue = null;
    }
    function Tj(a) {
      return 5 === a.tag || 3 === a.tag || 4 === a.tag;
    }
    function Uj(a) {
      a: for (; ; ) {
        for (; null === a.sibling; ) {
          if (null === a.return || Tj(a.return)) return null;
          a = a.return;
        }
        a.sibling.return = a.return;
        for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
          if (a.flags & 2) continue a;
          if (null === a.child || 4 === a.tag) continue a;
          else a.child.return = a, a = a.child;
        }
        if (!(a.flags & 2)) return a.stateNode;
      }
    }
    function Vj(a, b, c) {
      var d = a.tag;
      if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
      else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
    }
    function Wj(a, b, c) {
      var d = a.tag;
      if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
      else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
    }
    var X = null;
    var Xj = false;
    function Yj(a, b, c) {
      for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
    }
    function Zj(a, b, c) {
      if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
        lc.onCommitFiberUnmount(kc, c);
      } catch (h) {
      }
      switch (c.tag) {
        case 5:
          U || Lj(c, b);
        case 6:
          var d = X, e = Xj;
          X = null;
          Yj(a, b, c);
          X = d;
          Xj = e;
          null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
          break;
        case 18:
          null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
          break;
        case 4:
          d = X;
          e = Xj;
          X = c.stateNode.containerInfo;
          Xj = true;
          Yj(a, b, c);
          X = d;
          Xj = e;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
            e = d = d.next;
            do {
              var f = e, g = f.destroy;
              f = f.tag;
              void 0 !== g && (0 !== (f & 2) ? Mj(c, b, g) : 0 !== (f & 4) && Mj(c, b, g));
              e = e.next;
            } while (e !== d);
          }
          Yj(a, b, c);
          break;
        case 1:
          if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
            d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
          } catch (h) {
            W(c, b, h);
          }
          Yj(a, b, c);
          break;
        case 21:
          Yj(a, b, c);
          break;
        case 22:
          c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
          break;
        default:
          Yj(a, b, c);
      }
    }
    function ak(a) {
      var b = a.updateQueue;
      if (null !== b) {
        a.updateQueue = null;
        var c = a.stateNode;
        null === c && (c = a.stateNode = new Kj());
        b.forEach(function(b2) {
          var d = bk.bind(null, a, b2);
          c.has(b2) || (c.add(b2), b2.then(d, d));
        });
      }
    }
    function ck(a, b) {
      var c = b.deletions;
      if (null !== c) for (var d = 0; d < c.length; d++) {
        var e = c[d];
        try {
          var f = a, g = b, h = g;
          a: for (; null !== h; ) {
            switch (h.tag) {
              case 5:
                X = h.stateNode;
                Xj = false;
                break a;
              case 3:
                X = h.stateNode.containerInfo;
                Xj = true;
                break a;
              case 4:
                X = h.stateNode.containerInfo;
                Xj = true;
                break a;
            }
            h = h.return;
          }
          if (null === X) throw Error(p(160));
          Zj(f, g, e);
          X = null;
          Xj = false;
          var k = e.alternate;
          null !== k && (k.return = null);
          e.return = null;
        } catch (l) {
          W(e, b, l);
        }
      }
      if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
    }
    function dk(a, b) {
      var c = a.alternate, d = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ck(b, a);
          ek(a);
          if (d & 4) {
            try {
              Pj(3, a, a.return), Qj(3, a);
            } catch (t) {
              W(a, a.return, t);
            }
            try {
              Pj(5, a, a.return);
            } catch (t) {
              W(a, a.return, t);
            }
          }
          break;
        case 1:
          ck(b, a);
          ek(a);
          d & 512 && null !== c && Lj(c, c.return);
          break;
        case 5:
          ck(b, a);
          ek(a);
          d & 512 && null !== c && Lj(c, c.return);
          if (a.flags & 32) {
            var e = a.stateNode;
            try {
              ob(e, "");
            } catch (t) {
              W(a, a.return, t);
            }
          }
          if (d & 4 && (e = a.stateNode, null != e)) {
            var f = a.memoizedProps, g = null !== c ? c.memoizedProps : f, h = a.type, k = a.updateQueue;
            a.updateQueue = null;
            if (null !== k) try {
              "input" === h && "radio" === f.type && null != f.name && ab(e, f);
              vb(h, g);
              var l = vb(h, f);
              for (g = 0; g < k.length; g += 2) {
                var m = k[g], q = k[g + 1];
                "style" === m ? sb(e, q) : "dangerouslySetInnerHTML" === m ? nb(e, q) : "children" === m ? ob(e, q) : ta(e, m, q, l);
              }
              switch (h) {
                case "input":
                  bb(e, f);
                  break;
                case "textarea":
                  ib(e, f);
                  break;
                case "select":
                  var r = e._wrapperState.wasMultiple;
                  e._wrapperState.wasMultiple = !!f.multiple;
                  var y = f.value;
                  null != y ? fb(e, !!f.multiple, y, false) : r !== !!f.multiple && (null != f.defaultValue ? fb(
                    e,
                    !!f.multiple,
                    f.defaultValue,
                    true
                  ) : fb(e, !!f.multiple, f.multiple ? [] : "", false));
              }
              e[Pf] = f;
            } catch (t) {
              W(a, a.return, t);
            }
          }
          break;
        case 6:
          ck(b, a);
          ek(a);
          if (d & 4) {
            if (null === a.stateNode) throw Error(p(162));
            e = a.stateNode;
            f = a.memoizedProps;
            try {
              e.nodeValue = f;
            } catch (t) {
              W(a, a.return, t);
            }
          }
          break;
        case 3:
          ck(b, a);
          ek(a);
          if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
            bd(b.containerInfo);
          } catch (t) {
            W(a, a.return, t);
          }
          break;
        case 4:
          ck(b, a);
          ek(a);
          break;
        case 13:
          ck(b, a);
          ek(a);
          e = a.child;
          e.flags & 8192 && (f = null !== e.memoizedState, e.stateNode.isHidden = f, !f || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
          d & 4 && ak(a);
          break;
        case 22:
          m = null !== c && null !== c.memoizedState;
          a.mode & 1 ? (U = (l = U) || m, ck(b, a), U = l) : ck(b, a);
          ek(a);
          if (d & 8192) {
            l = null !== a.memoizedState;
            if ((a.stateNode.isHidden = l) && !m && 0 !== (a.mode & 1)) for (V = a, m = a.child; null !== m; ) {
              for (q = V = m; null !== V; ) {
                r = V;
                y = r.child;
                switch (r.tag) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    Pj(4, r, r.return);
                    break;
                  case 1:
                    Lj(r, r.return);
                    var n = r.stateNode;
                    if ("function" === typeof n.componentWillUnmount) {
                      d = r;
                      c = r.return;
                      try {
                        b = d, n.props = b.memoizedProps, n.state = b.memoizedState, n.componentWillUnmount();
                      } catch (t) {
                        W(d, c, t);
                      }
                    }
                    break;
                  case 5:
                    Lj(r, r.return);
                    break;
                  case 22:
                    if (null !== r.memoizedState) {
                      gk(q);
                      continue;
                    }
                }
                null !== y ? (y.return = r, V = y) : gk(q);
              }
              m = m.sibling;
            }
            a: for (m = null, q = a; ; ) {
              if (5 === q.tag) {
                if (null === m) {
                  m = q;
                  try {
                    e = q.stateNode, l ? (f = e.style, "function" === typeof f.setProperty ? f.setProperty("display", "none", "important") : f.display = "none") : (h = q.stateNode, k = q.memoizedProps.style, g = void 0 !== k && null !== k && k.hasOwnProperty("display") ? k.display : null, h.style.display = rb("display", g));
                  } catch (t) {
                    W(a, a.return, t);
                  }
                }
              } else if (6 === q.tag) {
                if (null === m) try {
                  q.stateNode.nodeValue = l ? "" : q.memoizedProps;
                } catch (t) {
                  W(a, a.return, t);
                }
              } else if ((22 !== q.tag && 23 !== q.tag || null === q.memoizedState || q === a) && null !== q.child) {
                q.child.return = q;
                q = q.child;
                continue;
              }
              if (q === a) break a;
              for (; null === q.sibling; ) {
                if (null === q.return || q.return === a) break a;
                m === q && (m = null);
                q = q.return;
              }
              m === q && (m = null);
              q.sibling.return = q.return;
              q = q.sibling;
            }
          }
          break;
        case 19:
          ck(b, a);
          ek(a);
          d & 4 && ak(a);
          break;
        case 21:
          break;
        default:
          ck(
            b,
            a
          ), ek(a);
      }
    }
    function ek(a) {
      var b = a.flags;
      if (b & 2) {
        try {
          a: {
            for (var c = a.return; null !== c; ) {
              if (Tj(c)) {
                var d = c;
                break a;
              }
              c = c.return;
            }
            throw Error(p(160));
          }
          switch (d.tag) {
            case 5:
              var e = d.stateNode;
              d.flags & 32 && (ob(e, ""), d.flags &= -33);
              var f = Uj(a);
              Wj(a, f, e);
              break;
            case 3:
            case 4:
              var g = d.stateNode.containerInfo, h = Uj(a);
              Vj(a, h, g);
              break;
            default:
              throw Error(p(161));
          }
        } catch (k) {
          W(a, a.return, k);
        }
        a.flags &= -3;
      }
      b & 4096 && (a.flags &= -4097);
    }
    function hk(a, b, c) {
      V = a;
      ik(a, b, c);
    }
    function ik(a, b, c) {
      for (var d = 0 !== (a.mode & 1); null !== V; ) {
        var e = V, f = e.child;
        if (22 === e.tag && d) {
          var g = null !== e.memoizedState || Jj;
          if (!g) {
            var h = e.alternate, k = null !== h && null !== h.memoizedState || U;
            h = Jj;
            var l = U;
            Jj = g;
            if ((U = k) && !l) for (V = e; null !== V; ) g = V, k = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k ? (k.return = g, V = k) : jk(e);
            for (; null !== f; ) V = f, ik(f, b, c), f = f.sibling;
            V = e;
            Jj = h;
            U = l;
          }
          kk(a, b, c);
        } else 0 !== (e.subtreeFlags & 8772) && null !== f ? (f.return = e, V = f) : kk(a, b, c);
      }
    }
    function kk(a) {
      for (; null !== V; ) {
        var b = V;
        if (0 !== (b.flags & 8772)) {
          var c = b.alternate;
          try {
            if (0 !== (b.flags & 8772)) switch (b.tag) {
              case 0:
              case 11:
              case 15:
                U || Qj(5, b);
                break;
              case 1:
                var d = b.stateNode;
                if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
                else {
                  var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
                  d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
                }
                var f = b.updateQueue;
                null !== f && sh(b, f, d);
                break;
              case 3:
                var g = b.updateQueue;
                if (null !== g) {
                  c = null;
                  if (null !== b.child) switch (b.child.tag) {
                    case 5:
                      c = b.child.stateNode;
                      break;
                    case 1:
                      c = b.child.stateNode;
                  }
                  sh(b, g, c);
                }
                break;
              case 5:
                var h = b.stateNode;
                if (null === c && b.flags & 4) {
                  c = h;
                  var k = b.memoizedProps;
                  switch (b.type) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      k.autoFocus && c.focus();
                      break;
                    case "img":
                      k.src && (c.src = k.src);
                  }
                }
                break;
              case 6:
                break;
              case 4:
                break;
              case 12:
                break;
              case 13:
                if (null === b.memoizedState) {
                  var l = b.alternate;
                  if (null !== l) {
                    var m = l.memoizedState;
                    if (null !== m) {
                      var q = m.dehydrated;
                      null !== q && bd(q);
                    }
                  }
                }
                break;
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break;
              default:
                throw Error(p(163));
            }
            U || b.flags & 512 && Rj(b);
          } catch (r) {
            W(b, b.return, r);
          }
        }
        if (b === a) {
          V = null;
          break;
        }
        c = b.sibling;
        if (null !== c) {
          c.return = b.return;
          V = c;
          break;
        }
        V = b.return;
      }
    }
    function gk(a) {
      for (; null !== V; ) {
        var b = V;
        if (b === a) {
          V = null;
          break;
        }
        var c = b.sibling;
        if (null !== c) {
          c.return = b.return;
          V = c;
          break;
        }
        V = b.return;
      }
    }
    function jk(a) {
      for (; null !== V; ) {
        var b = V;
        try {
          switch (b.tag) {
            case 0:
            case 11:
            case 15:
              var c = b.return;
              try {
                Qj(4, b);
              } catch (k) {
                W(b, c, k);
              }
              break;
            case 1:
              var d = b.stateNode;
              if ("function" === typeof d.componentDidMount) {
                var e = b.return;
                try {
                  d.componentDidMount();
                } catch (k) {
                  W(b, e, k);
                }
              }
              var f = b.return;
              try {
                Rj(b);
              } catch (k) {
                W(b, f, k);
              }
              break;
            case 5:
              var g = b.return;
              try {
                Rj(b);
              } catch (k) {
                W(b, g, k);
              }
          }
        } catch (k) {
          W(b, b.return, k);
        }
        if (b === a) {
          V = null;
          break;
        }
        var h = b.sibling;
        if (null !== h) {
          h.return = b.return;
          V = h;
          break;
        }
        V = b.return;
      }
    }
    var lk = Math.ceil;
    var mk = ua.ReactCurrentDispatcher;
    var nk = ua.ReactCurrentOwner;
    var ok = ua.ReactCurrentBatchConfig;
    var K = 0;
    var Q = null;
    var Y = null;
    var Z = 0;
    var fj = 0;
    var ej = Uf(0);
    var T = 0;
    var pk = null;
    var rh = 0;
    var qk = 0;
    var rk = 0;
    var sk = null;
    var tk = null;
    var fk = 0;
    var Gj = Infinity;
    var uk = null;
    var Oi = false;
    var Pi = null;
    var Ri = null;
    var vk = false;
    var wk = null;
    var xk = 0;
    var yk = 0;
    var zk = null;
    var Ak = -1;
    var Bk = 0;
    function R() {
      return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
    }
    function yi(a) {
      if (0 === (a.mode & 1)) return 1;
      if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
      if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
      a = C;
      if (0 !== a) return a;
      a = window.event;
      a = void 0 === a ? 16 : jd(a.type);
      return a;
    }
    function gi(a, b, c, d) {
      if (50 < yk) throw yk = 0, zk = null, Error(p(185));
      Ac(a, c, d);
      if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
    }
    function Dk(a, b) {
      var c = a.callbackNode;
      wc(a, b);
      var d = uc(a, a === Q ? Z : 0);
      if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
      else if (b = d & -d, a.callbackPriority !== b) {
        null != c && bc(c);
        if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
          0 === (K & 6) && jg();
        }), c = null;
        else {
          switch (Dc(d)) {
            case 1:
              c = fc;
              break;
            case 4:
              c = gc;
              break;
            case 16:
              c = hc;
              break;
            case 536870912:
              c = jc;
              break;
            default:
              c = hc;
          }
          c = Fk(c, Gk.bind(null, a));
        }
        a.callbackPriority = b;
        a.callbackNode = c;
      }
    }
    function Gk(a, b) {
      Ak = -1;
      Bk = 0;
      if (0 !== (K & 6)) throw Error(p(327));
      var c = a.callbackNode;
      if (Hk() && a.callbackNode !== c) return null;
      var d = uc(a, a === Q ? Z : 0);
      if (0 === d) return null;
      if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
      else {
        b = d;
        var e = K;
        K |= 2;
        var f = Jk();
        if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
        do
          try {
            Lk();
            break;
          } catch (h) {
            Mk(a, h);
          }
        while (1);
        $g();
        mk.current = f;
        K = e;
        null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
      }
      if (0 !== b) {
        2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
        if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
        if (6 === b) Ck(a, d);
        else {
          e = a.current.alternate;
          if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f = xc(a), 0 !== f && (d = f, b = Nk(a, f))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
          a.finishedWork = e;
          a.finishedLanes = d;
          switch (b) {
            case 0:
            case 1:
              throw Error(p(345));
            case 2:
              Pk(a, tk, uk);
              break;
            case 3:
              Ck(a, d);
              if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
                if (0 !== uc(a, 0)) break;
                e = a.suspendedLanes;
                if ((e & d) !== d) {
                  R();
                  a.pingedLanes |= a.suspendedLanes & e;
                  break;
                }
                a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
                break;
              }
              Pk(a, tk, uk);
              break;
            case 4:
              Ck(a, d);
              if ((d & 4194240) === d) break;
              b = a.eventTimes;
              for (e = -1; 0 < d; ) {
                var g = 31 - oc(d);
                f = 1 << g;
                g = b[g];
                g > e && (e = g);
                d &= ~f;
              }
              d = e;
              d = B() - d;
              d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
              if (10 < d) {
                a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
                break;
              }
              Pk(a, tk, uk);
              break;
            case 5:
              Pk(a, tk, uk);
              break;
            default:
              throw Error(p(329));
          }
        }
      }
      Dk(a, B());
      return a.callbackNode === c ? Gk.bind(null, a) : null;
    }
    function Nk(a, b) {
      var c = sk;
      a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
      a = Ik(a, b);
      2 !== a && (b = tk, tk = c, null !== b && Fj(b));
      return a;
    }
    function Fj(a) {
      null === tk ? tk = a : tk.push.apply(tk, a);
    }
    function Ok(a) {
      for (var b = a; ; ) {
        if (b.flags & 16384) {
          var c = b.updateQueue;
          if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
            var e = c[d], f = e.getSnapshot;
            e = e.value;
            try {
              if (!He(f(), e)) return false;
            } catch (g) {
              return false;
            }
          }
        }
        c = b.child;
        if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
        else {
          if (b === a) break;
          for (; null === b.sibling; ) {
            if (null === b.return || b.return === a) return true;
            b = b.return;
          }
          b.sibling.return = b.return;
          b = b.sibling;
        }
      }
      return true;
    }
    function Ck(a, b) {
      b &= ~rk;
      b &= ~qk;
      a.suspendedLanes |= b;
      a.pingedLanes &= ~b;
      for (a = a.expirationTimes; 0 < b; ) {
        var c = 31 - oc(b), d = 1 << c;
        a[c] = -1;
        b &= ~d;
      }
    }
    function Ek(a) {
      if (0 !== (K & 6)) throw Error(p(327));
      Hk();
      var b = uc(a, 0);
      if (0 === (b & 1)) return Dk(a, B()), null;
      var c = Ik(a, b);
      if (0 !== a.tag && 2 === c) {
        var d = xc(a);
        0 !== d && (b = d, c = Nk(a, d));
      }
      if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
      if (6 === c) throw Error(p(345));
      a.finishedWork = a.current.alternate;
      a.finishedLanes = b;
      Pk(a, tk, uk);
      Dk(a, B());
      return null;
    }
    function Qk(a, b) {
      var c = K;
      K |= 1;
      try {
        return a(b);
      } finally {
        K = c, 0 === K && (Gj = B() + 500, fg && jg());
      }
    }
    function Rk(a) {
      null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
      var b = K;
      K |= 1;
      var c = ok.transition, d = C;
      try {
        if (ok.transition = null, C = 1, a) return a();
      } finally {
        C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
      }
    }
    function Hj() {
      fj = ej.current;
      E(ej);
    }
    function Kk(a, b) {
      a.finishedWork = null;
      a.finishedLanes = 0;
      var c = a.timeoutHandle;
      -1 !== c && (a.timeoutHandle = -1, Gf(c));
      if (null !== Y) for (c = Y.return; null !== c; ) {
        var d = c;
        wg(d);
        switch (d.tag) {
          case 1:
            d = d.type.childContextTypes;
            null !== d && void 0 !== d && $f();
            break;
          case 3:
            zh();
            E(Wf);
            E(H);
            Eh();
            break;
          case 5:
            Bh(d);
            break;
          case 4:
            zh();
            break;
          case 13:
            E(L);
            break;
          case 19:
            E(L);
            break;
          case 10:
            ah(d.type._context);
            break;
          case 22:
          case 23:
            Hj();
        }
        c = c.return;
      }
      Q = a;
      Y = a = Pg(a.current, null);
      Z = fj = b;
      T = 0;
      pk = null;
      rk = qk = rh = 0;
      tk = sk = null;
      if (null !== fh) {
        for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
          c.interleaved = null;
          var e = d.next, f = c.pending;
          if (null !== f) {
            var g = f.next;
            f.next = e;
            d.next = g;
          }
          c.pending = d;
        }
        fh = null;
      }
      return a;
    }
    function Mk(a, b) {
      do {
        var c = Y;
        try {
          $g();
          Fh.current = Rh;
          if (Ih) {
            for (var d = M.memoizedState; null !== d; ) {
              var e = d.queue;
              null !== e && (e.pending = null);
              d = d.next;
            }
            Ih = false;
          }
          Hh = 0;
          O = N = M = null;
          Jh = false;
          Kh = 0;
          nk.current = null;
          if (null === c || null === c.return) {
            T = 1;
            pk = b;
            Y = null;
            break;
          }
          a: {
            var f = a, g = c.return, h = c, k = b;
            b = Z;
            h.flags |= 32768;
            if (null !== k && "object" === typeof k && "function" === typeof k.then) {
              var l = k, m = h, q = m.tag;
              if (0 === (m.mode & 1) && (0 === q || 11 === q || 15 === q)) {
                var r = m.alternate;
                r ? (m.updateQueue = r.updateQueue, m.memoizedState = r.memoizedState, m.lanes = r.lanes) : (m.updateQueue = null, m.memoizedState = null);
              }
              var y = Ui(g);
              if (null !== y) {
                y.flags &= -257;
                Vi(y, g, h, f, b);
                y.mode & 1 && Si(f, l, b);
                b = y;
                k = l;
                var n = b.updateQueue;
                if (null === n) {
                  var t = /* @__PURE__ */ new Set();
                  t.add(k);
                  b.updateQueue = t;
                } else n.add(k);
                break a;
              } else {
                if (0 === (b & 1)) {
                  Si(f, l, b);
                  tj();
                  break a;
                }
                k = Error(p(426));
              }
            } else if (I && h.mode & 1) {
              var J = Ui(g);
              if (null !== J) {
                0 === (J.flags & 65536) && (J.flags |= 256);
                Vi(J, g, h, f, b);
                Jg(Ji(k, h));
                break a;
              }
            }
            f = k = Ji(k, h);
            4 !== T && (T = 2);
            null === sk ? sk = [f] : sk.push(f);
            f = g;
            do {
              switch (f.tag) {
                case 3:
                  f.flags |= 65536;
                  b &= -b;
                  f.lanes |= b;
                  var x = Ni(f, k, b);
                  ph(f, x);
                  break a;
                case 1:
                  h = k;
                  var w = f.type, u = f.stateNode;
                  if (0 === (f.flags & 128) && ("function" === typeof w.getDerivedStateFromError || null !== u && "function" === typeof u.componentDidCatch && (null === Ri || !Ri.has(u)))) {
                    f.flags |= 65536;
                    b &= -b;
                    f.lanes |= b;
                    var F = Qi(f, h, b);
                    ph(f, F);
                    break a;
                  }
              }
              f = f.return;
            } while (null !== f);
          }
          Sk(c);
        } catch (na) {
          b = na;
          Y === c && null !== c && (Y = c = c.return);
          continue;
        }
        break;
      } while (1);
    }
    function Jk() {
      var a = mk.current;
      mk.current = Rh;
      return null === a ? Rh : a;
    }
    function tj() {
      if (0 === T || 3 === T || 2 === T) T = 4;
      null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
    }
    function Ik(a, b) {
      var c = K;
      K |= 2;
      var d = Jk();
      if (Q !== a || Z !== b) uk = null, Kk(a, b);
      do
        try {
          Tk();
          break;
        } catch (e) {
          Mk(a, e);
        }
      while (1);
      $g();
      K = c;
      mk.current = d;
      if (null !== Y) throw Error(p(261));
      Q = null;
      Z = 0;
      return T;
    }
    function Tk() {
      for (; null !== Y; ) Uk(Y);
    }
    function Lk() {
      for (; null !== Y && !cc(); ) Uk(Y);
    }
    function Uk(a) {
      var b = Vk(a.alternate, a, fj);
      a.memoizedProps = a.pendingProps;
      null === b ? Sk(a) : Y = b;
      nk.current = null;
    }
    function Sk(a) {
      var b = a;
      do {
        var c = b.alternate;
        a = b.return;
        if (0 === (b.flags & 32768)) {
          if (c = Ej(c, b, fj), null !== c) {
            Y = c;
            return;
          }
        } else {
          c = Ij(c, b);
          if (null !== c) {
            c.flags &= 32767;
            Y = c;
            return;
          }
          if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
          else {
            T = 6;
            Y = null;
            return;
          }
        }
        b = b.sibling;
        if (null !== b) {
          Y = b;
          return;
        }
        Y = b = a;
      } while (null !== b);
      0 === T && (T = 5);
    }
    function Pk(a, b, c) {
      var d = C, e = ok.transition;
      try {
        ok.transition = null, C = 1, Wk(a, b, c, d);
      } finally {
        ok.transition = e, C = d;
      }
      return null;
    }
    function Wk(a, b, c, d) {
      do
        Hk();
      while (null !== wk);
      if (0 !== (K & 6)) throw Error(p(327));
      c = a.finishedWork;
      var e = a.finishedLanes;
      if (null === c) return null;
      a.finishedWork = null;
      a.finishedLanes = 0;
      if (c === a.current) throw Error(p(177));
      a.callbackNode = null;
      a.callbackPriority = 0;
      var f = c.lanes | c.childLanes;
      Bc(a, f);
      a === Q && (Y = Q = null, Z = 0);
      0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
        Hk();
        return null;
      }));
      f = 0 !== (c.flags & 15990);
      if (0 !== (c.subtreeFlags & 15990) || f) {
        f = ok.transition;
        ok.transition = null;
        var g = C;
        C = 1;
        var h = K;
        K |= 4;
        nk.current = null;
        Oj(a, c);
        dk(c, a);
        Oe(Df);
        dd = !!Cf;
        Df = Cf = null;
        a.current = c;
        hk(c, a, e);
        dc();
        K = h;
        C = g;
        ok.transition = f;
      } else a.current = c;
      vk && (vk = false, wk = a, xk = e);
      f = a.pendingLanes;
      0 === f && (Ri = null);
      mc(c.stateNode, d);
      Dk(a, B());
      if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
      if (Oi) throw Oi = false, a = Pi, Pi = null, a;
      0 !== (xk & 1) && 0 !== a.tag && Hk();
      f = a.pendingLanes;
      0 !== (f & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
      jg();
      return null;
    }
    function Hk() {
      if (null !== wk) {
        var a = Dc(xk), b = ok.transition, c = C;
        try {
          ok.transition = null;
          C = 16 > a ? 16 : a;
          if (null === wk) var d = false;
          else {
            a = wk;
            wk = null;
            xk = 0;
            if (0 !== (K & 6)) throw Error(p(331));
            var e = K;
            K |= 4;
            for (V = a.current; null !== V; ) {
              var f = V, g = f.child;
              if (0 !== (V.flags & 16)) {
                var h = f.deletions;
                if (null !== h) {
                  for (var k = 0; k < h.length; k++) {
                    var l = h[k];
                    for (V = l; null !== V; ) {
                      var m = V;
                      switch (m.tag) {
                        case 0:
                        case 11:
                        case 15:
                          Pj(8, m, f);
                      }
                      var q = m.child;
                      if (null !== q) q.return = m, V = q;
                      else for (; null !== V; ) {
                        m = V;
                        var r = m.sibling, y = m.return;
                        Sj(m);
                        if (m === l) {
                          V = null;
                          break;
                        }
                        if (null !== r) {
                          r.return = y;
                          V = r;
                          break;
                        }
                        V = y;
                      }
                    }
                  }
                  var n = f.alternate;
                  if (null !== n) {
                    var t = n.child;
                    if (null !== t) {
                      n.child = null;
                      do {
                        var J = t.sibling;
                        t.sibling = null;
                        t = J;
                      } while (null !== t);
                    }
                  }
                  V = f;
                }
              }
              if (0 !== (f.subtreeFlags & 2064) && null !== g) g.return = f, V = g;
              else b: for (; null !== V; ) {
                f = V;
                if (0 !== (f.flags & 2048)) switch (f.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Pj(9, f, f.return);
                }
                var x = f.sibling;
                if (null !== x) {
                  x.return = f.return;
                  V = x;
                  break b;
                }
                V = f.return;
              }
            }
            var w = a.current;
            for (V = w; null !== V; ) {
              g = V;
              var u = g.child;
              if (0 !== (g.subtreeFlags & 2064) && null !== u) u.return = g, V = u;
              else b: for (g = w; null !== V; ) {
                h = V;
                if (0 !== (h.flags & 2048)) try {
                  switch (h.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Qj(9, h);
                  }
                } catch (na) {
                  W(h, h.return, na);
                }
                if (h === g) {
                  V = null;
                  break b;
                }
                var F = h.sibling;
                if (null !== F) {
                  F.return = h.return;
                  V = F;
                  break b;
                }
                V = h.return;
              }
            }
            K = e;
            jg();
            if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
              lc.onPostCommitFiberRoot(kc, a);
            } catch (na) {
            }
            d = true;
          }
          return d;
        } finally {
          C = c, ok.transition = b;
        }
      }
      return false;
    }
    function Xk(a, b, c) {
      b = Ji(c, b);
      b = Ni(a, b, 1);
      a = nh(a, b, 1);
      b = R();
      null !== a && (Ac(a, 1, b), Dk(a, b));
    }
    function W(a, b, c) {
      if (3 === a.tag) Xk(a, a, c);
      else for (; null !== b; ) {
        if (3 === b.tag) {
          Xk(b, a, c);
          break;
        } else if (1 === b.tag) {
          var d = b.stateNode;
          if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
            a = Ji(c, a);
            a = Qi(b, a, 1);
            b = nh(b, a, 1);
            a = R();
            null !== b && (Ac(b, 1, a), Dk(b, a));
            break;
          }
        }
        b = b.return;
      }
    }
    function Ti(a, b, c) {
      var d = a.pingCache;
      null !== d && d.delete(b);
      b = R();
      a.pingedLanes |= a.suspendedLanes & c;
      Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
      Dk(a, b);
    }
    function Yk(a, b) {
      0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
      var c = R();
      a = ih(a, b);
      null !== a && (Ac(a, b, c), Dk(a, c));
    }
    function uj(a) {
      var b = a.memoizedState, c = 0;
      null !== b && (c = b.retryLane);
      Yk(a, c);
    }
    function bk(a, b) {
      var c = 0;
      switch (a.tag) {
        case 13:
          var d = a.stateNode;
          var e = a.memoizedState;
          null !== e && (c = e.retryLane);
          break;
        case 19:
          d = a.stateNode;
          break;
        default:
          throw Error(p(314));
      }
      null !== d && d.delete(b);
      Yk(a, c);
    }
    var Vk;
    Vk = function(a, b, c) {
      if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
      else {
        if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
        dh = 0 !== (a.flags & 131072) ? true : false;
      }
      else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
      b.lanes = 0;
      switch (b.tag) {
        case 2:
          var d = b.type;
          ij(a, b);
          a = b.pendingProps;
          var e = Yf(b, H.current);
          ch(b, c);
          e = Nh(null, b, d, a, e, c);
          var f = Sh();
          b.flags |= 1;
          "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f = true, cg(b)) : f = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f, c)) : (b.tag = 0, I && f && vg(b), Xi(null, b, e, c), b = b.child);
          return b;
        case 16:
          d = b.elementType;
          a: {
            ij(a, b);
            a = b.pendingProps;
            e = d._init;
            d = e(d._payload);
            b.type = d;
            e = b.tag = Zk(d);
            a = Ci(d, a);
            switch (e) {
              case 0:
                b = cj(null, b, d, a, c);
                break a;
              case 1:
                b = hj(null, b, d, a, c);
                break a;
              case 11:
                b = Yi(null, b, d, a, c);
                break a;
              case 14:
                b = $i(null, b, d, Ci(d.type, a), c);
                break a;
            }
            throw Error(p(
              306,
              d,
              ""
            ));
          }
          return b;
        case 0:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
        case 1:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
        case 3:
          a: {
            kj(b);
            if (null === a) throw Error(p(387));
            d = b.pendingProps;
            f = b.memoizedState;
            e = f.element;
            lh(a, b);
            qh(b, d, null, c);
            var g = b.memoizedState;
            d = g.element;
            if (f.isDehydrated) if (f = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f, b.memoizedState = f, b.flags & 256) {
              e = Ji(Error(p(423)), b);
              b = lj(a, b, d, c, e);
              break a;
            } else if (d !== e) {
              e = Ji(Error(p(424)), b);
              b = lj(a, b, d, c, e);
              break a;
            } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
            else {
              Ig();
              if (d === e) {
                b = Zi(a, b, c);
                break a;
              }
              Xi(a, b, d, c);
            }
            b = b.child;
          }
          return b;
        case 5:
          return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f && Ef(d, f) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
        case 6:
          return null === a && Eg(b), null;
        case 13:
          return oj(a, b, c);
        case 4:
          return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
        case 11:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
        case 7:
          return Xi(a, b, b.pendingProps, c), b.child;
        case 8:
          return Xi(a, b, b.pendingProps.children, c), b.child;
        case 12:
          return Xi(a, b, b.pendingProps.children, c), b.child;
        case 10:
          a: {
            d = b.type._context;
            e = b.pendingProps;
            f = b.memoizedProps;
            g = e.value;
            G(Wg, d._currentValue);
            d._currentValue = g;
            if (null !== f) if (He(f.value, g)) {
              if (f.children === e.children && !Wf.current) {
                b = Zi(a, b, c);
                break a;
              }
            } else for (f = b.child, null !== f && (f.return = b); null !== f; ) {
              var h = f.dependencies;
              if (null !== h) {
                g = f.child;
                for (var k = h.firstContext; null !== k; ) {
                  if (k.context === d) {
                    if (1 === f.tag) {
                      k = mh(-1, c & -c);
                      k.tag = 2;
                      var l = f.updateQueue;
                      if (null !== l) {
                        l = l.shared;
                        var m = l.pending;
                        null === m ? k.next = k : (k.next = m.next, m.next = k);
                        l.pending = k;
                      }
                    }
                    f.lanes |= c;
                    k = f.alternate;
                    null !== k && (k.lanes |= c);
                    bh(
                      f.return,
                      c,
                      b
                    );
                    h.lanes |= c;
                    break;
                  }
                  k = k.next;
                }
              } else if (10 === f.tag) g = f.type === b.type ? null : f.child;
              else if (18 === f.tag) {
                g = f.return;
                if (null === g) throw Error(p(341));
                g.lanes |= c;
                h = g.alternate;
                null !== h && (h.lanes |= c);
                bh(g, c, b);
                g = f.sibling;
              } else g = f.child;
              if (null !== g) g.return = f;
              else for (g = f; null !== g; ) {
                if (g === b) {
                  g = null;
                  break;
                }
                f = g.sibling;
                if (null !== f) {
                  f.return = g.return;
                  g = f;
                  break;
                }
                g = g.return;
              }
              f = g;
            }
            Xi(a, b, e.children, c);
            b = b.child;
          }
          return b;
        case 9:
          return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
        case 14:
          return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
        case 15:
          return bj(a, b, b.type, b.pendingProps, c);
        case 17:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
        case 19:
          return xj(a, b, c);
        case 22:
          return dj(a, b, c);
      }
      throw Error(p(156, b.tag));
    };
    function Fk(a, b) {
      return ac(a, b);
    }
    function $k(a, b, c, d) {
      this.tag = a;
      this.key = c;
      this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
      this.index = 0;
      this.ref = null;
      this.pendingProps = b;
      this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
      this.mode = d;
      this.subtreeFlags = this.flags = 0;
      this.deletions = null;
      this.childLanes = this.lanes = 0;
      this.alternate = null;
    }
    function Bg(a, b, c, d) {
      return new $k(a, b, c, d);
    }
    function aj(a) {
      a = a.prototype;
      return !(!a || !a.isReactComponent);
    }
    function Zk(a) {
      if ("function" === typeof a) return aj(a) ? 1 : 0;
      if (void 0 !== a && null !== a) {
        a = a.$$typeof;
        if (a === Da) return 11;
        if (a === Ga) return 14;
      }
      return 2;
    }
    function Pg(a, b) {
      var c = a.alternate;
      null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
      c.flags = a.flags & 14680064;
      c.childLanes = a.childLanes;
      c.lanes = a.lanes;
      c.child = a.child;
      c.memoizedProps = a.memoizedProps;
      c.memoizedState = a.memoizedState;
      c.updateQueue = a.updateQueue;
      b = a.dependencies;
      c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
      c.sibling = a.sibling;
      c.index = a.index;
      c.ref = a.ref;
      return c;
    }
    function Rg(a, b, c, d, e, f) {
      var g = 2;
      d = a;
      if ("function" === typeof a) aj(a) && (g = 1);
      else if ("string" === typeof a) g = 5;
      else a: switch (a) {
        case ya:
          return Tg(c.children, e, f, b);
        case za:
          g = 8;
          e |= 8;
          break;
        case Aa:
          return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f, a;
        case Ea:
          return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f, a;
        case Fa:
          return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f, a;
        case Ia:
          return pj(c, e, f, b);
        default:
          if ("object" === typeof a && null !== a) switch (a.$$typeof) {
            case Ba:
              g = 10;
              break a;
            case Ca:
              g = 9;
              break a;
            case Da:
              g = 11;
              break a;
            case Ga:
              g = 14;
              break a;
            case Ha:
              g = 16;
              d = null;
              break a;
          }
          throw Error(p(130, null == a ? a : typeof a, ""));
      }
      b = Bg(g, c, b, e);
      b.elementType = a;
      b.type = d;
      b.lanes = f;
      return b;
    }
    function Tg(a, b, c, d) {
      a = Bg(7, a, d, b);
      a.lanes = c;
      return a;
    }
    function pj(a, b, c, d) {
      a = Bg(22, a, d, b);
      a.elementType = Ia;
      a.lanes = c;
      a.stateNode = { isHidden: false };
      return a;
    }
    function Qg(a, b, c) {
      a = Bg(6, a, null, b);
      a.lanes = c;
      return a;
    }
    function Sg(a, b, c) {
      b = Bg(4, null !== a.children ? a.children : [], a.key, b);
      b.lanes = c;
      b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
      return b;
    }
    function al(a, b, c, d, e) {
      this.tag = b;
      this.containerInfo = a;
      this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
      this.timeoutHandle = -1;
      this.callbackNode = this.pendingContext = this.context = null;
      this.callbackPriority = 0;
      this.eventTimes = zc(0);
      this.expirationTimes = zc(-1);
      this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
      this.entanglements = zc(0);
      this.identifierPrefix = d;
      this.onRecoverableError = e;
      this.mutableSourceEagerHydrationData = null;
    }
    function bl(a, b, c, d, e, f, g, h, k) {
      a = new al(a, b, c, h, k);
      1 === b ? (b = 1, true === f && (b |= 8)) : b = 0;
      f = Bg(3, null, null, b);
      a.current = f;
      f.stateNode = a;
      f.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
      kh(f);
      return a;
    }
    function cl(a, b, c) {
      var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
      return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
    }
    function dl(a) {
      if (!a) return Vf;
      a = a._reactInternals;
      a: {
        if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
        var b = a;
        do {
          switch (b.tag) {
            case 3:
              b = b.stateNode.context;
              break a;
            case 1:
              if (Zf(b.type)) {
                b = b.stateNode.__reactInternalMemoizedMergedChildContext;
                break a;
              }
          }
          b = b.return;
        } while (null !== b);
        throw Error(p(171));
      }
      if (1 === a.tag) {
        var c = a.type;
        if (Zf(c)) return bg(a, c, b);
      }
      return b;
    }
    function el(a, b, c, d, e, f, g, h, k) {
      a = bl(c, d, true, a, e, f, g, h, k);
      a.context = dl(null);
      c = a.current;
      d = R();
      e = yi(c);
      f = mh(d, e);
      f.callback = void 0 !== b && null !== b ? b : null;
      nh(c, f, e);
      a.current.lanes = e;
      Ac(a, e, d);
      Dk(a, d);
      return a;
    }
    function fl(a, b, c, d) {
      var e = b.current, f = R(), g = yi(e);
      c = dl(c);
      null === b.context ? b.context = c : b.pendingContext = c;
      b = mh(f, g);
      b.payload = { element: a };
      d = void 0 === d ? null : d;
      null !== d && (b.callback = d);
      a = nh(e, b, g);
      null !== a && (gi(a, e, g, f), oh(a, e, g));
      return g;
    }
    function gl(a) {
      a = a.current;
      if (!a.child) return null;
      switch (a.child.tag) {
        case 5:
          return a.child.stateNode;
        default:
          return a.child.stateNode;
      }
    }
    function hl(a, b) {
      a = a.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        var c = a.retryLane;
        a.retryLane = 0 !== c && c < b ? c : b;
      }
    }
    function il(a, b) {
      hl(a, b);
      (a = a.alternate) && hl(a, b);
    }
    function jl() {
      return null;
    }
    var kl = "function" === typeof reportError ? reportError : function(a) {
      console.error(a);
    };
    function ll(a) {
      this._internalRoot = a;
    }
    ml.prototype.render = ll.prototype.render = function(a) {
      var b = this._internalRoot;
      if (null === b) throw Error(p(409));
      fl(a, b, null, null);
    };
    ml.prototype.unmount = ll.prototype.unmount = function() {
      var a = this._internalRoot;
      if (null !== a) {
        this._internalRoot = null;
        var b = a.containerInfo;
        Rk(function() {
          fl(null, a, null, null);
        });
        b[uf] = null;
      }
    };
    function ml(a) {
      this._internalRoot = a;
    }
    ml.prototype.unstable_scheduleHydration = function(a) {
      if (a) {
        var b = Hc();
        a = { blockedOn: null, target: a, priority: b };
        for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
        Qc.splice(c, 0, a);
        0 === c && Vc(a);
      }
    };
    function nl(a) {
      return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
    }
    function ol(a) {
      return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
    }
    function pl() {
    }
    function ql(a, b, c, d, e) {
      if (e) {
        if ("function" === typeof d) {
          var f = d;
          d = function() {
            var a2 = gl(g);
            f.call(a2);
          };
        }
        var g = el(b, d, a, 0, null, false, false, "", pl);
        a._reactRootContainer = g;
        a[uf] = g.current;
        sf(8 === a.nodeType ? a.parentNode : a);
        Rk();
        return g;
      }
      for (; e = a.lastChild; ) a.removeChild(e);
      if ("function" === typeof d) {
        var h = d;
        d = function() {
          var a2 = gl(k);
          h.call(a2);
        };
      }
      var k = bl(a, 0, false, null, null, false, false, "", pl);
      a._reactRootContainer = k;
      a[uf] = k.current;
      sf(8 === a.nodeType ? a.parentNode : a);
      Rk(function() {
        fl(b, k, c, d);
      });
      return k;
    }
    function rl(a, b, c, d, e) {
      var f = c._reactRootContainer;
      if (f) {
        var g = f;
        if ("function" === typeof e) {
          var h = e;
          e = function() {
            var a2 = gl(g);
            h.call(a2);
          };
        }
        fl(b, g, a, e);
      } else g = ql(c, b, a, e, d);
      return gl(g);
    }
    Ec = function(a) {
      switch (a.tag) {
        case 3:
          var b = a.stateNode;
          if (b.current.memoizedState.isDehydrated) {
            var c = tc(b.pendingLanes);
            0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
          }
          break;
        case 13:
          Rk(function() {
            var b2 = ih(a, 1);
            if (null !== b2) {
              var c2 = R();
              gi(b2, a, 1, c2);
            }
          }), il(a, 1);
      }
    };
    Fc = function(a) {
      if (13 === a.tag) {
        var b = ih(a, 134217728);
        if (null !== b) {
          var c = R();
          gi(b, a, 134217728, c);
        }
        il(a, 134217728);
      }
    };
    Gc = function(a) {
      if (13 === a.tag) {
        var b = yi(a), c = ih(a, b);
        if (null !== c) {
          var d = R();
          gi(c, a, b, d);
        }
        il(a, b);
      }
    };
    Hc = function() {
      return C;
    };
    Ic = function(a, b) {
      var c = C;
      try {
        return C = a, b();
      } finally {
        C = c;
      }
    };
    yb = function(a, b, c) {
      switch (b) {
        case "input":
          bb(a, c);
          b = c.name;
          if ("radio" === c.type && null != b) {
            for (c = a; c.parentNode; ) c = c.parentNode;
            c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
            for (b = 0; b < c.length; b++) {
              var d = c[b];
              if (d !== a && d.form === a.form) {
                var e = Db(d);
                if (!e) throw Error(p(90));
                Wa(d);
                bb(d, e);
              }
            }
          }
          break;
        case "textarea":
          ib(a, c);
          break;
        case "select":
          b = c.value, null != b && fb(a, !!c.multiple, b, false);
      }
    };
    Gb = Qk;
    Hb = Rk;
    var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] };
    var tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
    var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
      a = Zb(a);
      return null === a ? null : a.stateNode;
    }, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
    if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
      vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!vl.isDisabled && vl.supportsFiber) try {
        kc = vl.inject(ul), lc = vl;
      } catch (a) {
      }
    }
    var vl;
    exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
    exports.createPortal = function(a, b) {
      var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (!nl(b)) throw Error(p(200));
      return cl(a, b, null, c);
    };
    exports.createRoot = function(a, b) {
      if (!nl(a)) throw Error(p(299));
      var c = false, d = "", e = kl;
      null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
      b = bl(a, 1, false, null, null, c, false, d, e);
      a[uf] = b.current;
      sf(8 === a.nodeType ? a.parentNode : a);
      return new ll(b);
    };
    exports.findDOMNode = function(a) {
      if (null == a) return null;
      if (1 === a.nodeType) return a;
      var b = a._reactInternals;
      if (void 0 === b) {
        if ("function" === typeof a.render) throw Error(p(188));
        a = Object.keys(a).join(",");
        throw Error(p(268, a));
      }
      a = Zb(b);
      a = null === a ? null : a.stateNode;
      return a;
    };
    exports.flushSync = function(a) {
      return Rk(a);
    };
    exports.hydrate = function(a, b, c) {
      if (!ol(b)) throw Error(p(200));
      return rl(null, a, b, true, c);
    };
    exports.hydrateRoot = function(a, b, c) {
      if (!nl(a)) throw Error(p(405));
      var d = null != c && c.hydratedSources || null, e = false, f = "", g = kl;
      null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
      b = el(b, null, a, 1, null != c ? c : null, e, false, f, g);
      a[uf] = b.current;
      sf(a);
      if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
        c,
        e
      );
      return new ml(b);
    };
    exports.render = function(a, b, c) {
      if (!ol(b)) throw Error(p(200));
      return rl(null, a, b, false, c);
    };
    exports.unmountComponentAtNode = function(a) {
      if (!ol(a)) throw Error(p(40));
      return a._reactRootContainer ? (Rk(function() {
        rl(null, null, a, false, function() {
          a._reactRootContainer = null;
          a[uf] = null;
        });
      }), true) : false;
    };
    exports.unstable_batchedUpdates = Qk;
    exports.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
      if (!ol(c)) throw Error(p(200));
      if (null == a || void 0 === a._reactInternals) throw Error(p(38));
      return rl(a, b, c, false, d);
    };
    exports.version = "18.3.1-next-f1338f8080-20240426";
  }
});

// node_modules/react-dom/index.js
var require_react_dom = __commonJS({
  "node_modules/react-dom/index.js"(exports, module) {
    "use strict";
    function checkDCE() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
        return;
      }
      if (false) {
        throw new Error("^_^");
      }
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err) {
        console.error(err);
      }
    }
    if (true) {
      checkDCE();
      module.exports = require_react_dom_production_min();
    } else {
      module.exports = null;
    }
  }
});

// node_modules/react-dom/client.js
var require_client = __commonJS({
  "node_modules/react-dom/client.js"(exports) {
    "use strict";
    var m = require_react_dom();
    if (true) {
      exports.createRoot = m.createRoot;
      exports.hydrateRoot = m.hydrateRoot;
    } else {
      i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      exports.createRoot = function(c, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.createRoot(c, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
      exports.hydrateRoot = function(c, h, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.hydrateRoot(c, h, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
    }
    var i;
  }
});

// node_modules/fast-equals/dist/fast-equals.js
var require_fast_equals = __commonJS({
  "node_modules/fast-equals/dist/fast-equals.js"(exports, module) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2["fast-equals"] = {}));
    })(exports, (function(exports2) {
      "use strict";
      function createDefaultIsNestedEqual(comparator) {
        return function isEqual(a, b, _indexOrKeyA, _indexOrKeyB, _parentA, _parentB, meta) {
          return comparator(a, b, meta);
        };
      }
      function createIsCircular(areItemsEqual) {
        return function isCircular(a, b, isEqual, cache) {
          if (!a || !b || typeof a !== "object" || typeof b !== "object") {
            return areItemsEqual(a, b, isEqual, cache);
          }
          var cachedA = cache.get(a);
          var cachedB = cache.get(b);
          if (cachedA && cachedB) {
            return cachedA === b && cachedB === a;
          }
          cache.set(a, b);
          cache.set(b, a);
          var result = areItemsEqual(a, b, isEqual, cache);
          cache.delete(a);
          cache.delete(b);
          return result;
        };
      }
      function merge(a, b) {
        var merged = {};
        for (var key in a) {
          merged[key] = a[key];
        }
        for (var key in b) {
          merged[key] = b[key];
        }
        return merged;
      }
      function isPlainObject(value) {
        return value.constructor === Object || value.constructor == null;
      }
      function isPromiseLike(value) {
        return typeof value.then === "function";
      }
      function sameValueZeroEqual(a, b) {
        return a === b || a !== a && b !== b;
      }
      var ARGUMENTS_TAG = "[object Arguments]";
      var BOOLEAN_TAG = "[object Boolean]";
      var DATE_TAG = "[object Date]";
      var REG_EXP_TAG = "[object RegExp]";
      var MAP_TAG = "[object Map]";
      var NUMBER_TAG = "[object Number]";
      var OBJECT_TAG = "[object Object]";
      var SET_TAG = "[object Set]";
      var STRING_TAG = "[object String]";
      var toString = Object.prototype.toString;
      function createComparator(_a) {
        var areArraysEqual2 = _a.areArraysEqual, areDatesEqual2 = _a.areDatesEqual, areMapsEqual2 = _a.areMapsEqual, areObjectsEqual2 = _a.areObjectsEqual, areRegExpsEqual2 = _a.areRegExpsEqual, areSetsEqual2 = _a.areSetsEqual, createIsNestedEqual = _a.createIsNestedEqual;
        var isEqual = createIsNestedEqual(comparator);
        function comparator(a, b, meta) {
          if (a === b) {
            return true;
          }
          if (!a || !b || typeof a !== "object" || typeof b !== "object") {
            return a !== a && b !== b;
          }
          if (isPlainObject(a) && isPlainObject(b)) {
            return areObjectsEqual2(a, b, isEqual, meta);
          }
          var aArray = Array.isArray(a);
          var bArray = Array.isArray(b);
          if (aArray || bArray) {
            return aArray === bArray && areArraysEqual2(a, b, isEqual, meta);
          }
          var aTag = toString.call(a);
          if (aTag !== toString.call(b)) {
            return false;
          }
          if (aTag === DATE_TAG) {
            return areDatesEqual2(a, b, isEqual, meta);
          }
          if (aTag === REG_EXP_TAG) {
            return areRegExpsEqual2(a, b, isEqual, meta);
          }
          if (aTag === MAP_TAG) {
            return areMapsEqual2(a, b, isEqual, meta);
          }
          if (aTag === SET_TAG) {
            return areSetsEqual2(a, b, isEqual, meta);
          }
          if (aTag === OBJECT_TAG || aTag === ARGUMENTS_TAG) {
            return isPromiseLike(a) || isPromiseLike(b) ? false : areObjectsEqual2(a, b, isEqual, meta);
          }
          if (aTag === BOOLEAN_TAG || aTag === NUMBER_TAG || aTag === STRING_TAG) {
            return sameValueZeroEqual(a.valueOf(), b.valueOf());
          }
          return false;
        }
        return comparator;
      }
      function areArraysEqual(a, b, isEqual, meta) {
        var index = a.length;
        if (b.length !== index) {
          return false;
        }
        while (index-- > 0) {
          if (!isEqual(a[index], b[index], index, index, a, b, meta)) {
            return false;
          }
        }
        return true;
      }
      var areArraysEqualCircular = createIsCircular(areArraysEqual);
      function areDatesEqual(a, b) {
        return sameValueZeroEqual(a.valueOf(), b.valueOf());
      }
      function areMapsEqual(a, b, isEqual, meta) {
        var isValueEqual = a.size === b.size;
        if (!isValueEqual) {
          return false;
        }
        if (!a.size) {
          return true;
        }
        var matchedIndices = {};
        var indexA = 0;
        a.forEach(function(aValue, aKey) {
          if (!isValueEqual) {
            return;
          }
          var hasMatch = false;
          var matchIndexB = 0;
          b.forEach(function(bValue, bKey) {
            if (!hasMatch && !matchedIndices[matchIndexB] && (hasMatch = isEqual(aKey, bKey, indexA, matchIndexB, a, b, meta) && isEqual(aValue, bValue, aKey, bKey, a, b, meta))) {
              matchedIndices[matchIndexB] = true;
            }
            matchIndexB++;
          });
          indexA++;
          isValueEqual = hasMatch;
        });
        return isValueEqual;
      }
      var areMapsEqualCircular = createIsCircular(areMapsEqual);
      var OWNER = "_owner";
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      function areObjectsEqual(a, b, isEqual, meta) {
        var keysA = Object.keys(a);
        var index = keysA.length;
        if (Object.keys(b).length !== index) {
          return false;
        }
        var key;
        while (index-- > 0) {
          key = keysA[index];
          if (key === OWNER) {
            var reactElementA = !!a.$$typeof;
            var reactElementB = !!b.$$typeof;
            if ((reactElementA || reactElementB) && reactElementA !== reactElementB) {
              return false;
            }
          }
          if (!hasOwnProperty.call(b, key) || !isEqual(a[key], b[key], key, key, a, b, meta)) {
            return false;
          }
        }
        return true;
      }
      var areObjectsEqualCircular = createIsCircular(areObjectsEqual);
      function areRegExpsEqual(a, b) {
        return a.source === b.source && a.flags === b.flags;
      }
      function areSetsEqual(a, b, isEqual, meta) {
        var isValueEqual = a.size === b.size;
        if (!isValueEqual) {
          return false;
        }
        if (!a.size) {
          return true;
        }
        var matchedIndices = {};
        a.forEach(function(aValue, aKey) {
          if (!isValueEqual) {
            return;
          }
          var hasMatch = false;
          var matchIndex = 0;
          b.forEach(function(bValue, bKey) {
            if (!hasMatch && !matchedIndices[matchIndex] && (hasMatch = isEqual(aValue, bValue, aKey, bKey, a, b, meta))) {
              matchedIndices[matchIndex] = true;
            }
            matchIndex++;
          });
          isValueEqual = hasMatch;
        });
        return isValueEqual;
      }
      var areSetsEqualCircular = createIsCircular(areSetsEqual);
      var DEFAULT_CONFIG = Object.freeze({
        areArraysEqual,
        areDatesEqual,
        areMapsEqual,
        areObjectsEqual,
        areRegExpsEqual,
        areSetsEqual,
        createIsNestedEqual: createDefaultIsNestedEqual
      });
      var DEFAULT_CIRCULAR_CONFIG = Object.freeze({
        areArraysEqual: areArraysEqualCircular,
        areDatesEqual,
        areMapsEqual: areMapsEqualCircular,
        areObjectsEqual: areObjectsEqualCircular,
        areRegExpsEqual,
        areSetsEqual: areSetsEqualCircular,
        createIsNestedEqual: createDefaultIsNestedEqual
      });
      var isDeepEqual = createComparator(DEFAULT_CONFIG);
      function deepEqual(a, b) {
        return isDeepEqual(a, b, void 0);
      }
      var isShallowEqual = createComparator(merge(DEFAULT_CONFIG, { createIsNestedEqual: function() {
        return sameValueZeroEqual;
      } }));
      function shallowEqual(a, b) {
        return isShallowEqual(a, b, void 0);
      }
      var isCircularDeepEqual = createComparator(DEFAULT_CIRCULAR_CONFIG);
      function circularDeepEqual(a, b) {
        return isCircularDeepEqual(a, b, /* @__PURE__ */ new WeakMap());
      }
      var isCircularShallowEqual = createComparator(merge(DEFAULT_CIRCULAR_CONFIG, {
        createIsNestedEqual: function() {
          return sameValueZeroEqual;
        }
      }));
      function circularShallowEqual(a, b) {
        return isCircularShallowEqual(a, b, /* @__PURE__ */ new WeakMap());
      }
      function createCustomEqual(getComparatorOptions) {
        return createComparator(merge(DEFAULT_CONFIG, getComparatorOptions(DEFAULT_CONFIG)));
      }
      function createCustomCircularEqual(getComparatorOptions) {
        var comparator = createComparator(merge(DEFAULT_CIRCULAR_CONFIG, getComparatorOptions(DEFAULT_CIRCULAR_CONFIG)));
        return (function(a, b, meta) {
          if (meta === void 0) {
            meta = /* @__PURE__ */ new WeakMap();
          }
          return comparator(a, b, meta);
        });
      }
      exports2.circularDeepEqual = circularDeepEqual;
      exports2.circularShallowEqual = circularShallowEqual;
      exports2.createCustomCircularEqual = createCustomCircularEqual;
      exports2.createCustomEqual = createCustomEqual;
      exports2.deepEqual = deepEqual;
      exports2.sameValueZeroEqual = sameValueZeroEqual;
      exports2.shallowEqual = shallowEqual;
      Object.defineProperty(exports2, "__esModule", { value: true });
    }));
  }
});

// node_modules/clsx/dist/clsx.js
var require_clsx = __commonJS({
  "node_modules/clsx/dist/clsx.js"(exports, module) {
    function r(e2) {
      var o, t, f = "";
      if ("string" == typeof e2 || "number" == typeof e2) f += e2;
      else if ("object" == typeof e2) if (Array.isArray(e2)) {
        var n = e2.length;
        for (o = 0; o < n; o++) e2[o] && (t = r(e2[o])) && (f && (f += " "), f += t);
      } else for (t in e2) e2[t] && (f && (f += " "), f += t);
      return f;
    }
    function e() {
      for (var e2, o, t = 0, f = "", n = arguments.length; t < n; t++) (e2 = arguments[t]) && (o = r(e2)) && (f && (f += " "), f += o);
      return f;
    }
    module.exports = e, module.exports.clsx = e;
  }
});

// node_modules/react-grid-layout/build/fastRGLPropsEqual.js
var require_fastRGLPropsEqual = __commonJS({
  "node_modules/react-grid-layout/build/fastRGLPropsEqual.js"(exports, module) {
    module.exports = function fastRGLPropsEqual(a, b, isEqualImpl) {
      if (a === b) return true;
      return a.className === b.className && isEqualImpl(a.style, b.style) && a.width === b.width && a.autoSize === b.autoSize && a.cols === b.cols && a.draggableCancel === b.draggableCancel && a.draggableHandle === b.draggableHandle && isEqualImpl(a.verticalCompact, b.verticalCompact) && isEqualImpl(a.compactType, b.compactType) && isEqualImpl(a.layout, b.layout) && isEqualImpl(a.margin, b.margin) && isEqualImpl(a.containerPadding, b.containerPadding) && a.rowHeight === b.rowHeight && a.maxRows === b.maxRows && a.isBounded === b.isBounded && a.isDraggable === b.isDraggable && a.isResizable === b.isResizable && a.allowOverlap === b.allowOverlap && a.preventCollision === b.preventCollision && a.useCSSTransforms === b.useCSSTransforms && a.transformScale === b.transformScale && a.isDroppable === b.isDroppable && isEqualImpl(a.resizeHandles, b.resizeHandles) && isEqualImpl(a.resizeHandle, b.resizeHandle) && a.onLayoutChange === b.onLayoutChange && a.onDragStart === b.onDragStart && a.onDrag === b.onDrag && a.onDragStop === b.onDragStop && a.onResizeStart === b.onResizeStart && a.onResize === b.onResize && a.onResizeStop === b.onResizeStop && a.onDrop === b.onDrop && isEqualImpl(a.droppingItem, b.droppingItem) && isEqualImpl(a.innerRef, b.innerRef);
    };
  }
});

// node_modules/react-grid-layout/build/utils.js
var require_utils = __commonJS({
  "node_modules/react-grid-layout/build/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.bottom = bottom;
    exports.childrenEqual = childrenEqual;
    exports.cloneLayout = cloneLayout;
    exports.cloneLayoutItem = cloneLayoutItem;
    exports.collides = collides;
    exports.compact = compact;
    exports.compactItem = compactItem;
    exports.compactType = compactType;
    exports.correctBounds = correctBounds;
    exports.fastPositionEqual = fastPositionEqual;
    exports.fastRGLPropsEqual = void 0;
    exports.getAllCollisions = getAllCollisions;
    exports.getFirstCollision = getFirstCollision;
    exports.getLayoutItem = getLayoutItem;
    exports.getStatics = getStatics;
    exports.modifyLayout = modifyLayout;
    exports.moveElement = moveElement;
    exports.moveElementAwayFromCollision = moveElementAwayFromCollision;
    exports.noop = void 0;
    exports.perc = perc;
    exports.resizeItemInDirection = resizeItemInDirection;
    exports.setTopLeft = setTopLeft;
    exports.setTransform = setTransform;
    exports.sortLayoutItems = sortLayoutItems;
    exports.sortLayoutItemsByColRow = sortLayoutItemsByColRow;
    exports.sortLayoutItemsByRowCol = sortLayoutItemsByRowCol;
    exports.synchronizeLayoutWithChildren = synchronizeLayoutWithChildren;
    exports.validateLayout = validateLayout;
    exports.withLayoutItem = withLayoutItem;
    var _fastEquals = require_fast_equals();
    var _react = _interopRequireDefault(require_react());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    var isProduction = true;
    var DEBUG = false;
    function bottom(layout) {
      let max = 0, bottomY;
      for (let i = 0, len = layout.length; i < len; i++) {
        bottomY = layout[i].y + layout[i].h;
        if (bottomY > max) max = bottomY;
      }
      return max;
    }
    function cloneLayout(layout) {
      const newLayout = Array(layout.length);
      for (let i = 0, len = layout.length; i < len; i++) {
        newLayout[i] = cloneLayoutItem(layout[i]);
      }
      return newLayout;
    }
    function modifyLayout(layout, layoutItem) {
      const newLayout = Array(layout.length);
      for (let i = 0, len = layout.length; i < len; i++) {
        if (layoutItem.i === layout[i].i) {
          newLayout[i] = layoutItem;
        } else {
          newLayout[i] = layout[i];
        }
      }
      return newLayout;
    }
    function withLayoutItem(layout, itemKey, cb) {
      let item = getLayoutItem(layout, itemKey);
      if (!item) return [layout, null];
      item = cb(cloneLayoutItem(item));
      layout = modifyLayout(layout, item);
      return [layout, item];
    }
    function cloneLayoutItem(layoutItem) {
      return {
        w: layoutItem.w,
        h: layoutItem.h,
        x: layoutItem.x,
        y: layoutItem.y,
        i: layoutItem.i,
        minW: layoutItem.minW,
        maxW: layoutItem.maxW,
        minH: layoutItem.minH,
        maxH: layoutItem.maxH,
        moved: Boolean(layoutItem.moved),
        static: Boolean(layoutItem.static),
        // These can be null/undefined
        isDraggable: layoutItem.isDraggable,
        isResizable: layoutItem.isResizable,
        resizeHandles: layoutItem.resizeHandles,
        isBounded: layoutItem.isBounded
      };
    }
    function childrenEqual(a, b) {
      return (0, _fastEquals.deepEqual)(_react.default.Children.map(a, (c) => c === null || c === void 0 ? void 0 : c.key), _react.default.Children.map(b, (c) => c === null || c === void 0 ? void 0 : c.key)) && (0, _fastEquals.deepEqual)(_react.default.Children.map(a, (c) => c === null || c === void 0 ? void 0 : c.props["data-grid"]), _react.default.Children.map(b, (c) => c === null || c === void 0 ? void 0 : c.props["data-grid"]));
    }
    var fastRGLPropsEqual = exports.fastRGLPropsEqual = require_fastRGLPropsEqual();
    function fastPositionEqual(a, b) {
      return a.left === b.left && a.top === b.top && a.width === b.width && a.height === b.height;
    }
    function collides(l1, l2) {
      if (l1.i === l2.i) return false;
      if (l1.x + l1.w <= l2.x) return false;
      if (l1.x >= l2.x + l2.w) return false;
      if (l1.y + l1.h <= l2.y) return false;
      if (l1.y >= l2.y + l2.h) return false;
      return true;
    }
    function compact(layout, compactType2, cols, allowOverlap) {
      const compareWith = getStatics(layout);
      let b = bottom(compareWith);
      const sorted = sortLayoutItems(layout, compactType2);
      const out = Array(layout.length);
      for (let i = 0, len = sorted.length; i < len; i++) {
        let l = cloneLayoutItem(sorted[i]);
        if (!l.static) {
          l = compactItem(compareWith, l, compactType2, cols, sorted, allowOverlap, b);
          b = Math.max(b, l.y + l.h);
          compareWith.push(l);
        }
        out[layout.indexOf(sorted[i])] = l;
        l.moved = false;
      }
      return out;
    }
    var heightWidth = {
      x: "w",
      y: "h"
    };
    function resolveCompactionCollision(layout, item, moveToCoord, axis) {
      const sizeProp = heightWidth[axis];
      item[axis] += 1;
      const itemIndex = layout.map((layoutItem) => {
        return layoutItem.i;
      }).indexOf(item.i);
      for (let i = itemIndex + 1; i < layout.length; i++) {
        const otherItem = layout[i];
        if (otherItem.static) continue;
        if (otherItem.y > item.y + item.h) break;
        if (collides(item, otherItem)) {
          resolveCompactionCollision(layout, otherItem, moveToCoord + item[sizeProp], axis);
        }
      }
      item[axis] = moveToCoord;
    }
    function compactItem(compareWith, l, compactType2, cols, fullLayout, allowOverlap, b) {
      const compactV = compactType2 === "vertical";
      const compactH = compactType2 === "horizontal";
      if (compactV) {
        if (typeof b === "number") {
          l.y = Math.min(b, l.y);
        } else {
          l.y = Math.min(bottom(compareWith), l.y);
        }
        while (l.y > 0 && !getFirstCollision(compareWith, l)) {
          l.y--;
        }
      } else if (compactH) {
        while (l.x > 0 && !getFirstCollision(compareWith, l)) {
          l.x--;
        }
      }
      let collides2;
      while ((collides2 = getFirstCollision(compareWith, l)) && !(compactType2 === null && allowOverlap)) {
        if (compactH) {
          resolveCompactionCollision(fullLayout, l, collides2.x + collides2.w, "x");
        } else {
          resolveCompactionCollision(fullLayout, l, collides2.y + collides2.h, "y");
        }
        if (compactH && l.x + l.w > cols) {
          l.x = cols - l.w;
          l.y++;
          while (l.x > 0 && !getFirstCollision(compareWith, l)) {
            l.x--;
          }
        }
      }
      l.y = Math.max(l.y, 0);
      l.x = Math.max(l.x, 0);
      return l;
    }
    function correctBounds(layout, bounds) {
      const collidesWith = getStatics(layout);
      for (let i = 0, len = layout.length; i < len; i++) {
        const l = layout[i];
        if (l.x + l.w > bounds.cols) l.x = bounds.cols - l.w;
        if (l.x < 0) {
          l.x = 0;
          l.w = bounds.cols;
        }
        if (!l.static) collidesWith.push(l);
        else {
          while (getFirstCollision(collidesWith, l)) {
            l.y++;
          }
        }
      }
      return layout;
    }
    function getLayoutItem(layout, id) {
      for (let i = 0, len = layout.length; i < len; i++) {
        if (layout[i].i === id) return layout[i];
      }
    }
    function getFirstCollision(layout, layoutItem) {
      for (let i = 0, len = layout.length; i < len; i++) {
        if (collides(layout[i], layoutItem)) return layout[i];
      }
    }
    function getAllCollisions(layout, layoutItem) {
      return layout.filter((l) => collides(l, layoutItem));
    }
    function getStatics(layout) {
      return layout.filter((l) => l.static);
    }
    function moveElement(layout, l, x, y, isUserAction, preventCollision, compactType2, cols, allowOverlap) {
      if (l.static && l.isDraggable !== true) return layout;
      if (l.y === y && l.x === x) return layout;
      log("Moving element ".concat(l.i, " to [").concat(String(x), ",").concat(String(y), "] from [").concat(l.x, ",").concat(l.y, "]"));
      const oldX = l.x;
      const oldY = l.y;
      if (typeof x === "number") l.x = x;
      if (typeof y === "number") l.y = y;
      l.moved = true;
      let sorted = sortLayoutItems(layout, compactType2);
      const movingUp = compactType2 === "vertical" && typeof y === "number" ? oldY >= y : compactType2 === "horizontal" && typeof x === "number" ? oldX >= x : false;
      if (movingUp) sorted = sorted.reverse();
      const collisions = getAllCollisions(sorted, l);
      const hasCollisions = collisions.length > 0;
      if (hasCollisions && allowOverlap) {
        return cloneLayout(layout);
      } else if (hasCollisions && preventCollision) {
        log("Collision prevented on ".concat(l.i, ", reverting."));
        l.x = oldX;
        l.y = oldY;
        l.moved = false;
        return layout;
      }
      for (let i = 0, len = collisions.length; i < len; i++) {
        const collision = collisions[i];
        log("Resolving collision between ".concat(l.i, " at [").concat(l.x, ",").concat(l.y, "] and ").concat(collision.i, " at [").concat(collision.x, ",").concat(collision.y, "]"));
        if (collision.moved) continue;
        if (collision.static) {
          layout = moveElementAwayFromCollision(layout, collision, l, isUserAction, compactType2, cols);
        } else {
          layout = moveElementAwayFromCollision(layout, l, collision, isUserAction, compactType2, cols);
        }
      }
      return layout;
    }
    function moveElementAwayFromCollision(layout, collidesWith, itemToMove, isUserAction, compactType2, cols) {
      const compactH = compactType2 === "horizontal";
      const compactV = compactType2 === "vertical";
      const preventCollision = collidesWith.static;
      if (isUserAction) {
        isUserAction = false;
        const fakeItem = {
          x: compactH ? Math.max(collidesWith.x - itemToMove.w, 0) : itemToMove.x,
          y: compactV ? Math.max(collidesWith.y - itemToMove.h, 0) : itemToMove.y,
          w: itemToMove.w,
          h: itemToMove.h,
          i: "-1"
        };
        const firstCollision = getFirstCollision(layout, fakeItem);
        const collisionNorth = firstCollision && firstCollision.y + firstCollision.h > collidesWith.y;
        const collisionWest = firstCollision && collidesWith.x + collidesWith.w > firstCollision.x;
        if (!firstCollision) {
          log("Doing reverse collision on ".concat(itemToMove.i, " up to [").concat(fakeItem.x, ",").concat(fakeItem.y, "]."));
          return moveElement(layout, itemToMove, compactH ? fakeItem.x : void 0, compactV ? fakeItem.y : void 0, isUserAction, preventCollision, compactType2, cols);
        } else if (collisionNorth && compactV) {
          return moveElement(layout, itemToMove, void 0, itemToMove.y + 1, isUserAction, preventCollision, compactType2, cols);
        } else if (collisionNorth && compactType2 == null) {
          collidesWith.y = itemToMove.y;
          itemToMove.y = itemToMove.y + itemToMove.h;
          return layout;
        } else if (collisionWest && compactH) {
          return moveElement(layout, collidesWith, itemToMove.x, void 0, isUserAction, preventCollision, compactType2, cols);
        }
      }
      const newX = compactH ? itemToMove.x + 1 : void 0;
      const newY = compactV ? itemToMove.y + 1 : void 0;
      if (newX == null && newY == null) {
        return layout;
      }
      return moveElement(layout, itemToMove, compactH ? itemToMove.x + 1 : void 0, compactV ? itemToMove.y + 1 : void 0, isUserAction, preventCollision, compactType2, cols);
    }
    function perc(num) {
      return num * 100 + "%";
    }
    var constrainWidth = (left, currentWidth, newWidth, containerWidth) => {
      return left + newWidth > containerWidth ? currentWidth : newWidth;
    };
    var constrainHeight = (top, currentHeight, newHeight) => {
      return top < 0 ? currentHeight : newHeight;
    };
    var constrainLeft = (left) => Math.max(0, left);
    var constrainTop = (top) => Math.max(0, top);
    var resizeNorth = (currentSize, _ref, _containerWidth) => {
      let {
        left,
        height,
        width
      } = _ref;
      const top = currentSize.top - (height - currentSize.height);
      return {
        left,
        width,
        height: constrainHeight(top, currentSize.height, height),
        top: constrainTop(top)
      };
    };
    var resizeEast = (currentSize, _ref2, containerWidth) => {
      let {
        top,
        left,
        height,
        width
      } = _ref2;
      return {
        top,
        height,
        width: constrainWidth(currentSize.left, currentSize.width, width, containerWidth),
        left: constrainLeft(left)
      };
    };
    var resizeWest = (currentSize, _ref3, containerWidth) => {
      let {
        top,
        height,
        width
      } = _ref3;
      const left = currentSize.left - (width - currentSize.width);
      return {
        height,
        width: left < 0 ? currentSize.width : constrainWidth(currentSize.left, currentSize.width, width, containerWidth),
        top: constrainTop(top),
        left: constrainLeft(left)
      };
    };
    var resizeSouth = (currentSize, _ref4, containerWidth) => {
      let {
        top,
        left,
        height,
        width
      } = _ref4;
      return {
        width,
        left,
        height: constrainHeight(top, currentSize.height, height),
        top: constrainTop(top)
      };
    };
    var resizeNorthEast = function() {
      return resizeNorth(arguments.length <= 0 ? void 0 : arguments[0], resizeEast(...arguments), arguments.length <= 2 ? void 0 : arguments[2]);
    };
    var resizeNorthWest = function() {
      return resizeNorth(arguments.length <= 0 ? void 0 : arguments[0], resizeWest(...arguments), arguments.length <= 2 ? void 0 : arguments[2]);
    };
    var resizeSouthEast = function() {
      return resizeSouth(arguments.length <= 0 ? void 0 : arguments[0], resizeEast(...arguments), arguments.length <= 2 ? void 0 : arguments[2]);
    };
    var resizeSouthWest = function() {
      return resizeSouth(arguments.length <= 0 ? void 0 : arguments[0], resizeWest(...arguments), arguments.length <= 2 ? void 0 : arguments[2]);
    };
    var ordinalResizeHandlerMap = {
      n: resizeNorth,
      ne: resizeNorthEast,
      e: resizeEast,
      se: resizeSouthEast,
      s: resizeSouth,
      sw: resizeSouthWest,
      w: resizeWest,
      nw: resizeNorthWest
    };
    function resizeItemInDirection(direction, currentSize, newSize, containerWidth) {
      const ordinalHandler = ordinalResizeHandlerMap[direction];
      if (!ordinalHandler) return newSize;
      return ordinalHandler(currentSize, _objectSpread(_objectSpread({}, currentSize), newSize), containerWidth);
    }
    function setTransform(_ref5) {
      let {
        top,
        left,
        width,
        height
      } = _ref5;
      const translate = "translate(".concat(left, "px,").concat(top, "px)");
      return {
        transform: translate,
        WebkitTransform: translate,
        MozTransform: translate,
        msTransform: translate,
        OTransform: translate,
        width: "".concat(width, "px"),
        height: "".concat(height, "px"),
        position: "absolute"
      };
    }
    function setTopLeft(_ref6) {
      let {
        top,
        left,
        width,
        height
      } = _ref6;
      return {
        top: "".concat(top, "px"),
        left: "".concat(left, "px"),
        width: "".concat(width, "px"),
        height: "".concat(height, "px"),
        position: "absolute"
      };
    }
    function sortLayoutItems(layout, compactType2) {
      if (compactType2 === "horizontal") return sortLayoutItemsByColRow(layout);
      if (compactType2 === "vertical") return sortLayoutItemsByRowCol(layout);
      else return layout;
    }
    function sortLayoutItemsByRowCol(layout) {
      return layout.slice(0).sort(function(a, b) {
        if (a.y > b.y || a.y === b.y && a.x > b.x) {
          return 1;
        } else if (a.y === b.y && a.x === b.x) {
          return 0;
        }
        return -1;
      });
    }
    function sortLayoutItemsByColRow(layout) {
      return layout.slice(0).sort(function(a, b) {
        if (a.x > b.x || a.x === b.x && a.y > b.y) {
          return 1;
        }
        return -1;
      });
    }
    function synchronizeLayoutWithChildren(initialLayout, children, cols, compactType2, allowOverlap) {
      initialLayout = initialLayout || [];
      const layout = [];
      _react.default.Children.forEach(children, (child) => {
        if ((child === null || child === void 0 ? void 0 : child.key) == null) return;
        const exists = getLayoutItem(initialLayout, String(child.key));
        const g = child.props["data-grid"];
        if (exists && g == null) {
          layout.push(cloneLayoutItem(exists));
        } else {
          if (g) {
            if (!isProduction) {
              validateLayout([g], "ReactGridLayout.children");
            }
            layout.push(cloneLayoutItem(_objectSpread(_objectSpread({}, g), {}, {
              i: child.key
            })));
          } else {
            layout.push(cloneLayoutItem({
              w: 1,
              h: 1,
              x: 0,
              y: bottom(layout),
              i: String(child.key)
            }));
          }
        }
      });
      const correctedLayout = correctBounds(layout, {
        cols
      });
      return allowOverlap ? correctedLayout : compact(correctedLayout, compactType2, cols);
    }
    function validateLayout(layout) {
      let contextName = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "Layout";
      const subProps = ["x", "y", "w", "h"];
      if (!Array.isArray(layout)) throw new Error(contextName + " must be an array!");
      for (let i = 0, len = layout.length; i < len; i++) {
        const item = layout[i];
        for (let j = 0; j < subProps.length; j++) {
          const key = subProps[j];
          const value = item[key];
          if (typeof value !== "number" || Number.isNaN(value)) {
            throw new Error("ReactGridLayout: ".concat(contextName, "[").concat(i, "].").concat(key, " must be a number! Received: ").concat(value, " (").concat(typeof value, ")"));
          }
        }
        if (typeof item.i !== "undefined" && typeof item.i !== "string") {
          throw new Error("ReactGridLayout: ".concat(contextName, "[").concat(i, "].i must be a string! Received: ").concat(item.i, " (").concat(typeof item.i, ")"));
        }
      }
    }
    function compactType(props) {
      const {
        verticalCompact,
        compactType: compactType2
      } = props || {};
      return verticalCompact === false ? null : compactType2;
    }
    function log() {
      if (!DEBUG) return;
      console.log(...arguments);
    }
    var noop = () => {
    };
    exports.noop = noop;
  }
});

// node_modules/react-grid-layout/build/calculateUtils.js
var require_calculateUtils = __commonJS({
  "node_modules/react-grid-layout/build/calculateUtils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.calcGridColWidth = calcGridColWidth;
    exports.calcGridItemPosition = calcGridItemPosition;
    exports.calcGridItemWHPx = calcGridItemWHPx;
    exports.calcWH = calcWH;
    exports.calcXY = calcXY;
    exports.clamp = clamp2;
    function calcGridColWidth(positionParams) {
      const {
        margin,
        containerPadding,
        containerWidth,
        cols
      } = positionParams;
      return (containerWidth - margin[0] * (cols - 1) - containerPadding[0] * 2) / cols;
    }
    function calcGridItemWHPx(gridUnits, colOrRowSize, marginPx) {
      if (!Number.isFinite(gridUnits)) return gridUnits;
      return Math.round(colOrRowSize * gridUnits + Math.max(0, gridUnits - 1) * marginPx);
    }
    function calcGridItemPosition(positionParams, x, y, w, h, state) {
      const {
        margin,
        containerPadding,
        rowHeight
      } = positionParams;
      const colWidth = calcGridColWidth(positionParams);
      const out = {};
      if (state && state.resizing) {
        out.width = Math.round(state.resizing.width);
        out.height = Math.round(state.resizing.height);
      } else {
        out.width = calcGridItemWHPx(w, colWidth, margin[0]);
        out.height = calcGridItemWHPx(h, rowHeight, margin[1]);
      }
      if (state && state.dragging) {
        out.top = Math.round(state.dragging.top);
        out.left = Math.round(state.dragging.left);
      } else if (state && state.resizing && typeof state.resizing.top === "number" && typeof state.resizing.left === "number") {
        out.top = Math.round(state.resizing.top);
        out.left = Math.round(state.resizing.left);
      } else {
        out.top = Math.round((rowHeight + margin[1]) * y + containerPadding[1]);
        out.left = Math.round((colWidth + margin[0]) * x + containerPadding[0]);
      }
      return out;
    }
    function calcXY(positionParams, top, left, w, h) {
      const {
        margin,
        containerPadding,
        cols,
        rowHeight,
        maxRows
      } = positionParams;
      const colWidth = calcGridColWidth(positionParams);
      let x = Math.round((left - containerPadding[0]) / (colWidth + margin[0]));
      let y = Math.round((top - containerPadding[1]) / (rowHeight + margin[1]));
      x = clamp2(x, 0, cols - w);
      y = clamp2(y, 0, maxRows - h);
      return {
        x,
        y
      };
    }
    function calcWH(positionParams, width, height, x, y, handle) {
      const {
        margin,
        maxRows,
        cols,
        rowHeight
      } = positionParams;
      const colWidth = calcGridColWidth(positionParams);
      let w = Math.round((width + margin[0]) / (colWidth + margin[0]));
      let h = Math.round((height + margin[1]) / (rowHeight + margin[1]));
      let _w = clamp2(w, 0, cols - x);
      let _h = clamp2(h, 0, maxRows - y);
      if (["sw", "w", "nw"].indexOf(handle) !== -1) {
        _w = clamp2(w, 0, cols);
      }
      if (["nw", "n", "ne"].indexOf(handle) !== -1) {
        _h = clamp2(h, 0, maxRows);
      }
      return {
        w: _w,
        h: _h
      };
    }
    function clamp2(num, lowerBound, upperBound) {
      return Math.max(Math.min(num, upperBound), lowerBound);
    }
  }
});

// node_modules/prop-types/lib/ReactPropTypesSecret.js
var require_ReactPropTypesSecret = __commonJS({
  "node_modules/prop-types/lib/ReactPropTypesSecret.js"(exports, module) {
    "use strict";
    var ReactPropTypesSecret = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
    module.exports = ReactPropTypesSecret;
  }
});

// node_modules/prop-types/factoryWithThrowingShims.js
var require_factoryWithThrowingShims = __commonJS({
  "node_modules/prop-types/factoryWithThrowingShims.js"(exports, module) {
    "use strict";
    var ReactPropTypesSecret = require_ReactPropTypesSecret();
    function emptyFunction() {
    }
    function emptyFunctionWithReset() {
    }
    emptyFunctionWithReset.resetWarningCache = emptyFunction;
    module.exports = function() {
      function shim(props, propName, componentName, location, propFullName, secret) {
        if (secret === ReactPropTypesSecret) {
          return;
        }
        var err = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        err.name = "Invariant Violation";
        throw err;
      }
      ;
      shim.isRequired = shim;
      function getShim() {
        return shim;
      }
      ;
      var ReactPropTypes = {
        array: shim,
        bigint: shim,
        bool: shim,
        func: shim,
        number: shim,
        object: shim,
        string: shim,
        symbol: shim,
        any: shim,
        arrayOf: getShim,
        element: shim,
        elementType: shim,
        instanceOf: getShim,
        node: shim,
        objectOf: getShim,
        oneOf: getShim,
        oneOfType: getShim,
        shape: getShim,
        exact: getShim,
        checkPropTypes: emptyFunctionWithReset,
        resetWarningCache: emptyFunction
      };
      ReactPropTypes.PropTypes = ReactPropTypes;
      return ReactPropTypes;
    };
  }
});

// node_modules/prop-types/index.js
var require_prop_types = __commonJS({
  "node_modules/prop-types/index.js"(exports, module) {
    if (false) {
      ReactIs = null;
      throwOnDirectAccess = true;
      module.exports = null(ReactIs.isElement, throwOnDirectAccess);
    } else {
      module.exports = require_factoryWithThrowingShims()();
    }
    var ReactIs;
    var throwOnDirectAccess;
  }
});

// node_modules/react-draggable/build/cjs/utils/shims.js
var require_shims = __commonJS({
  "node_modules/react-draggable/build/cjs/utils/shims.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.dontSetMe = dontSetMe;
    exports.findInArray = findInArray;
    exports.int = int;
    exports.isFunction = isFunction;
    exports.isNum = isNum;
    function findInArray(array, callback) {
      for (let i = 0, length = array.length; i < length; i++) {
        if (callback.apply(callback, [array[i], i, array])) return array[i];
      }
    }
    function isFunction(func) {
      return typeof func === "function" || Object.prototype.toString.call(func) === "[object Function]";
    }
    function isNum(num) {
      return typeof num === "number" && !isNaN(num);
    }
    function int(a) {
      return parseInt(a, 10);
    }
    function dontSetMe(props, propName, componentName) {
      if (props[propName]) {
        return new Error(`Invalid prop ${propName} passed to ${componentName} - do not set this, set it on the child.`);
      }
    }
  }
});

// node_modules/react-draggable/build/cjs/utils/getPrefix.js
var require_getPrefix = __commonJS({
  "node_modules/react-draggable/build/cjs/utils/getPrefix.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.browserPrefixToKey = browserPrefixToKey;
    exports.browserPrefixToStyle = browserPrefixToStyle;
    exports.default = void 0;
    exports.getPrefix = getPrefix;
    var prefixes = ["Moz", "Webkit", "O", "ms"];
    function getPrefix() {
      let prop = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "transform";
      if (typeof window === "undefined") return "";
      const style = window.document?.documentElement?.style;
      if (!style) return "";
      if (prop in style) return "";
      for (let i = 0; i < prefixes.length; i++) {
        if (browserPrefixToKey(prop, prefixes[i]) in style) return prefixes[i];
      }
      return "";
    }
    function browserPrefixToKey(prop, prefix) {
      return prefix ? `${prefix}${kebabToTitleCase(prop)}` : prop;
    }
    function browserPrefixToStyle(prop, prefix) {
      return prefix ? `-${prefix.toLowerCase()}-${prop}` : prop;
    }
    function kebabToTitleCase(str) {
      let out = "";
      let shouldCapitalize = true;
      for (let i = 0; i < str.length; i++) {
        if (shouldCapitalize) {
          out += str[i].toUpperCase();
          shouldCapitalize = false;
        } else if (str[i] === "-") {
          shouldCapitalize = true;
        } else {
          out += str[i];
        }
      }
      return out;
    }
    var _default = exports.default = getPrefix();
  }
});

// node_modules/react-draggable/build/cjs/utils/domFns.js
var require_domFns = __commonJS({
  "node_modules/react-draggable/build/cjs/utils/domFns.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.addClassName = addClassName;
    exports.addEvent = addEvent;
    exports.addUserSelectStyles = addUserSelectStyles;
    exports.createCSSTransform = createCSSTransform;
    exports.createSVGTransform = createSVGTransform;
    exports.getTouch = getTouch;
    exports.getTouchIdentifier = getTouchIdentifier;
    exports.getTranslation = getTranslation;
    exports.innerHeight = innerHeight;
    exports.innerWidth = innerWidth;
    exports.matchesSelector = matchesSelector;
    exports.matchesSelectorAndParentsTo = matchesSelectorAndParentsTo;
    exports.offsetXYFromParent = offsetXYFromParent;
    exports.outerHeight = outerHeight;
    exports.outerWidth = outerWidth;
    exports.removeClassName = removeClassName;
    exports.removeEvent = removeEvent;
    exports.scheduleRemoveUserSelectStyles = scheduleRemoveUserSelectStyles;
    var _shims = require_shims();
    var _getPrefix = _interopRequireWildcard(require_getPrefix());
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, default: e2 };
        if (null === e2 || "object" != typeof e2 && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (const t3 in e2) "default" !== t3 && {}.hasOwnProperty.call(e2, t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, t3)) && (i.get || i.set) ? o(f, t3, i) : f[t3] = e2[t3]);
        return f;
      })(e, t);
    }
    var matchesSelectorFunc = "";
    function matchesSelector(el, selector) {
      if (!matchesSelectorFunc) {
        matchesSelectorFunc = (0, _shims.findInArray)(["matches", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector"], function(method) {
          return (0, _shims.isFunction)(el[method]);
        });
      }
      if (!(0, _shims.isFunction)(el[matchesSelectorFunc])) return false;
      return el[matchesSelectorFunc](selector);
    }
    function matchesSelectorAndParentsTo(el, selector, baseNode) {
      let node = el;
      do {
        if (matchesSelector(node, selector)) return true;
        if (node === baseNode) return false;
        node = node.parentNode;
      } while (node);
      return false;
    }
    function addEvent(el, event, handler, inputOptions) {
      if (!el) return;
      const options = {
        capture: true,
        ...inputOptions
      };
      if (el.addEventListener) {
        el.addEventListener(event, handler, options);
      } else if (el.attachEvent) {
        el.attachEvent("on" + event, handler);
      } else {
        el["on" + event] = handler;
      }
    }
    function removeEvent(el, event, handler, inputOptions) {
      if (!el) return;
      const options = {
        capture: true,
        ...inputOptions
      };
      if (el.removeEventListener) {
        el.removeEventListener(event, handler, options);
      } else if (el.detachEvent) {
        el.detachEvent("on" + event, handler);
      } else {
        el["on" + event] = null;
      }
    }
    function outerHeight(node) {
      let height = node.clientHeight;
      const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
      height += (0, _shims.int)(computedStyle.borderTopWidth);
      height += (0, _shims.int)(computedStyle.borderBottomWidth);
      return height;
    }
    function outerWidth(node) {
      let width = node.clientWidth;
      const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
      width += (0, _shims.int)(computedStyle.borderLeftWidth);
      width += (0, _shims.int)(computedStyle.borderRightWidth);
      return width;
    }
    function innerHeight(node) {
      let height = node.clientHeight;
      const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
      height -= (0, _shims.int)(computedStyle.paddingTop);
      height -= (0, _shims.int)(computedStyle.paddingBottom);
      return height;
    }
    function innerWidth(node) {
      let width = node.clientWidth;
      const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
      width -= (0, _shims.int)(computedStyle.paddingLeft);
      width -= (0, _shims.int)(computedStyle.paddingRight);
      return width;
    }
    function offsetXYFromParent(evt, offsetParent, scale) {
      const isBody = offsetParent === offsetParent.ownerDocument.body;
      const offsetParentRect = isBody ? {
        left: 0,
        top: 0
      } : offsetParent.getBoundingClientRect();
      const x = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale;
      const y = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale;
      return {
        x,
        y
      };
    }
    function createCSSTransform(controlPos, positionOffset) {
      const translation = getTranslation(controlPos, positionOffset, "px");
      return {
        [(0, _getPrefix.browserPrefixToKey)("transform", _getPrefix.default)]: translation
      };
    }
    function createSVGTransform(controlPos, positionOffset) {
      const translation = getTranslation(controlPos, positionOffset, "");
      return translation;
    }
    function getTranslation(_ref, positionOffset, unitSuffix) {
      let {
        x,
        y
      } = _ref;
      let translation = `translate(${x}${unitSuffix},${y}${unitSuffix})`;
      if (positionOffset) {
        const defaultX = `${typeof positionOffset.x === "string" ? positionOffset.x : positionOffset.x + unitSuffix}`;
        const defaultY = `${typeof positionOffset.y === "string" ? positionOffset.y : positionOffset.y + unitSuffix}`;
        translation = `translate(${defaultX}, ${defaultY})` + translation;
      }
      return translation;
    }
    function getTouch(e, identifier) {
      return e.targetTouches && (0, _shims.findInArray)(e.targetTouches, (t) => identifier === t.identifier) || e.changedTouches && (0, _shims.findInArray)(e.changedTouches, (t) => identifier === t.identifier);
    }
    function getTouchIdentifier(e) {
      if (e.targetTouches && e.targetTouches[0]) return e.targetTouches[0].identifier;
      if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].identifier;
    }
    function addUserSelectStyles(doc) {
      if (!doc) return;
      let styleEl = doc.getElementById("react-draggable-style-el");
      if (!styleEl) {
        styleEl = doc.createElement("style");
        styleEl.type = "text/css";
        styleEl.id = "react-draggable-style-el";
        styleEl.innerHTML = ".react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n";
        styleEl.innerHTML += ".react-draggable-transparent-selection *::selection {all: inherit;}\n";
        doc.getElementsByTagName("head")[0].appendChild(styleEl);
      }
      if (doc.body) addClassName(doc.body, "react-draggable-transparent-selection");
    }
    function scheduleRemoveUserSelectStyles(doc) {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => {
          removeUserSelectStyles(doc);
        });
      } else {
        removeUserSelectStyles(doc);
      }
    }
    function removeUserSelectStyles(doc) {
      if (!doc) return;
      try {
        if (doc.body) removeClassName(doc.body, "react-draggable-transparent-selection");
        if (doc.selection) {
          doc.selection.empty();
        } else {
          const selection = (doc.defaultView || window).getSelection();
          if (selection && selection.type !== "Caret") {
            selection.removeAllRanges();
          }
        }
      } catch (e) {
      }
    }
    function addClassName(el, className) {
      if (el.classList) {
        el.classList.add(className);
      } else {
        if (!el.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`))) {
          el.className += ` ${className}`;
        }
      }
    }
    function removeClassName(el, className) {
      if (el.classList) {
        el.classList.remove(className);
      } else {
        el.className = el.className.replace(new RegExp(`(?:^|\\s)${className}(?!\\S)`, "g"), "");
      }
    }
  }
});

// node_modules/react-draggable/build/cjs/utils/positionFns.js
var require_positionFns = __commonJS({
  "node_modules/react-draggable/build/cjs/utils/positionFns.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.canDragX = canDragX;
    exports.canDragY = canDragY;
    exports.createCoreData = createCoreData;
    exports.createDraggableData = createDraggableData;
    exports.getBoundPosition = getBoundPosition;
    exports.getControlPosition = getControlPosition;
    exports.snapToGrid = snapToGrid;
    var _shims = require_shims();
    var _domFns = require_domFns();
    function getBoundPosition(draggable, x, y) {
      if (!draggable.props.bounds) return [x, y];
      let {
        bounds
      } = draggable.props;
      bounds = typeof bounds === "string" ? bounds : cloneBounds(bounds);
      const node = findDOMNode(draggable);
      if (typeof bounds === "string") {
        const {
          ownerDocument
        } = node;
        const ownerWindow = ownerDocument.defaultView;
        let boundNode;
        if (bounds === "parent") {
          boundNode = node.parentNode;
        } else {
          const rootNode = node.getRootNode();
          boundNode = rootNode.querySelector(bounds);
        }
        if (!(boundNode instanceof ownerWindow.HTMLElement)) {
          throw new Error('Bounds selector "' + bounds + '" could not find an element.');
        }
        const boundNodeEl = boundNode;
        const nodeStyle = ownerWindow.getComputedStyle(node);
        const boundNodeStyle = ownerWindow.getComputedStyle(boundNodeEl);
        bounds = {
          left: -node.offsetLeft + (0, _shims.int)(boundNodeStyle.paddingLeft) + (0, _shims.int)(nodeStyle.marginLeft),
          top: -node.offsetTop + (0, _shims.int)(boundNodeStyle.paddingTop) + (0, _shims.int)(nodeStyle.marginTop),
          right: (0, _domFns.innerWidth)(boundNodeEl) - (0, _domFns.outerWidth)(node) - node.offsetLeft + (0, _shims.int)(boundNodeStyle.paddingRight) - (0, _shims.int)(nodeStyle.marginRight),
          bottom: (0, _domFns.innerHeight)(boundNodeEl) - (0, _domFns.outerHeight)(node) - node.offsetTop + (0, _shims.int)(boundNodeStyle.paddingBottom) - (0, _shims.int)(nodeStyle.marginBottom)
        };
      }
      if ((0, _shims.isNum)(bounds.right)) x = Math.min(x, bounds.right);
      if ((0, _shims.isNum)(bounds.bottom)) y = Math.min(y, bounds.bottom);
      if ((0, _shims.isNum)(bounds.left)) x = Math.max(x, bounds.left);
      if ((0, _shims.isNum)(bounds.top)) y = Math.max(y, bounds.top);
      return [x, y];
    }
    function snapToGrid(grid, pendingX, pendingY) {
      const x = Math.round(pendingX / grid[0]) * grid[0];
      const y = Math.round(pendingY / grid[1]) * grid[1];
      return [x, y];
    }
    function canDragX(draggable) {
      return draggable.props.axis === "both" || draggable.props.axis === "x";
    }
    function canDragY(draggable) {
      return draggable.props.axis === "both" || draggable.props.axis === "y";
    }
    function getControlPosition(e, touchIdentifier, draggableCore) {
      const touchObj = typeof touchIdentifier === "number" ? (0, _domFns.getTouch)(e, touchIdentifier) : null;
      if (typeof touchIdentifier === "number" && !touchObj) return null;
      const node = findDOMNode(draggableCore);
      const offsetParent = draggableCore.props.offsetParent || node.offsetParent || node.ownerDocument.body;
      return (0, _domFns.offsetXYFromParent)(touchObj || e, offsetParent, draggableCore.props.scale);
    }
    function createCoreData(draggable, x, y) {
      const isStart = !(0, _shims.isNum)(draggable.lastX);
      const node = findDOMNode(draggable);
      if (isStart) {
        return {
          node,
          deltaX: 0,
          deltaY: 0,
          lastX: x,
          lastY: y,
          x,
          y
        };
      } else {
        return {
          node,
          deltaX: x - draggable.lastX,
          deltaY: y - draggable.lastY,
          lastX: draggable.lastX,
          lastY: draggable.lastY,
          x,
          y
        };
      }
    }
    function createDraggableData(draggable, coreData) {
      const scale = draggable.props.scale;
      return {
        node: coreData.node,
        x: draggable.state.x + coreData.deltaX / scale,
        y: draggable.state.y + coreData.deltaY / scale,
        deltaX: coreData.deltaX / scale,
        deltaY: coreData.deltaY / scale,
        lastX: draggable.state.x,
        lastY: draggable.state.y
      };
    }
    function cloneBounds(bounds) {
      return {
        left: bounds.left,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom
      };
    }
    function findDOMNode(draggable) {
      const node = draggable.findDOMNode();
      if (!node) {
        throw new Error("<DraggableCore>: Unmounted during event!");
      }
      return node;
    }
  }
});

// node_modules/react-draggable/build/cjs/utils/log.js
var require_log = __commonJS({
  "node_modules/react-draggable/build/cjs/utils/log.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = log;
    function log() {
      if (void 0) console.log(...arguments);
    }
  }
});

// node_modules/react-draggable/build/cjs/DraggableCore.js
var require_DraggableCore = __commonJS({
  "node_modules/react-draggable/build/cjs/DraggableCore.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React2 = _interopRequireWildcard(require_react());
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _reactDom = _interopRequireDefault(require_react_dom());
    var _domFns = require_domFns();
    var _positionFns = require_positionFns();
    var _shims = require_shims();
    var _log = _interopRequireDefault(require_log());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, default: e2 };
        if (null === e2 || "object" != typeof e2 && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (const t3 in e2) "default" !== t3 && {}.hasOwnProperty.call(e2, t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, t3)) && (i.get || i.set) ? o(f, t3, i) : f[t3] = e2[t3]);
        return f;
      })(e, t);
    }
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    var eventsFor = {
      touch: {
        start: "touchstart",
        move: "touchmove",
        stop: "touchend"
      },
      mouse: {
        start: "mousedown",
        move: "mousemove",
        stop: "mouseup"
      }
    };
    var dragEventFor = eventsFor.mouse;
    var DraggableCore = class extends React2.Component {
      constructor() {
        super(...arguments);
        _defineProperty(this, "dragging", false);
        _defineProperty(this, "lastX", NaN);
        _defineProperty(this, "lastY", NaN);
        _defineProperty(this, "touchIdentifier", null);
        _defineProperty(this, "mounted", false);
        _defineProperty(this, "handleDragStart", (e) => {
          this.props.onMouseDown(e);
          if (!this.props.allowAnyClick && typeof e.button === "number" && e.button !== 0) return false;
          const thisNode = this.findDOMNode();
          if (!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) {
            throw new Error("<DraggableCore> not mounted on DragStart!");
          }
          const {
            ownerDocument
          } = thisNode;
          if (this.props.disabled || !(e.target instanceof ownerDocument.defaultView.Node) || this.props.handle && !(0, _domFns.matchesSelectorAndParentsTo)(e.target, this.props.handle, thisNode) || this.props.cancel && (0, _domFns.matchesSelectorAndParentsTo)(e.target, this.props.cancel, thisNode)) {
            return;
          }
          if (e.type === "touchstart" && !this.props.allowMobileScroll) e.preventDefault();
          const touchIdentifier = (0, _domFns.getTouchIdentifier)(e);
          this.touchIdentifier = touchIdentifier;
          const position = (0, _positionFns.getControlPosition)(e, touchIdentifier, this);
          if (position == null) return;
          const {
            x,
            y
          } = position;
          const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
          (0, _log.default)("DraggableCore: handleDragStart: %j", coreEvent);
          (0, _log.default)("calling", this.props.onStart);
          const shouldUpdate = this.props.onStart(e, coreEvent);
          if (shouldUpdate === false || this.mounted === false) return;
          if (this.props.enableUserSelectHack) (0, _domFns.addUserSelectStyles)(ownerDocument);
          this.dragging = true;
          this.lastX = x;
          this.lastY = y;
          (0, _domFns.addEvent)(ownerDocument, dragEventFor.move, this.handleDrag);
          (0, _domFns.addEvent)(ownerDocument, dragEventFor.stop, this.handleDragStop);
        });
        _defineProperty(this, "handleDrag", (e) => {
          const position = (0, _positionFns.getControlPosition)(e, this.touchIdentifier, this);
          if (position == null) return;
          let {
            x,
            y
          } = position;
          if (Array.isArray(this.props.grid)) {
            let deltaX = x - this.lastX, deltaY = y - this.lastY;
            [deltaX, deltaY] = (0, _positionFns.snapToGrid)(this.props.grid, deltaX, deltaY);
            if (!deltaX && !deltaY) return;
            x = this.lastX + deltaX, y = this.lastY + deltaY;
          }
          const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
          (0, _log.default)("DraggableCore: handleDrag: %j", coreEvent);
          const shouldUpdate = this.props.onDrag(e, coreEvent);
          if (shouldUpdate === false || this.mounted === false) {
            try {
              this.handleDragStop(new MouseEvent("mouseup"));
            } catch (err) {
              const event = document.createEvent("MouseEvents");
              event.initMouseEvent("mouseup", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
              this.handleDragStop(event);
            }
            return;
          }
          this.lastX = x;
          this.lastY = y;
        });
        _defineProperty(this, "handleDragStop", (e) => {
          if (!this.dragging) return;
          const position = (0, _positionFns.getControlPosition)(e, this.touchIdentifier, this);
          if (position == null) return;
          let {
            x,
            y
          } = position;
          if (Array.isArray(this.props.grid)) {
            let deltaX = x - this.lastX || 0;
            let deltaY = y - this.lastY || 0;
            [deltaX, deltaY] = (0, _positionFns.snapToGrid)(this.props.grid, deltaX, deltaY);
            x = this.lastX + deltaX, y = this.lastY + deltaY;
          }
          const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
          const shouldContinue = this.props.onStop(e, coreEvent);
          if (shouldContinue === false || this.mounted === false) return false;
          const thisNode = this.findDOMNode();
          if (thisNode) {
            if (this.props.enableUserSelectHack) (0, _domFns.scheduleRemoveUserSelectStyles)(thisNode.ownerDocument);
          }
          (0, _log.default)("DraggableCore: handleDragStop: %j", coreEvent);
          this.dragging = false;
          this.lastX = NaN;
          this.lastY = NaN;
          if (thisNode) {
            (0, _log.default)("DraggableCore: Removing handlers");
            (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.move, this.handleDrag);
            (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.stop, this.handleDragStop);
          }
        });
        _defineProperty(this, "onMouseDown", (e) => {
          dragEventFor = eventsFor.mouse;
          return this.handleDragStart(e);
        });
        _defineProperty(this, "onMouseUp", (e) => {
          dragEventFor = eventsFor.mouse;
          return this.handleDragStop(e);
        });
        _defineProperty(this, "onTouchStart", (e) => {
          dragEventFor = eventsFor.touch;
          return this.handleDragStart(e);
        });
        _defineProperty(this, "onTouchEnd", (e) => {
          dragEventFor = eventsFor.touch;
          return this.handleDragStop(e);
        });
      }
      componentDidMount() {
        this.mounted = true;
        const thisNode = this.findDOMNode();
        if (thisNode) {
          (0, _domFns.addEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
            passive: false
          });
        }
      }
      componentWillUnmount() {
        this.mounted = false;
        const thisNode = this.findDOMNode();
        if (thisNode) {
          const {
            ownerDocument
          } = thisNode;
          (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.move, this.handleDrag);
          (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.move, this.handleDrag);
          (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
          (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
          (0, _domFns.removeEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
            passive: false
          });
          if (this.props.enableUserSelectHack) (0, _domFns.scheduleRemoveUserSelectStyles)(ownerDocument);
        }
      }
      // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
      // the underlying DOM node ourselves. See the README for more information.
      findDOMNode() {
        return this.props?.nodeRef ? this.props?.nodeRef?.current : _reactDom.default.findDOMNode(this);
      }
      render() {
        return /* @__PURE__ */ React2.cloneElement(React2.Children.only(this.props.children), {
          // Note: mouseMove handler is attached to document so it will still function
          // when the user drags quickly and leaves the bounds of the element.
          onMouseDown: this.onMouseDown,
          onMouseUp: this.onMouseUp,
          // onTouchStart is added on `componentDidMount` so they can be added with
          // {passive: false}, which allows it to cancel. See
          // https://developers.google.com/web/updates/2017/01/scrolling-intervention
          onTouchEnd: this.onTouchEnd
        });
      }
    };
    exports.default = DraggableCore;
    _defineProperty(DraggableCore, "displayName", "DraggableCore");
    _defineProperty(DraggableCore, "propTypes", {
      /**
       * `allowAnyClick` allows dragging using any mouse button.
       * By default, we only accept the left button.
       *
       * Defaults to `false`.
       */
      allowAnyClick: _propTypes.default.bool,
      /**
       * `allowMobileScroll` turns off cancellation of the 'touchstart' event
       * on mobile devices. Only enable this if you are having trouble with click
       * events. Prefer using 'handle' / 'cancel' instead.
       *
       * Defaults to `false`.
       */
      allowMobileScroll: _propTypes.default.bool,
      children: _propTypes.default.node.isRequired,
      /**
       * `disabled`, if true, stops the <Draggable> from dragging. All handlers,
       * with the exception of `onMouseDown`, will not fire.
       */
      disabled: _propTypes.default.bool,
      /**
       * By default, we add 'user-select:none' attributes to the document body
       * to prevent ugly text selection during drag. If this is causing problems
       * for your app, set this to `false`.
       */
      enableUserSelectHack: _propTypes.default.bool,
      /**
       * `offsetParent`, if set, uses the passed DOM node to compute drag offsets
       * instead of using the parent node.
       */
      offsetParent: function(props, propName) {
        if (props[propName] && props[propName].nodeType !== 1) {
          throw new Error("Draggable's offsetParent must be a DOM Node.");
        }
      },
      /**
       * `grid` specifies the x and y that dragging should snap to.
       */
      grid: _propTypes.default.arrayOf(_propTypes.default.number),
      /**
       * `handle` specifies a selector to be used as the handle that initiates drag.
       *
       * Example:
       *
       * ```jsx
       *   let App = React.createClass({
       *       render: function () {
       *         return (
       *            <Draggable handle=".handle">
       *              <div>
       *                  <div className="handle">Click me to drag</div>
       *                  <div>This is some other content</div>
       *              </div>
       *           </Draggable>
       *         );
       *       }
       *   });
       * ```
       */
      handle: _propTypes.default.string,
      /**
       * `cancel` specifies a selector to be used to prevent drag initialization.
       *
       * Example:
       *
       * ```jsx
       *   let App = React.createClass({
       *       render: function () {
       *           return(
       *               <Draggable cancel=".cancel">
       *                   <div>
       *                     <div className="cancel">You can't drag from here</div>
       *                     <div>Dragging here works fine</div>
       *                   </div>
       *               </Draggable>
       *           );
       *       }
       *   });
       * ```
       */
      cancel: _propTypes.default.string,
      /* If running in React Strict mode, ReactDOM.findDOMNode() is deprecated.
       * Unfortunately, in order for <Draggable> to work properly, we need raw access
       * to the underlying DOM node. If you want to avoid the warning, pass a `nodeRef`
       * as in this example:
       *
       * function MyComponent() {
       *   const nodeRef = React.useRef(null);
       *   return (
       *     <Draggable nodeRef={nodeRef}>
       *       <div ref={nodeRef}>Example Target</div>
       *     </Draggable>
       *   );
       * }
       *
       * This can be used for arbitrarily nested components, so long as the ref ends up
       * pointing to the actual child DOM node and not a custom component.
       */
      nodeRef: _propTypes.default.object,
      /**
       * Called when dragging starts.
       * If this function returns the boolean false, dragging will be canceled.
       */
      onStart: _propTypes.default.func,
      /**
       * Called while dragging.
       * If this function returns the boolean false, dragging will be canceled.
       */
      onDrag: _propTypes.default.func,
      /**
       * Called when dragging stops.
       * If this function returns the boolean false, the drag will remain active.
       */
      onStop: _propTypes.default.func,
      /**
       * A workaround option which can be passed if onMouseDown needs to be accessed,
       * since it'll always be blocked (as there is internal use of onMouseDown)
       */
      onMouseDown: _propTypes.default.func,
      /**
       * `scale`, if set, applies scaling while dragging an element
       */
      scale: _propTypes.default.number,
      /**
       * These properties should be defined on the child, not here.
       */
      className: _shims.dontSetMe,
      style: _shims.dontSetMe,
      transform: _shims.dontSetMe
    });
    _defineProperty(DraggableCore, "defaultProps", {
      allowAnyClick: false,
      // by default only accept left click
      allowMobileScroll: false,
      disabled: false,
      enableUserSelectHack: true,
      onStart: function() {
      },
      onDrag: function() {
      },
      onStop: function() {
      },
      onMouseDown: function() {
      },
      scale: 1
    });
  }
});

// node_modules/react-draggable/build/cjs/Draggable.js
var require_Draggable = __commonJS({
  "node_modules/react-draggable/build/cjs/Draggable.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "DraggableCore", {
      enumerable: true,
      get: function() {
        return _DraggableCore.default;
      }
    });
    exports.default = void 0;
    var React2 = _interopRequireWildcard(require_react());
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _reactDom = _interopRequireDefault(require_react_dom());
    var _clsx = require_clsx();
    var _domFns = require_domFns();
    var _positionFns = require_positionFns();
    var _shims = require_shims();
    var _DraggableCore = _interopRequireDefault(require_DraggableCore());
    var _log = _interopRequireDefault(require_log());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, default: e2 };
        if (null === e2 || "object" != typeof e2 && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (const t3 in e2) "default" !== t3 && {}.hasOwnProperty.call(e2, t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, t3)) && (i.get || i.set) ? o(f, t3, i) : f[t3] = e2[t3]);
        return f;
      })(e, t);
    }
    function _extends() {
      return _extends = Object.assign ? Object.assign.bind() : function(n) {
        for (var e = 1; e < arguments.length; e++) {
          var t = arguments[e];
          for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
        }
        return n;
      }, _extends.apply(null, arguments);
    }
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    var Draggable = class extends React2.Component {
      // React 16.3+
      // Arity (props, state)
      static getDerivedStateFromProps(_ref, _ref2) {
        let {
          position
        } = _ref;
        let {
          prevPropsPosition
        } = _ref2;
        if (position && (!prevPropsPosition || position.x !== prevPropsPosition.x || position.y !== prevPropsPosition.y)) {
          (0, _log.default)("Draggable: getDerivedStateFromProps %j", {
            position,
            prevPropsPosition
          });
          return {
            x: position.x,
            y: position.y,
            prevPropsPosition: {
              ...position
            }
          };
        }
        return null;
      }
      constructor(props) {
        super(props);
        _defineProperty(this, "onDragStart", (e, coreData) => {
          (0, _log.default)("Draggable: onDragStart: %j", coreData);
          const shouldStart = this.props.onStart(e, (0, _positionFns.createDraggableData)(this, coreData));
          if (shouldStart === false) return false;
          this.setState({
            dragging: true,
            dragged: true
          });
        });
        _defineProperty(this, "onDrag", (e, coreData) => {
          if (!this.state.dragging) return false;
          (0, _log.default)("Draggable: onDrag: %j", coreData);
          const uiData = (0, _positionFns.createDraggableData)(this, coreData);
          const newState = {
            x: uiData.x,
            y: uiData.y,
            slackX: 0,
            slackY: 0
          };
          if (this.props.bounds) {
            const {
              x,
              y
            } = newState;
            newState.x += this.state.slackX;
            newState.y += this.state.slackY;
            const [newStateX, newStateY] = (0, _positionFns.getBoundPosition)(this, newState.x, newState.y);
            newState.x = newStateX;
            newState.y = newStateY;
            newState.slackX = this.state.slackX + (x - newState.x);
            newState.slackY = this.state.slackY + (y - newState.y);
            uiData.x = newState.x;
            uiData.y = newState.y;
            uiData.deltaX = newState.x - this.state.x;
            uiData.deltaY = newState.y - this.state.y;
          }
          const shouldUpdate = this.props.onDrag(e, uiData);
          if (shouldUpdate === false) return false;
          this.setState(newState);
        });
        _defineProperty(this, "onDragStop", (e, coreData) => {
          if (!this.state.dragging) return false;
          const shouldContinue = this.props.onStop(e, (0, _positionFns.createDraggableData)(this, coreData));
          if (shouldContinue === false) return false;
          (0, _log.default)("Draggable: onDragStop: %j", coreData);
          const newState = {
            dragging: false,
            slackX: 0,
            slackY: 0
          };
          const controlled = Boolean(this.props.position);
          if (controlled) {
            const {
              x,
              y
            } = this.props.position;
            newState.x = x;
            newState.y = y;
          }
          this.setState(newState);
        });
        this.state = {
          // Whether or not we are currently dragging.
          dragging: false,
          // Whether or not we have been dragged before.
          dragged: false,
          // Current transform x and y.
          x: props.position ? props.position.x : props.defaultPosition.x,
          y: props.position ? props.position.y : props.defaultPosition.y,
          prevPropsPosition: {
            ...props.position
          },
          // Used for compensating for out-of-bounds drags
          slackX: 0,
          slackY: 0,
          // Can only determine if SVG after mounting
          isElementSVG: false
        };
        if (props.position && !(props.onDrag || props.onStop)) {
          console.warn("A `position` was applied to this <Draggable>, without drag handlers. This will make this component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element.");
        }
      }
      componentDidMount() {
        if (typeof window.SVGElement !== "undefined" && this.findDOMNode() instanceof window.SVGElement) {
          this.setState({
            isElementSVG: true
          });
        }
      }
      componentWillUnmount() {
        if (this.state.dragging) {
          this.setState({
            dragging: false
          });
        }
      }
      // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
      // the underlying DOM node ourselves. See the README for more information.
      findDOMNode() {
        return this.props?.nodeRef?.current ?? _reactDom.default.findDOMNode(this);
      }
      render() {
        const {
          axis,
          bounds,
          children,
          defaultPosition,
          defaultClassName,
          defaultClassNameDragging,
          defaultClassNameDragged,
          position,
          positionOffset,
          scale,
          ...draggableCoreProps
        } = this.props;
        let style = {};
        let svgTransform = null;
        const controlled = Boolean(position);
        const draggable = !controlled || this.state.dragging;
        const validPosition = position || defaultPosition;
        const transformOpts = {
          // Set left if horizontal drag is enabled
          x: (0, _positionFns.canDragX)(this) && draggable ? this.state.x : validPosition.x,
          // Set top if vertical drag is enabled
          y: (0, _positionFns.canDragY)(this) && draggable ? this.state.y : validPosition.y
        };
        if (this.state.isElementSVG) {
          svgTransform = (0, _domFns.createSVGTransform)(transformOpts, positionOffset);
        } else {
          style = (0, _domFns.createCSSTransform)(transformOpts, positionOffset);
        }
        const className = (0, _clsx.clsx)(children.props.className || "", defaultClassName, {
          [defaultClassNameDragging]: this.state.dragging,
          [defaultClassNameDragged]: this.state.dragged
        });
        return /* @__PURE__ */ React2.createElement(_DraggableCore.default, _extends({}, draggableCoreProps, {
          onStart: this.onDragStart,
          onDrag: this.onDrag,
          onStop: this.onDragStop
        }), /* @__PURE__ */ React2.cloneElement(React2.Children.only(children), {
          className,
          style: {
            ...children.props.style,
            ...style
          },
          transform: svgTransform
        }));
      }
    };
    exports.default = Draggable;
    _defineProperty(Draggable, "displayName", "Draggable");
    _defineProperty(Draggable, "propTypes", {
      // Accepts all props <DraggableCore> accepts.
      ..._DraggableCore.default.propTypes,
      /**
       * `axis` determines which axis the draggable can move.
       *
       *  Note that all callbacks will still return data as normal. This only
       *  controls flushing to the DOM.
       *
       * 'both' allows movement horizontally and vertically.
       * 'x' limits movement to horizontal axis.
       * 'y' limits movement to vertical axis.
       * 'none' limits all movement.
       *
       * Defaults to 'both'.
       */
      axis: _propTypes.default.oneOf(["both", "x", "y", "none"]),
      /**
       * `bounds` determines the range of movement available to the element.
       * Available values are:
       *
       * 'parent' restricts movement within the Draggable's parent node.
       *
       * Alternatively, pass an object with the following properties, all of which are optional:
       *
       * {left: LEFT_BOUND, right: RIGHT_BOUND, bottom: BOTTOM_BOUND, top: TOP_BOUND}
       *
       * All values are in px.
       *
       * Example:
       *
       * ```jsx
       *   let App = React.createClass({
       *       render: function () {
       *         return (
       *            <Draggable bounds={{right: 300, bottom: 300}}>
       *              <div>Content</div>
       *           </Draggable>
       *         );
       *       }
       *   });
       * ```
       */
      bounds: _propTypes.default.oneOfType([_propTypes.default.shape({
        left: _propTypes.default.number,
        right: _propTypes.default.number,
        top: _propTypes.default.number,
        bottom: _propTypes.default.number
      }), _propTypes.default.string, _propTypes.default.oneOf([false])]),
      defaultClassName: _propTypes.default.string,
      defaultClassNameDragging: _propTypes.default.string,
      defaultClassNameDragged: _propTypes.default.string,
      /**
       * `defaultPosition` specifies the x and y that the dragged item should start at
       *
       * Example:
       *
       * ```jsx
       *      let App = React.createClass({
       *          render: function () {
       *              return (
       *                  <Draggable defaultPosition={{x: 25, y: 25}}>
       *                      <div>I start with transformX: 25px and transformY: 25px;</div>
       *                  </Draggable>
       *              );
       *          }
       *      });
       * ```
       */
      defaultPosition: _propTypes.default.shape({
        x: _propTypes.default.number,
        y: _propTypes.default.number
      }),
      positionOffset: _propTypes.default.shape({
        x: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
        y: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
      }),
      /**
       * `position`, if present, defines the current position of the element.
       *
       *  This is similar to how form elements in React work - if no `position` is supplied, the component
       *  is uncontrolled.
       *
       * Example:
       *
       * ```jsx
       *      let App = React.createClass({
       *          render: function () {
       *              return (
       *                  <Draggable position={{x: 25, y: 25}}>
       *                      <div>I start with transformX: 25px and transformY: 25px;</div>
       *                  </Draggable>
       *              );
       *          }
       *      });
       * ```
       */
      position: _propTypes.default.shape({
        x: _propTypes.default.number,
        y: _propTypes.default.number
      }),
      /**
       * These properties should be defined on the child, not here.
       */
      className: _shims.dontSetMe,
      style: _shims.dontSetMe,
      transform: _shims.dontSetMe
    });
    _defineProperty(Draggable, "defaultProps", {
      ..._DraggableCore.default.defaultProps,
      axis: "both",
      bounds: false,
      defaultClassName: "react-draggable",
      defaultClassNameDragging: "react-draggable-dragging",
      defaultClassNameDragged: "react-draggable-dragged",
      defaultPosition: {
        x: 0,
        y: 0
      },
      scale: 1
    });
  }
});

// node_modules/react-draggable/build/cjs/cjs.js
var require_cjs = __commonJS({
  "node_modules/react-draggable/build/cjs/cjs.js"(exports, module) {
    "use strict";
    var {
      default: Draggable,
      DraggableCore
    } = require_Draggable();
    module.exports = Draggable;
    module.exports.default = Draggable;
    module.exports.DraggableCore = DraggableCore;
  }
});

// node_modules/react-resizable/build/utils.js
var require_utils2 = __commonJS({
  "node_modules/react-resizable/build/utils.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.cloneElement = cloneElement;
    var _react = _interopRequireDefault(require_react());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    function cloneElement(element, props) {
      if (props.style && element.props.style) {
        props.style = _objectSpread(_objectSpread({}, element.props.style), props.style);
      }
      if (props.className && element.props.className) {
        props.className = `${element.props.className} ${props.className}`;
      }
      return /* @__PURE__ */ _react.default.cloneElement(element, props);
    }
  }
});

// node_modules/react-resizable/build/propTypes.js
var require_propTypes = __commonJS({
  "node_modules/react-resizable/build/propTypes.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.resizableProps = void 0;
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _reactDraggable = require_cjs();
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var resizableProps = exports.resizableProps = {
      /*
      * Restricts resizing to a particular axis (default: 'both')
      * 'both' - allows resizing by width or height
      * 'x' - only allows the width to be changed
      * 'y' - only allows the height to be changed
      * 'none' - disables resizing altogether
      * */
      axis: _propTypes.default.oneOf(["both", "x", "y", "none"]),
      className: _propTypes.default.string,
      /*
      * Require that one and only one child be present.
      * */
      children: _propTypes.default.element.isRequired,
      /*
      * These will be passed wholesale to react-draggable's DraggableCore
      * */
      draggableOpts: _propTypes.default.shape({
        allowAnyClick: _propTypes.default.bool,
        cancel: _propTypes.default.string,
        children: _propTypes.default.node,
        disabled: _propTypes.default.bool,
        enableUserSelectHack: _propTypes.default.bool,
        // #251: Check for Element to support SSR environments where DOM globals don't exist
        offsetParent: typeof Element !== "undefined" ? _propTypes.default.instanceOf(Element) : _propTypes.default.any,
        grid: _propTypes.default.arrayOf(_propTypes.default.number),
        handle: _propTypes.default.string,
        nodeRef: _propTypes.default.object,
        onStart: _propTypes.default.func,
        onDrag: _propTypes.default.func,
        onStop: _propTypes.default.func,
        onMouseDown: _propTypes.default.func,
        scale: _propTypes.default.number
      }),
      /*
      * Initial height
      * */
      height: function() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        const [props] = args;
        if (props.axis === "both" || props.axis === "y") {
          return _propTypes.default.number.isRequired(...args);
        }
        return _propTypes.default.number(...args);
      },
      /*
      * Customize cursor resize handle
      * */
      handle: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.func]),
      /*
      * If you change this, be sure to update your css
      * */
      handleSize: _propTypes.default.arrayOf(_propTypes.default.number),
      lockAspectRatio: _propTypes.default.bool,
      /*
      * Max X & Y measure
      * */
      maxConstraints: _propTypes.default.arrayOf(_propTypes.default.number),
      /*
      * Min X & Y measure
      * */
      minConstraints: _propTypes.default.arrayOf(_propTypes.default.number),
      /*
      * Called on stop resize event
      * */
      onResizeStop: _propTypes.default.func,
      /*
      * Called on start resize event
      * */
      onResizeStart: _propTypes.default.func,
      /*
      * Called on resize event
      * */
      onResize: _propTypes.default.func,
      /*
      * Defines which resize handles should be rendered (default: 'se')
      * 's' - South handle (bottom-center)
      * 'w' - West handle (left-center)
      * 'e' - East handle (right-center)
      * 'n' - North handle (top-center)
      * 'sw' - Southwest handle (bottom-left)
      * 'nw' - Northwest handle (top-left)
      * 'se' - Southeast handle (bottom-right)
      * 'ne' - Northeast handle (top-center)
      * */
      resizeHandles: _propTypes.default.arrayOf(_propTypes.default.oneOf(["s", "w", "e", "n", "sw", "nw", "se", "ne"])),
      /*
      * If `transform: scale(n)` is set on the parent, this should be set to `n`.
      * */
      transformScale: _propTypes.default.number,
      /*
       * Initial width
       */
      width: function() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        const [props] = args;
        if (props.axis === "both" || props.axis === "x") {
          return _propTypes.default.number.isRequired(...args);
        }
        return _propTypes.default.number(...args);
      }
    };
  }
});

// node_modules/react-resizable/build/Resizable.js
var require_Resizable = __commonJS({
  "node_modules/react-resizable/build/Resizable.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.default = void 0;
    var React2 = _interopRequireWildcard(require_react());
    var _reactDraggable = require_cjs();
    var _utils = require_utils2();
    var _propTypes = require_propTypes();
    var _excluded = ["children", "className", "draggableOpts", "width", "height", "handle", "handleSize", "lockAspectRatio", "axis", "minConstraints", "maxConstraints", "onResize", "onResizeStop", "onResizeStart", "resizeHandles", "transformScale"];
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, default: e2 };
        if (null === e2 || "object" != typeof e2 && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (const t3 in e2) "default" !== t3 && {}.hasOwnProperty.call(e2, t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, t3)) && (i.get || i.set) ? o(f, t3, i) : f[t3] = e2[t3]);
        return f;
      })(e, t);
    }
    function _extends() {
      return _extends = Object.assign ? Object.assign.bind() : function(n) {
        for (var e = 1; e < arguments.length; e++) {
          var t = arguments[e];
          for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
        }
        return n;
      }, _extends.apply(null, arguments);
    }
    function _objectWithoutProperties(e, t) {
      if (null == e) return {};
      var o, r, i = _objectWithoutPropertiesLoose(e, t);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
      }
      return i;
    }
    function _objectWithoutPropertiesLoose(r, e) {
      if (null == r) return {};
      var t = {};
      for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
        if (-1 !== e.indexOf(n)) continue;
        t[n] = r[n];
      }
      return t;
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    var Resizable = class extends React2.Component {
      constructor() {
        super(...arguments);
        this.handleRefs = {};
        this.lastHandleRect = null;
        this.slack = null;
        this.lastSize = null;
      }
      componentWillUnmount() {
        this.resetData();
      }
      resetData() {
        this.lastHandleRect = this.slack = this.lastSize = null;
      }
      // Clamp width and height within provided constraints
      runConstraints(width, height) {
        const {
          minConstraints,
          maxConstraints,
          lockAspectRatio
        } = this.props;
        if (!minConstraints && !maxConstraints && !lockAspectRatio) return [width, height];
        if (lockAspectRatio) {
          const ratio = this.props.width / this.props.height;
          const deltaW = width - this.props.width;
          const deltaH = height - this.props.height;
          if (Math.abs(deltaW) > Math.abs(deltaH * ratio)) {
            height = width / ratio;
          } else {
            width = height * ratio;
          }
        }
        const [oldW, oldH] = [width, height];
        let [slackW, slackH] = this.slack || [0, 0];
        width += slackW;
        height += slackH;
        if (minConstraints) {
          width = Math.max(minConstraints[0], width);
          height = Math.max(minConstraints[1], height);
        }
        if (maxConstraints) {
          width = Math.min(maxConstraints[0], width);
          height = Math.min(maxConstraints[1], height);
        }
        this.slack = [slackW + (oldW - width), slackH + (oldH - height)];
        return [width, height];
      }
      /**
       * Wrapper around drag events to provide more useful data.
       *
       * @param  {String} handlerName Handler name to wrap.
       * @return {Function}           Handler function.
       */
      resizeHandler(handlerName, axis) {
        return (e, _ref) => {
          let {
            node,
            deltaX,
            deltaY
          } = _ref;
          if (handlerName === "onResizeStart") this.resetData();
          const canDragX = (this.props.axis === "both" || this.props.axis === "x") && axis !== "n" && axis !== "s";
          const canDragY = (this.props.axis === "both" || this.props.axis === "y") && axis !== "e" && axis !== "w";
          if (!canDragX && !canDragY) return;
          const axisV = axis[0];
          const axisH = axis[axis.length - 1];
          const handleRect = node.getBoundingClientRect();
          if (this.lastHandleRect != null) {
            if (axisH === "w") {
              const deltaLeftSinceLast = handleRect.left - this.lastHandleRect.left;
              deltaX += deltaLeftSinceLast;
            }
            if (axisV === "n") {
              const deltaTopSinceLast = handleRect.top - this.lastHandleRect.top;
              deltaY += deltaTopSinceLast;
            }
          }
          this.lastHandleRect = handleRect;
          if (axisH === "w") deltaX = -deltaX;
          if (axisV === "n") deltaY = -deltaY;
          let width = this.props.width + (canDragX ? deltaX / this.props.transformScale : 0);
          let height = this.props.height + (canDragY ? deltaY / this.props.transformScale : 0);
          [width, height] = this.runConstraints(width, height);
          if (handlerName === "onResizeStop" && this.lastSize) {
            ({
              width,
              height
            } = this.lastSize);
          }
          const dimensionsChanged = width !== this.props.width || height !== this.props.height;
          if (handlerName !== "onResizeStop") {
            this.lastSize = {
              width,
              height
            };
          }
          const cb = typeof this.props[handlerName] === "function" ? this.props[handlerName] : null;
          const shouldSkipCb = handlerName === "onResize" && !dimensionsChanged;
          if (cb && !shouldSkipCb) {
            e.persist?.();
            cb(e, {
              node,
              size: {
                width,
                height
              },
              handle: axis
            });
          }
          if (handlerName === "onResizeStop") this.resetData();
        };
      }
      // Render a resize handle given an axis & DOM ref. Ref *must* be attached for
      // the underlying draggable library to work properly.
      renderResizeHandle(handleAxis, ref) {
        const {
          handle
        } = this.props;
        if (!handle) {
          return /* @__PURE__ */ React2.createElement("span", {
            className: `react-resizable-handle react-resizable-handle-${handleAxis}`,
            ref
          });
        }
        if (typeof handle === "function") {
          return handle(handleAxis, ref);
        }
        const isDOMElement = typeof handle.type === "string";
        const props = _objectSpread({
          ref
        }, isDOMElement ? {} : {
          handleAxis
        });
        return /* @__PURE__ */ React2.cloneElement(handle, props);
      }
      render() {
        const _this$props = this.props, {
          children,
          className,
          draggableOpts,
          width,
          height,
          handle,
          handleSize,
          lockAspectRatio,
          axis,
          minConstraints,
          maxConstraints,
          onResize,
          onResizeStop,
          onResizeStart,
          resizeHandles,
          transformScale
        } = _this$props, p = _objectWithoutProperties(_this$props, _excluded);
        return (0, _utils.cloneElement)(children, _objectSpread(_objectSpread({}, p), {}, {
          className: `${className ? `${className} ` : ""}react-resizable`,
          children: [...React2.Children.toArray(children.props.children), ...resizeHandles.map((handleAxis) => {
            const ref = this.handleRefs[handleAxis] ?? (this.handleRefs[handleAxis] = /* @__PURE__ */ React2.createRef());
            return /* @__PURE__ */ React2.createElement(_reactDraggable.DraggableCore, _extends({}, draggableOpts, {
              nodeRef: ref,
              key: `resizableHandle-${handleAxis}`,
              onStop: this.resizeHandler("onResizeStop", handleAxis),
              onStart: this.resizeHandler("onResizeStart", handleAxis),
              onDrag: this.resizeHandler("onResize", handleAxis)
            }), this.renderResizeHandle(handleAxis, ref));
          })]
        }));
      }
    };
    exports.default = Resizable;
    Resizable.propTypes = _propTypes.resizableProps;
    Resizable.defaultProps = {
      axis: "both",
      handleSize: [20, 20],
      lockAspectRatio: false,
      minConstraints: [20, 20],
      maxConstraints: [Infinity, Infinity],
      resizeHandles: ["se"],
      transformScale: 1
    };
  }
});

// node_modules/react-resizable/build/ResizableBox.js
var require_ResizableBox = __commonJS({
  "node_modules/react-resizable/build/ResizableBox.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.default = void 0;
    var React2 = _interopRequireWildcard(require_react());
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _Resizable = _interopRequireDefault(require_Resizable());
    var _propTypes2 = require_propTypes();
    var _excluded = ["handle", "handleSize", "onResize", "onResizeStart", "onResizeStop", "draggableOpts", "minConstraints", "maxConstraints", "lockAspectRatio", "axis", "width", "height", "resizeHandles", "style", "transformScale"];
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, default: e2 };
        if (null === e2 || "object" != typeof e2 && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (const t3 in e2) "default" !== t3 && {}.hasOwnProperty.call(e2, t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, t3)) && (i.get || i.set) ? o(f, t3, i) : f[t3] = e2[t3]);
        return f;
      })(e, t);
    }
    function _extends() {
      return _extends = Object.assign ? Object.assign.bind() : function(n) {
        for (var e = 1; e < arguments.length; e++) {
          var t = arguments[e];
          for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
        }
        return n;
      }, _extends.apply(null, arguments);
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    function _objectWithoutProperties(e, t) {
      if (null == e) return {};
      var o, r, i = _objectWithoutPropertiesLoose(e, t);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
      }
      return i;
    }
    function _objectWithoutPropertiesLoose(r, e) {
      if (null == r) return {};
      var t = {};
      for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
        if (-1 !== e.indexOf(n)) continue;
        t[n] = r[n];
      }
      return t;
    }
    var ResizableBox = class extends React2.Component {
      constructor() {
        super(...arguments);
        this.state = {
          width: this.props.width,
          height: this.props.height,
          propsWidth: this.props.width,
          propsHeight: this.props.height
        };
        this.onResize = (e, data) => {
          const {
            size
          } = data;
          if (this.props.onResize) {
            e.persist?.();
            this.setState(size, () => this.props.onResize && this.props.onResize(e, data));
          } else {
            this.setState(size);
          }
        };
      }
      static getDerivedStateFromProps(props, state) {
        if (state.propsWidth !== props.width || state.propsHeight !== props.height) {
          return {
            width: props.width,
            height: props.height,
            propsWidth: props.width,
            propsHeight: props.height
          };
        }
        return null;
      }
      render() {
        const _this$props = this.props, {
          handle,
          handleSize,
          onResize,
          onResizeStart,
          onResizeStop,
          draggableOpts,
          minConstraints,
          maxConstraints,
          lockAspectRatio,
          axis,
          width,
          height,
          resizeHandles,
          style,
          transformScale
        } = _this$props, props = _objectWithoutProperties(_this$props, _excluded);
        return /* @__PURE__ */ React2.createElement(_Resizable.default, {
          axis,
          draggableOpts,
          handle,
          handleSize,
          height: this.state.height,
          lockAspectRatio,
          maxConstraints,
          minConstraints,
          onResizeStart,
          onResize: this.onResize,
          onResizeStop,
          resizeHandles,
          transformScale,
          width: this.state.width
        }, /* @__PURE__ */ React2.createElement("div", _extends({}, props, {
          style: _objectSpread(_objectSpread({}, style), {}, {
            width: this.state.width + "px",
            height: this.state.height + "px"
          })
        })));
      }
    };
    exports.default = ResizableBox;
    ResizableBox.propTypes = _objectSpread(_objectSpread({}, _propTypes2.resizableProps), {}, {
      children: _propTypes.default.element
    });
  }
});

// node_modules/react-resizable/index.js
var require_react_resizable = __commonJS({
  "node_modules/react-resizable/index.js"(exports, module) {
    "use strict";
    module.exports = function() {
      throw new Error("Don't instantiate Resizable directly! Use require('react-resizable').Resizable");
    };
    module.exports.Resizable = require_Resizable().default;
    module.exports.ResizableBox = require_ResizableBox().default;
  }
});

// node_modules/react-grid-layout/build/ReactGridLayoutPropTypes.js
var require_ReactGridLayoutPropTypes = __commonJS({
  "node_modules/react-grid-layout/build/ReactGridLayoutPropTypes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.resizeHandleType = exports.resizeHandleAxesType = exports.default = void 0;
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _react = _interopRequireDefault(require_react());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var resizeHandleAxesType = exports.resizeHandleAxesType = _propTypes.default.arrayOf(_propTypes.default.oneOf(["s", "w", "e", "n", "sw", "nw", "se", "ne"]));
    var resizeHandleType = exports.resizeHandleType = _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.func]);
    var _default = exports.default = {
      //
      // Basic props
      //
      className: _propTypes.default.string,
      style: _propTypes.default.object,
      // This can be set explicitly. If it is not set, it will automatically
      // be set to the container width. Note that resizes will *not* cause this to adjust.
      // If you need that behavior, use WidthProvider.
      width: _propTypes.default.number,
      // If true, the container height swells and contracts to fit contents
      autoSize: _propTypes.default.bool,
      // # of cols.
      cols: _propTypes.default.number,
      // A selector that will not be draggable.
      draggableCancel: _propTypes.default.string,
      // A selector for the draggable handler
      draggableHandle: _propTypes.default.string,
      // Deprecated
      verticalCompact: function(props) {
        if (props.verticalCompact === false && false) {
          console.warn(
            // eslint-disable-line no-console
            '`verticalCompact` on <ReactGridLayout> is deprecated and will be removed soon. Use `compactType`: "horizontal" | "vertical" | null.'
          );
        }
      },
      // Choose vertical or hotizontal compaction
      compactType: _propTypes.default.oneOf(["vertical", "horizontal"]),
      // layout is an array of object with the format:
      // {x: Number, y: Number, w: Number, h: Number, i: String}
      layout: function(props) {
        var layout = props.layout;
        if (layout === void 0) return;
        require_utils().validateLayout(layout, "layout");
      },
      //
      // Grid Dimensions
      //
      // Margin between items [x, y] in px
      margin: _propTypes.default.arrayOf(_propTypes.default.number),
      // Padding inside the container [x, y] in px
      containerPadding: _propTypes.default.arrayOf(_propTypes.default.number),
      // Rows have a static height, but you can change this based on breakpoints if you like
      rowHeight: _propTypes.default.number,
      // Default Infinity, but you can specify a max here if you like.
      // Note that this isn't fully fleshed out and won't error if you specify a layout that
      // extends beyond the row capacity. It will, however, not allow users to drag/resize
      // an item past the barrier. They can push items beyond the barrier, though.
      // Intentionally not documented for this reason.
      maxRows: _propTypes.default.number,
      //
      // Flags
      //
      isBounded: _propTypes.default.bool,
      isDraggable: _propTypes.default.bool,
      isResizable: _propTypes.default.bool,
      // If true, grid can be placed one over the other.
      allowOverlap: _propTypes.default.bool,
      // If true, grid items won't change position when being dragged over.
      preventCollision: _propTypes.default.bool,
      // Use CSS transforms instead of top/left
      useCSSTransforms: _propTypes.default.bool,
      // parent layout transform scale
      transformScale: _propTypes.default.number,
      // If true, an external element can trigger onDrop callback with a specific grid position as a parameter
      isDroppable: _propTypes.default.bool,
      // Resize handle options
      resizeHandles: resizeHandleAxesType,
      resizeHandle: resizeHandleType,
      //
      // Callbacks
      //
      // Callback so you can save the layout. Calls after each drag & resize stops.
      onLayoutChange: _propTypes.default.func,
      // Calls when drag starts. Callback is of the signature (layout, oldItem, newItem, placeholder, e, ?node).
      // All callbacks below have the same signature. 'start' and 'stop' callbacks omit the 'placeholder'.
      onDragStart: _propTypes.default.func,
      // Calls on each drag movement.
      onDrag: _propTypes.default.func,
      // Calls when drag is complete.
      onDragStop: _propTypes.default.func,
      //Calls when resize starts.
      onResizeStart: _propTypes.default.func,
      // Calls when resize movement happens.
      onResize: _propTypes.default.func,
      // Calls when resize is complete.
      onResizeStop: _propTypes.default.func,
      // Calls when some element is dropped.
      onDrop: _propTypes.default.func,
      //
      // Other validations
      //
      droppingItem: _propTypes.default.shape({
        i: _propTypes.default.string.isRequired,
        w: _propTypes.default.number.isRequired,
        h: _propTypes.default.number.isRequired
      }),
      // Children must not have duplicate keys.
      children: function(props, propName) {
        const children = props[propName];
        const keys = {};
        _react.default.Children.forEach(children, function(child) {
          if ((child === null || child === void 0 ? void 0 : child.key) == null) return;
          if (keys[child.key]) {
            throw new Error('Duplicate child key "' + child.key + '" found! This will cause problems in ReactGridLayout.');
          }
          keys[child.key] = true;
        });
      },
      // Optional ref for getting a reference for the wrapping div.
      innerRef: _propTypes.default.any
    };
  }
});

// node_modules/react-grid-layout/build/GridItem.js
var require_GridItem = __commonJS({
  "node_modules/react-grid-layout/build/GridItem.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _react = _interopRequireDefault(require_react());
    var _reactDom = require_react_dom();
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _reactDraggable = require_cjs();
    var _reactResizable = require_react_resizable();
    var _utils = require_utils();
    var _calculateUtils = require_calculateUtils();
    var _ReactGridLayoutPropTypes = require_ReactGridLayoutPropTypes();
    var _clsx = _interopRequireDefault(require_clsx());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    var GridItem = class extends _react.default.Component {
      constructor() {
        super(...arguments);
        _defineProperty(this, "state", {
          resizing: null,
          dragging: null,
          className: ""
        });
        _defineProperty(this, "elementRef", /* @__PURE__ */ _react.default.createRef());
        _defineProperty(this, "onDragStart", (e, _ref) => {
          let {
            node
          } = _ref;
          const {
            onDragStart,
            transformScale
          } = this.props;
          if (!onDragStart) return;
          const newPosition = {
            top: 0,
            left: 0
          };
          const {
            offsetParent
          } = node;
          if (!offsetParent) return;
          const parentRect = offsetParent.getBoundingClientRect();
          const clientRect = node.getBoundingClientRect();
          const cLeft = clientRect.left / transformScale;
          const pLeft = parentRect.left / transformScale;
          const cTop = clientRect.top / transformScale;
          const pTop = parentRect.top / transformScale;
          newPosition.left = cLeft - pLeft + offsetParent.scrollLeft;
          newPosition.top = cTop - pTop + offsetParent.scrollTop;
          this.setState({
            dragging: newPosition
          });
          const {
            x,
            y
          } = (0, _calculateUtils.calcXY)(this.getPositionParams(), newPosition.top, newPosition.left, this.props.w, this.props.h);
          return onDragStart.call(this, this.props.i, x, y, {
            e,
            node,
            newPosition
          });
        });
        _defineProperty(this, "onDrag", (e, _ref2, dontFlush) => {
          let {
            node,
            deltaX,
            deltaY
          } = _ref2;
          const {
            onDrag
          } = this.props;
          if (!onDrag) return;
          if (!this.state.dragging) {
            throw new Error("onDrag called before onDragStart.");
          }
          let top = this.state.dragging.top + deltaY;
          let left = this.state.dragging.left + deltaX;
          const {
            isBounded,
            i,
            w,
            h,
            containerWidth
          } = this.props;
          const positionParams = this.getPositionParams();
          if (isBounded) {
            const {
              offsetParent
            } = node;
            if (offsetParent) {
              const {
                margin,
                rowHeight
              } = this.props;
              const bottomBoundary = offsetParent.clientHeight - (0, _calculateUtils.calcGridItemWHPx)(h, rowHeight, margin[1]);
              top = (0, _calculateUtils.clamp)(top, 0, bottomBoundary);
              const colWidth = (0, _calculateUtils.calcGridColWidth)(positionParams);
              const rightBoundary = containerWidth - (0, _calculateUtils.calcGridItemWHPx)(w, colWidth, margin[0]);
              left = (0, _calculateUtils.clamp)(left, 0, rightBoundary);
            }
          }
          const newPosition = {
            top,
            left
          };
          if (dontFlush) {
            this.setState({
              dragging: newPosition
            });
          } else {
            (0, _reactDom.flushSync)(() => {
              this.setState({
                dragging: newPosition
              });
            });
          }
          const {
            x,
            y
          } = (0, _calculateUtils.calcXY)(positionParams, top, left, w, h);
          return onDrag.call(this, i, x, y, {
            e,
            node,
            newPosition
          });
        });
        _defineProperty(this, "onDragStop", (e, _ref3) => {
          let {
            node
          } = _ref3;
          const {
            onDragStop
          } = this.props;
          if (!onDragStop) return;
          if (!this.state.dragging) {
            throw new Error("onDragEnd called before onDragStart.");
          }
          const {
            w,
            h,
            i
          } = this.props;
          const {
            left,
            top
          } = this.state.dragging;
          const newPosition = {
            top,
            left
          };
          this.setState({
            dragging: null
          });
          const {
            x,
            y
          } = (0, _calculateUtils.calcXY)(this.getPositionParams(), top, left, w, h);
          return onDragStop.call(this, i, x, y, {
            e,
            node,
            newPosition
          });
        });
        _defineProperty(this, "onResizeStop", (e, callbackData, position) => this.onResizeHandler(e, callbackData, position, "onResizeStop"));
        _defineProperty(this, "onResizeStart", (e, callbackData, position) => this.onResizeHandler(e, callbackData, position, "onResizeStart"));
        _defineProperty(this, "onResize", (e, callbackData, position) => this.onResizeHandler(e, callbackData, position, "onResize"));
      }
      shouldComponentUpdate(nextProps, nextState) {
        if (this.props.children !== nextProps.children) return true;
        if (this.props.droppingPosition !== nextProps.droppingPosition) return true;
        const oldPosition = (0, _calculateUtils.calcGridItemPosition)(this.getPositionParams(this.props), this.props.x, this.props.y, this.props.w, this.props.h, this.state);
        const newPosition = (0, _calculateUtils.calcGridItemPosition)(this.getPositionParams(nextProps), nextProps.x, nextProps.y, nextProps.w, nextProps.h, nextState);
        return !(0, _utils.fastPositionEqual)(oldPosition, newPosition) || this.props.useCSSTransforms !== nextProps.useCSSTransforms;
      }
      componentDidMount() {
        this.moveDroppingItem({});
      }
      componentDidUpdate(prevProps) {
        this.moveDroppingItem(prevProps);
      }
      // When a droppingPosition is present, this means we should fire a move event, as if we had moved
      // this element by `x, y` pixels.
      moveDroppingItem(prevProps) {
        const {
          droppingPosition
        } = this.props;
        if (!droppingPosition) return;
        const node = this.elementRef.current;
        if (!node) return;
        const prevDroppingPosition = prevProps.droppingPosition || {
          left: 0,
          top: 0
        };
        const {
          dragging
        } = this.state;
        const shouldDrag = dragging && droppingPosition.left !== prevDroppingPosition.left || droppingPosition.top !== prevDroppingPosition.top;
        if (!dragging) {
          this.onDragStart(droppingPosition.e, {
            node,
            deltaX: droppingPosition.left,
            deltaY: droppingPosition.top
          });
        } else if (shouldDrag) {
          const deltaX = droppingPosition.left - dragging.left;
          const deltaY = droppingPosition.top - dragging.top;
          this.onDrag(
            droppingPosition.e,
            {
              node,
              deltaX,
              deltaY
            },
            true
            // dontFLush: avoid flushSync to temper warnings
          );
        }
      }
      getPositionParams() {
        let props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.props;
        return {
          cols: props.cols,
          containerPadding: props.containerPadding,
          containerWidth: props.containerWidth,
          margin: props.margin,
          maxRows: props.maxRows,
          rowHeight: props.rowHeight
        };
      }
      /**
       * This is where we set the grid item's absolute placement. It gets a little tricky because we want to do it
       * well when server rendering, and the only way to do that properly is to use percentage width/left because
       * we don't know exactly what the browser viewport is.
       * Unfortunately, CSS Transforms, which are great for performance, break in this instance because a percentage
       * left is relative to the item itself, not its container! So we cannot use them on the server rendering pass.
       *
       * @param  {Object} pos Position object with width, height, left, top.
       * @return {Object}     Style object.
       */
      createStyle(pos) {
        const {
          usePercentages,
          containerWidth,
          useCSSTransforms
        } = this.props;
        let style;
        if (useCSSTransforms) {
          style = (0, _utils.setTransform)(pos);
        } else {
          style = (0, _utils.setTopLeft)(pos);
          if (usePercentages) {
            style.left = (0, _utils.perc)(pos.left / containerWidth);
            style.width = (0, _utils.perc)(pos.width / containerWidth);
          }
        }
        return style;
      }
      /**
       * Mix a Draggable instance into a child.
       * @param  {Element} child    Child element.
       * @return {Element}          Child wrapped in Draggable.
       */
      mixinDraggable(child, isDraggable) {
        return /* @__PURE__ */ _react.default.createElement(_reactDraggable.DraggableCore, {
          disabled: !isDraggable,
          onStart: this.onDragStart,
          onDrag: this.onDrag,
          onStop: this.onDragStop,
          handle: this.props.handle,
          cancel: ".react-resizable-handle" + (this.props.cancel ? "," + this.props.cancel : ""),
          scale: this.props.transformScale,
          nodeRef: this.elementRef
        }, child);
      }
      /**
       * Utility function to setup callback handler definitions for
       * similarily structured resize events.
       */
      curryResizeHandler(position, handler) {
        return (e, data) => (
          /*: Function*/
          handler(e, data, position)
        );
      }
      /**
       * Mix a Resizable instance into a child.
       * @param  {Element} child    Child element.
       * @param  {Object} position  Position object (pixel values)
       * @return {Element}          Child wrapped in Resizable.
       */
      mixinResizable(child, position, isResizable) {
        const {
          cols,
          minW,
          minH,
          maxW,
          maxH,
          transformScale,
          resizeHandles,
          resizeHandle
        } = this.props;
        const positionParams = this.getPositionParams();
        const maxWidth = (0, _calculateUtils.calcGridItemPosition)(positionParams, 0, 0, cols, 0).width;
        const mins = (0, _calculateUtils.calcGridItemPosition)(positionParams, 0, 0, minW, minH);
        const maxes = (0, _calculateUtils.calcGridItemPosition)(positionParams, 0, 0, maxW, maxH);
        const minConstraints = [mins.width, mins.height];
        const maxConstraints = [Math.min(maxes.width, maxWidth), Math.min(maxes.height, Infinity)];
        return /* @__PURE__ */ _react.default.createElement(
          _reactResizable.Resizable,
          {
            draggableOpts: {
              disabled: !isResizable
            },
            className: isResizable ? void 0 : "react-resizable-hide",
            width: position.width,
            height: position.height,
            minConstraints,
            maxConstraints,
            onResizeStop: this.curryResizeHandler(position, this.onResizeStop),
            onResizeStart: this.curryResizeHandler(position, this.onResizeStart),
            onResize: this.curryResizeHandler(position, this.onResize),
            transformScale,
            resizeHandles,
            handle: resizeHandle
          },
          child
        );
      }
      /**
       * Wrapper around resize events to provide more useful data.
       */
      onResizeHandler(e, _ref4, position, handlerName) {
        let {
          node,
          size,
          handle
        } = _ref4;
        const handler = this.props[handlerName];
        if (!handler) return;
        const {
          x,
          y,
          i,
          maxH,
          minH,
          containerWidth
        } = this.props;
        const {
          minW,
          maxW
        } = this.props;
        let updatedSize = size;
        if (node) {
          updatedSize = (0, _utils.resizeItemInDirection)(handle, position, size, containerWidth);
          (0, _reactDom.flushSync)(() => {
            this.setState({
              resizing: handlerName === "onResizeStop" ? null : updatedSize
            });
          });
        }
        let {
          w,
          h
        } = (0, _calculateUtils.calcWH)(this.getPositionParams(), updatedSize.width, updatedSize.height, x, y, handle);
        w = (0, _calculateUtils.clamp)(w, Math.max(minW, 1), maxW);
        h = (0, _calculateUtils.clamp)(h, minH, maxH);
        handler.call(this, i, w, h, {
          e,
          node,
          size: updatedSize,
          handle
        });
      }
      render() {
        const {
          x,
          y,
          w,
          h,
          isDraggable,
          isResizable,
          droppingPosition,
          useCSSTransforms
        } = this.props;
        const pos = (0, _calculateUtils.calcGridItemPosition)(this.getPositionParams(), x, y, w, h, this.state);
        const child = _react.default.Children.only(this.props.children);
        let newChild = /* @__PURE__ */ _react.default.cloneElement(child, {
          ref: this.elementRef,
          className: (0, _clsx.default)("react-grid-item", child.props.className, this.props.className, {
            static: this.props.static,
            resizing: Boolean(this.state.resizing),
            "react-draggable": isDraggable,
            "react-draggable-dragging": Boolean(this.state.dragging),
            dropping: Boolean(droppingPosition),
            cssTransforms: useCSSTransforms
          }),
          // We can set the width and height on the child, but unfortunately we can't set the position.
          style: _objectSpread(_objectSpread(_objectSpread({}, this.props.style), child.props.style), this.createStyle(pos))
        });
        newChild = this.mixinResizable(newChild, pos, isResizable);
        newChild = this.mixinDraggable(newChild, isDraggable);
        return newChild;
      }
    };
    exports.default = GridItem;
    _defineProperty(GridItem, "propTypes", {
      // Children must be only a single element
      children: _propTypes.default.element,
      // General grid attributes
      cols: _propTypes.default.number.isRequired,
      containerWidth: _propTypes.default.number.isRequired,
      rowHeight: _propTypes.default.number.isRequired,
      margin: _propTypes.default.array.isRequired,
      maxRows: _propTypes.default.number.isRequired,
      containerPadding: _propTypes.default.array.isRequired,
      // These are all in grid units
      x: _propTypes.default.number.isRequired,
      y: _propTypes.default.number.isRequired,
      w: _propTypes.default.number.isRequired,
      h: _propTypes.default.number.isRequired,
      // All optional
      minW: function(props, propName) {
        const value = props[propName];
        if (typeof value !== "number") return new Error("minWidth not Number");
        if (value > props.w || value > props.maxW) return new Error("minWidth larger than item width/maxWidth");
      },
      maxW: function(props, propName) {
        const value = props[propName];
        if (typeof value !== "number") return new Error("maxWidth not Number");
        if (value < props.w || value < props.minW) return new Error("maxWidth smaller than item width/minWidth");
      },
      minH: function(props, propName) {
        const value = props[propName];
        if (typeof value !== "number") return new Error("minHeight not Number");
        if (value > props.h || value > props.maxH) return new Error("minHeight larger than item height/maxHeight");
      },
      maxH: function(props, propName) {
        const value = props[propName];
        if (typeof value !== "number") return new Error("maxHeight not Number");
        if (value < props.h || value < props.minH) return new Error("maxHeight smaller than item height/minHeight");
      },
      // ID is nice to have for callbacks
      i: _propTypes.default.string.isRequired,
      // Resize handle options
      resizeHandles: _ReactGridLayoutPropTypes.resizeHandleAxesType,
      resizeHandle: _ReactGridLayoutPropTypes.resizeHandleType,
      // Functions
      onDragStop: _propTypes.default.func,
      onDragStart: _propTypes.default.func,
      onDrag: _propTypes.default.func,
      onResizeStop: _propTypes.default.func,
      onResizeStart: _propTypes.default.func,
      onResize: _propTypes.default.func,
      // Flags
      isDraggable: _propTypes.default.bool.isRequired,
      isResizable: _propTypes.default.bool.isRequired,
      isBounded: _propTypes.default.bool.isRequired,
      static: _propTypes.default.bool,
      // Use CSS transforms instead of top/left
      useCSSTransforms: _propTypes.default.bool.isRequired,
      transformScale: _propTypes.default.number,
      // Others
      className: _propTypes.default.string,
      // Selector for draggable handle
      handle: _propTypes.default.string,
      // Selector for draggable cancel (see react-draggable)
      cancel: _propTypes.default.string,
      // Current position of a dropping element
      droppingPosition: _propTypes.default.shape({
        e: _propTypes.default.object.isRequired,
        left: _propTypes.default.number.isRequired,
        top: _propTypes.default.number.isRequired
      })
    });
    _defineProperty(GridItem, "defaultProps", {
      className: "",
      cancel: "",
      handle: "",
      minH: 1,
      minW: 1,
      maxH: Infinity,
      maxW: Infinity,
      transformScale: 1
    });
  }
});

// node_modules/react-grid-layout/build/ReactGridLayout.js
var require_ReactGridLayout = __commonJS({
  "node_modules/react-grid-layout/build/ReactGridLayout.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React2 = _interopRequireWildcard(require_react());
    var _fastEquals = require_fast_equals();
    var _clsx = _interopRequireDefault(require_clsx());
    var _utils = require_utils();
    var _calculateUtils = require_calculateUtils();
    var _GridItem = _interopRequireDefault(require_GridItem());
    var _ReactGridLayoutPropTypes = _interopRequireDefault(require_ReactGridLayoutPropTypes());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, default: e2 };
        if (null === e2 || "object" != typeof e2 && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (const t3 in e2) "default" !== t3 && {}.hasOwnProperty.call(e2, t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, t3)) && (i.get || i.set) ? o(f, t3, i) : f[t3] = e2[t3]);
        return f;
      })(e, t);
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    var layoutClassName = "react-grid-layout";
    var isFirefox = false;
    try {
      isFirefox = /firefox/i.test(navigator.userAgent);
    } catch (e) {
    }
    var ReactGridLayout = class extends React2.Component {
      constructor() {
        super(...arguments);
        _defineProperty(this, "state", {
          activeDrag: null,
          layout: (0, _utils.synchronizeLayoutWithChildren)(
            this.props.layout,
            this.props.children,
            this.props.cols,
            // Legacy support for verticalCompact: false
            (0, _utils.compactType)(this.props),
            this.props.allowOverlap
          ),
          mounted: false,
          oldDragItem: null,
          oldLayout: null,
          oldResizeItem: null,
          resizing: false,
          droppingDOMNode: null,
          children: []
        });
        _defineProperty(this, "dragEnterCounter", 0);
        _defineProperty(this, "onDragStart", (i, x, y, _ref) => {
          let {
            e,
            node
          } = _ref;
          const {
            layout
          } = this.state;
          const l = (0, _utils.getLayoutItem)(layout, i);
          if (!l) return;
          const placeholder = {
            w: l.w,
            h: l.h,
            x: l.x,
            y: l.y,
            placeholder: true,
            i
          };
          this.setState({
            oldDragItem: (0, _utils.cloneLayoutItem)(l),
            oldLayout: layout,
            activeDrag: placeholder
          });
          return this.props.onDragStart(layout, l, l, null, e, node);
        });
        _defineProperty(this, "onDrag", (i, x, y, _ref2) => {
          let {
            e,
            node
          } = _ref2;
          const {
            oldDragItem
          } = this.state;
          let {
            layout
          } = this.state;
          const {
            cols,
            allowOverlap,
            preventCollision
          } = this.props;
          const l = (0, _utils.getLayoutItem)(layout, i);
          if (!l) return;
          const placeholder = {
            w: l.w,
            h: l.h,
            x: l.x,
            y: l.y,
            placeholder: true,
            i
          };
          const isUserAction = true;
          layout = (0, _utils.moveElement)(layout, l, x, y, isUserAction, preventCollision, (0, _utils.compactType)(this.props), cols, allowOverlap);
          this.props.onDrag(layout, oldDragItem, l, placeholder, e, node);
          this.setState({
            layout: allowOverlap ? layout : (0, _utils.compact)(layout, (0, _utils.compactType)(this.props), cols),
            activeDrag: placeholder
          });
        });
        _defineProperty(this, "onDragStop", (i, x, y, _ref3) => {
          let {
            e,
            node
          } = _ref3;
          if (!this.state.activeDrag) return;
          const {
            oldDragItem
          } = this.state;
          let {
            layout
          } = this.state;
          const {
            cols,
            preventCollision,
            allowOverlap
          } = this.props;
          const l = (0, _utils.getLayoutItem)(layout, i);
          if (!l) return;
          const isUserAction = true;
          layout = (0, _utils.moveElement)(layout, l, x, y, isUserAction, preventCollision, (0, _utils.compactType)(this.props), cols, allowOverlap);
          const newLayout = allowOverlap ? layout : (0, _utils.compact)(layout, (0, _utils.compactType)(this.props), cols);
          this.props.onDragStop(newLayout, oldDragItem, l, null, e, node);
          const {
            oldLayout
          } = this.state;
          this.setState({
            activeDrag: null,
            layout: newLayout,
            oldDragItem: null,
            oldLayout: null
          });
          this.onLayoutMaybeChanged(newLayout, oldLayout);
        });
        _defineProperty(this, "onResizeStart", (i, w, h, _ref4) => {
          let {
            e,
            node
          } = _ref4;
          const {
            layout
          } = this.state;
          const l = (0, _utils.getLayoutItem)(layout, i);
          if (!l) return;
          this.setState({
            oldResizeItem: (0, _utils.cloneLayoutItem)(l),
            oldLayout: this.state.layout,
            resizing: true
          });
          this.props.onResizeStart(layout, l, l, null, e, node);
        });
        _defineProperty(this, "onResize", (i, w, h, _ref5) => {
          let {
            e,
            node,
            size,
            handle
          } = _ref5;
          const {
            oldResizeItem
          } = this.state;
          const {
            layout
          } = this.state;
          const {
            cols,
            preventCollision,
            allowOverlap
          } = this.props;
          let shouldMoveItem = false;
          let finalLayout;
          let x;
          let y;
          const [newLayout, l] = (0, _utils.withLayoutItem)(layout, i, (l2) => {
            let hasCollisions;
            x = l2.x;
            y = l2.y;
            if (["sw", "w", "nw", "n", "ne"].indexOf(handle) !== -1) {
              if (["sw", "nw", "w"].indexOf(handle) !== -1) {
                x = l2.x + (l2.w - w);
                w = l2.x !== x && x < 0 ? l2.w : w;
                x = x < 0 ? 0 : x;
              }
              if (["ne", "n", "nw"].indexOf(handle) !== -1) {
                y = l2.y + (l2.h - h);
                h = l2.y !== y && y < 0 ? l2.h : h;
                y = y < 0 ? 0 : y;
              }
              shouldMoveItem = true;
            }
            if (preventCollision && !allowOverlap) {
              const collisions = (0, _utils.getAllCollisions)(layout, _objectSpread(_objectSpread({}, l2), {}, {
                w,
                h,
                x,
                y
              })).filter((layoutItem) => layoutItem.i !== l2.i);
              hasCollisions = collisions.length > 0;
              if (hasCollisions) {
                y = l2.y;
                h = l2.h;
                x = l2.x;
                w = l2.w;
                shouldMoveItem = false;
              }
            }
            l2.w = w;
            l2.h = h;
            return l2;
          });
          if (!l) return;
          finalLayout = newLayout;
          if (shouldMoveItem) {
            const isUserAction = true;
            finalLayout = (0, _utils.moveElement)(newLayout, l, x, y, isUserAction, this.props.preventCollision, (0, _utils.compactType)(this.props), cols, allowOverlap);
          }
          const placeholder = {
            w: l.w,
            h: l.h,
            x: l.x,
            y: l.y,
            static: true,
            i
          };
          this.props.onResize(finalLayout, oldResizeItem, l, placeholder, e, node);
          this.setState({
            layout: allowOverlap ? finalLayout : (0, _utils.compact)(finalLayout, (0, _utils.compactType)(this.props), cols),
            activeDrag: placeholder
          });
        });
        _defineProperty(this, "onResizeStop", (i, w, h, _ref6) => {
          let {
            e,
            node
          } = _ref6;
          const {
            layout,
            oldResizeItem
          } = this.state;
          const {
            cols,
            allowOverlap
          } = this.props;
          const l = (0, _utils.getLayoutItem)(layout, i);
          const newLayout = allowOverlap ? layout : (0, _utils.compact)(layout, (0, _utils.compactType)(this.props), cols);
          this.props.onResizeStop(newLayout, oldResizeItem, l, null, e, node);
          const {
            oldLayout
          } = this.state;
          this.setState({
            activeDrag: null,
            layout: newLayout,
            oldResizeItem: null,
            oldLayout: null,
            resizing: false
          });
          this.onLayoutMaybeChanged(newLayout, oldLayout);
        });
        _defineProperty(this, "onDragOver", (e) => {
          var _e$nativeEvent$target;
          e.preventDefault();
          e.stopPropagation();
          if (isFirefox && // $FlowIgnore can't figure this out
          !((_e$nativeEvent$target = e.nativeEvent.target) !== null && _e$nativeEvent$target !== void 0 && _e$nativeEvent$target.classList.contains(layoutClassName))) {
            return false;
          }
          const {
            droppingItem,
            onDropDragOver,
            margin,
            cols,
            rowHeight,
            maxRows,
            width,
            containerPadding,
            transformScale
          } = this.props;
          const onDragOverResult = onDropDragOver === null || onDropDragOver === void 0 ? void 0 : onDropDragOver(e);
          if (onDragOverResult === false) {
            if (this.state.droppingDOMNode) {
              this.removeDroppingPlaceholder();
            }
            return false;
          }
          const finalDroppingItem = _objectSpread(_objectSpread({}, droppingItem), onDragOverResult);
          const {
            layout
          } = this.state;
          const gridRect = e.currentTarget.getBoundingClientRect();
          const layerX = e.clientX - gridRect.left;
          const layerY = e.clientY - gridRect.top;
          const droppingPosition = {
            left: layerX / transformScale,
            top: layerY / transformScale,
            e
          };
          if (!this.state.droppingDOMNode) {
            const positionParams = {
              cols,
              margin,
              maxRows,
              rowHeight,
              containerWidth: width,
              containerPadding: containerPadding || margin
            };
            const calculatedPosition = (0, _calculateUtils.calcXY)(positionParams, layerY, layerX, finalDroppingItem.w, finalDroppingItem.h);
            this.setState({
              droppingDOMNode: /* @__PURE__ */ React2.createElement("div", {
                key: finalDroppingItem.i
              }),
              droppingPosition,
              layout: [...layout, _objectSpread(_objectSpread({}, finalDroppingItem), {}, {
                x: calculatedPosition.x,
                y: calculatedPosition.y,
                static: false,
                isDraggable: true
              })]
            });
          } else if (this.state.droppingPosition) {
            const {
              left,
              top
            } = this.state.droppingPosition;
            const shouldUpdatePosition = left != layerX || top != layerY;
            if (shouldUpdatePosition) {
              this.setState({
                droppingPosition
              });
            }
          }
        });
        _defineProperty(this, "removeDroppingPlaceholder", () => {
          const {
            droppingItem,
            cols
          } = this.props;
          const {
            layout
          } = this.state;
          const newLayout = (0, _utils.compact)(layout.filter((l) => l.i !== droppingItem.i), (0, _utils.compactType)(this.props), cols, this.props.allowOverlap);
          this.setState({
            layout: newLayout,
            droppingDOMNode: null,
            activeDrag: null,
            droppingPosition: void 0
          });
        });
        _defineProperty(this, "onDragLeave", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.dragEnterCounter--;
          if (this.dragEnterCounter === 0) {
            this.removeDroppingPlaceholder();
          }
        });
        _defineProperty(this, "onDragEnter", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.dragEnterCounter++;
        });
        _defineProperty(this, "onDrop", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const {
            droppingItem
          } = this.props;
          const {
            layout
          } = this.state;
          const item = layout.find((l) => l.i === droppingItem.i);
          this.dragEnterCounter = 0;
          this.removeDroppingPlaceholder();
          this.props.onDrop(layout, item, e);
        });
      }
      componentDidMount() {
        this.setState({
          mounted: true
        });
        this.onLayoutMaybeChanged(this.state.layout, this.props.layout);
      }
      static getDerivedStateFromProps(nextProps, prevState) {
        let newLayoutBase;
        if (prevState.activeDrag) {
          return null;
        }
        if (!(0, _fastEquals.deepEqual)(nextProps.layout, prevState.propsLayout) || nextProps.compactType !== prevState.compactType) {
          newLayoutBase = nextProps.layout;
        } else if (!(0, _utils.childrenEqual)(nextProps.children, prevState.children)) {
          newLayoutBase = prevState.layout;
        }
        if (newLayoutBase) {
          const newLayout = (0, _utils.synchronizeLayoutWithChildren)(newLayoutBase, nextProps.children, nextProps.cols, (0, _utils.compactType)(nextProps), nextProps.allowOverlap);
          return {
            layout: newLayout,
            // We need to save these props to state for using
            // getDerivedStateFromProps instead of componentDidMount (in which we would get extra rerender)
            compactType: nextProps.compactType,
            children: nextProps.children,
            propsLayout: nextProps.layout
          };
        }
        return null;
      }
      shouldComponentUpdate(nextProps, nextState) {
        return (
          // NOTE: this is almost always unequal. Therefore the only way to get better performance
          // from SCU is if the user intentionally memoizes children. If they do, and they can
          // handle changes properly, performance will increase.
          this.props.children !== nextProps.children || !(0, _utils.fastRGLPropsEqual)(this.props, nextProps, _fastEquals.deepEqual) || this.state.activeDrag !== nextState.activeDrag || this.state.mounted !== nextState.mounted || this.state.droppingPosition !== nextState.droppingPosition
        );
      }
      componentDidUpdate(prevProps, prevState) {
        if (!this.state.activeDrag) {
          const newLayout = this.state.layout;
          const oldLayout = prevState.layout;
          this.onLayoutMaybeChanged(newLayout, oldLayout);
        }
      }
      /**
       * Calculates a pixel value for the container.
       * @return {String} Container height in pixels.
       */
      containerHeight() {
        if (!this.props.autoSize) return;
        const nbRow = (0, _utils.bottom)(this.state.layout);
        const containerPaddingY = this.props.containerPadding ? this.props.containerPadding[1] : this.props.margin[1];
        return nbRow * this.props.rowHeight + (nbRow - 1) * this.props.margin[1] + containerPaddingY * 2 + "px";
      }
      onLayoutMaybeChanged(newLayout, oldLayout) {
        if (!oldLayout) oldLayout = this.state.layout;
        if (!(0, _fastEquals.deepEqual)(oldLayout, newLayout)) {
          this.props.onLayoutChange(newLayout);
        }
      }
      /**
       * Create a placeholder object.
       * @return {Element} Placeholder div.
       */
      placeholder() {
        const {
          activeDrag
        } = this.state;
        if (!activeDrag) return null;
        const {
          width,
          cols,
          margin,
          containerPadding,
          rowHeight,
          maxRows,
          useCSSTransforms,
          transformScale
        } = this.props;
        return /* @__PURE__ */ React2.createElement(_GridItem.default, {
          w: activeDrag.w,
          h: activeDrag.h,
          x: activeDrag.x,
          y: activeDrag.y,
          i: activeDrag.i,
          className: "react-grid-placeholder ".concat(this.state.resizing ? "placeholder-resizing" : ""),
          containerWidth: width,
          cols,
          margin,
          containerPadding: containerPadding || margin,
          maxRows,
          rowHeight,
          isDraggable: false,
          isResizable: false,
          isBounded: false,
          useCSSTransforms,
          transformScale
        }, /* @__PURE__ */ React2.createElement("div", null));
      }
      /**
       * Given a grid item, set its style attributes & surround in a <Draggable>.
       * @param  {Element} child React element.
       * @return {Element}       Element wrapped in draggable and properly placed.
       */
      processGridItem(child, isDroppingItem) {
        if (!child || !child.key) return;
        const l = (0, _utils.getLayoutItem)(this.state.layout, String(child.key));
        if (!l) return null;
        const {
          width,
          cols,
          margin,
          containerPadding,
          rowHeight,
          maxRows,
          isDraggable,
          isResizable,
          isBounded,
          useCSSTransforms,
          transformScale,
          draggableCancel,
          draggableHandle,
          resizeHandles,
          resizeHandle
        } = this.props;
        const {
          mounted,
          droppingPosition
        } = this.state;
        const draggable = typeof l.isDraggable === "boolean" ? l.isDraggable : !l.static && isDraggable;
        const resizable = typeof l.isResizable === "boolean" ? l.isResizable : !l.static && isResizable;
        const resizeHandlesOptions = l.resizeHandles || resizeHandles;
        const bounded = draggable && isBounded && l.isBounded !== false;
        return /* @__PURE__ */ React2.createElement(_GridItem.default, {
          containerWidth: width,
          cols,
          margin,
          containerPadding: containerPadding || margin,
          maxRows,
          rowHeight,
          cancel: draggableCancel,
          handle: draggableHandle,
          onDragStop: this.onDragStop,
          onDragStart: this.onDragStart,
          onDrag: this.onDrag,
          onResizeStart: this.onResizeStart,
          onResize: this.onResize,
          onResizeStop: this.onResizeStop,
          isDraggable: draggable,
          isResizable: resizable,
          isBounded: bounded,
          useCSSTransforms: useCSSTransforms && mounted,
          usePercentages: !mounted,
          transformScale,
          w: l.w,
          h: l.h,
          x: l.x,
          y: l.y,
          i: l.i,
          minH: l.minH,
          minW: l.minW,
          maxH: l.maxH,
          maxW: l.maxW,
          static: l.static,
          droppingPosition: isDroppingItem ? droppingPosition : void 0,
          resizeHandles: resizeHandlesOptions,
          resizeHandle
        }, child);
      }
      render() {
        const {
          className,
          style,
          isDroppable,
          innerRef
        } = this.props;
        const mergedClassName = (0, _clsx.default)(layoutClassName, className);
        const mergedStyle = _objectSpread({
          height: this.containerHeight()
        }, style);
        return /* @__PURE__ */ React2.createElement("div", {
          ref: innerRef,
          className: mergedClassName,
          style: mergedStyle,
          onDrop: isDroppable ? this.onDrop : _utils.noop,
          onDragLeave: isDroppable ? this.onDragLeave : _utils.noop,
          onDragEnter: isDroppable ? this.onDragEnter : _utils.noop,
          onDragOver: isDroppable ? this.onDragOver : _utils.noop
        }, React2.Children.map(this.props.children, (child) => this.processGridItem(child)), isDroppable && this.state.droppingDOMNode && this.processGridItem(this.state.droppingDOMNode, true), this.placeholder());
      }
    };
    exports.default = ReactGridLayout;
    _defineProperty(ReactGridLayout, "displayName", "ReactGridLayout");
    _defineProperty(ReactGridLayout, "propTypes", _ReactGridLayoutPropTypes.default);
    _defineProperty(ReactGridLayout, "defaultProps", {
      autoSize: true,
      cols: 12,
      className: "",
      style: {},
      draggableHandle: "",
      draggableCancel: "",
      containerPadding: null,
      rowHeight: 150,
      maxRows: Infinity,
      // infinite vertical growth
      layout: [],
      margin: [10, 10],
      isBounded: false,
      isDraggable: true,
      isResizable: true,
      allowOverlap: false,
      isDroppable: false,
      useCSSTransforms: true,
      transformScale: 1,
      verticalCompact: true,
      compactType: "vertical",
      preventCollision: false,
      droppingItem: {
        i: "__dropping-elem__",
        h: 1,
        w: 1
      },
      resizeHandles: ["se"],
      onLayoutChange: _utils.noop,
      onDragStart: _utils.noop,
      onDrag: _utils.noop,
      onDragStop: _utils.noop,
      onResizeStart: _utils.noop,
      onResize: _utils.noop,
      onResizeStop: _utils.noop,
      onDrop: _utils.noop,
      onDropDragOver: _utils.noop
    });
  }
});

// node_modules/react-grid-layout/build/responsiveUtils.js
var require_responsiveUtils = __commonJS({
  "node_modules/react-grid-layout/build/responsiveUtils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.findOrGenerateResponsiveLayout = findOrGenerateResponsiveLayout;
    exports.getBreakpointFromWidth = getBreakpointFromWidth;
    exports.getColsFromBreakpoint = getColsFromBreakpoint;
    exports.sortBreakpoints = sortBreakpoints;
    var _utils = require_utils();
    function getBreakpointFromWidth(breakpoints, width) {
      const sorted = sortBreakpoints(breakpoints);
      let matching = sorted[0];
      for (let i = 1, len = sorted.length; i < len; i++) {
        const breakpointName = sorted[i];
        if (width > breakpoints[breakpointName]) matching = breakpointName;
      }
      return matching;
    }
    function getColsFromBreakpoint(breakpoint, cols) {
      if (!cols[breakpoint]) {
        throw new Error("ResponsiveReactGridLayout: `cols` entry for breakpoint " + breakpoint + " is missing!");
      }
      return cols[breakpoint];
    }
    function findOrGenerateResponsiveLayout(layouts, breakpoints, breakpoint, lastBreakpoint, cols, compactType) {
      if (layouts[breakpoint]) return (0, _utils.cloneLayout)(layouts[breakpoint]);
      let layout = layouts[lastBreakpoint];
      const breakpointsSorted = sortBreakpoints(breakpoints);
      const breakpointsAbove = breakpointsSorted.slice(breakpointsSorted.indexOf(breakpoint));
      for (let i = 0, len = breakpointsAbove.length; i < len; i++) {
        const b = breakpointsAbove[i];
        if (layouts[b]) {
          layout = layouts[b];
          break;
        }
      }
      layout = (0, _utils.cloneLayout)(layout || []);
      return (0, _utils.compact)((0, _utils.correctBounds)(layout, {
        cols
      }), compactType, cols);
    }
    function sortBreakpoints(breakpoints) {
      const keys = Object.keys(breakpoints);
      return keys.sort(function(a, b) {
        return breakpoints[a] - breakpoints[b];
      });
    }
  }
});

// node_modules/react-grid-layout/build/ResponsiveReactGridLayout.js
var require_ResponsiveReactGridLayout = __commonJS({
  "node_modules/react-grid-layout/build/ResponsiveReactGridLayout.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React2 = _interopRequireWildcard(require_react());
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _fastEquals = require_fast_equals();
    var _utils = require_utils();
    var _responsiveUtils = require_responsiveUtils();
    var _ReactGridLayout = _interopRequireDefault(require_ReactGridLayout());
    var _excluded = ["breakpoint", "breakpoints", "cols", "layouts", "margin", "containerPadding", "onBreakpointChange", "onLayoutChange", "onWidthChange"];
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, default: e2 };
        if (null === e2 || "object" != typeof e2 && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (const t3 in e2) "default" !== t3 && {}.hasOwnProperty.call(e2, t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, t3)) && (i.get || i.set) ? o(f, t3, i) : f[t3] = e2[t3]);
        return f;
      })(e, t);
    }
    function _extends() {
      return _extends = Object.assign ? Object.assign.bind() : function(n) {
        for (var e = 1; e < arguments.length; e++) {
          var t = arguments[e];
          for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
        }
        return n;
      }, _extends.apply(null, arguments);
    }
    function _objectWithoutProperties(e, t) {
      if (null == e) return {};
      var o, r, i = _objectWithoutPropertiesLoose(e, t);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
      }
      return i;
    }
    function _objectWithoutPropertiesLoose(r, e) {
      if (null == r) return {};
      var t = {};
      for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
        if (-1 !== e.indexOf(n)) continue;
        t[n] = r[n];
      }
      return t;
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    var type = (obj) => Object.prototype.toString.call(obj);
    function getIndentationValue(param, breakpoint) {
      if (param == null) return null;
      return Array.isArray(param) ? param : param[breakpoint];
    }
    var ResponsiveReactGridLayout = class extends React2.Component {
      constructor() {
        super(...arguments);
        _defineProperty(this, "state", this.generateInitialState());
        _defineProperty(this, "onLayoutChange", (layout) => {
          this.props.onLayoutChange(layout, _objectSpread(_objectSpread({}, this.props.layouts), {}, {
            [this.state.breakpoint]: layout
          }));
        });
      }
      generateInitialState() {
        const {
          width,
          breakpoints,
          layouts,
          cols
        } = this.props;
        const breakpoint = (0, _responsiveUtils.getBreakpointFromWidth)(breakpoints, width);
        const colNo = (0, _responsiveUtils.getColsFromBreakpoint)(breakpoint, cols);
        const compactType = this.props.verticalCompact === false ? null : this.props.compactType;
        const initialLayout = (0, _responsiveUtils.findOrGenerateResponsiveLayout)(layouts, breakpoints, breakpoint, breakpoint, colNo, compactType);
        return {
          layout: initialLayout,
          breakpoint,
          cols: colNo
        };
      }
      static getDerivedStateFromProps(nextProps, prevState) {
        if (!(0, _fastEquals.deepEqual)(nextProps.layouts, prevState.layouts)) {
          const {
            breakpoint,
            cols
          } = prevState;
          const newLayout = (0, _responsiveUtils.findOrGenerateResponsiveLayout)(nextProps.layouts, nextProps.breakpoints, breakpoint, breakpoint, cols, nextProps.compactType);
          return {
            layout: newLayout,
            layouts: nextProps.layouts
          };
        }
        return null;
      }
      componentDidUpdate(prevProps) {
        if (this.props.width != prevProps.width || this.props.breakpoint !== prevProps.breakpoint || !(0, _fastEquals.deepEqual)(this.props.breakpoints, prevProps.breakpoints) || !(0, _fastEquals.deepEqual)(this.props.cols, prevProps.cols)) {
          this.onWidthChange(prevProps);
        }
      }
      /**
       * When the width changes work through breakpoints and reset state with the new width & breakpoint.
       * Width changes are necessary to figure out the widget widths.
       */
      onWidthChange(prevProps) {
        const {
          breakpoints,
          cols,
          layouts,
          compactType
        } = this.props;
        const newBreakpoint = this.props.breakpoint || (0, _responsiveUtils.getBreakpointFromWidth)(this.props.breakpoints, this.props.width);
        const lastBreakpoint = this.state.breakpoint;
        const newCols = (0, _responsiveUtils.getColsFromBreakpoint)(newBreakpoint, cols);
        const newLayouts = _objectSpread({}, layouts);
        if (lastBreakpoint !== newBreakpoint || prevProps.breakpoints !== breakpoints || prevProps.cols !== cols) {
          if (!(lastBreakpoint in newLayouts)) newLayouts[lastBreakpoint] = (0, _utils.cloneLayout)(this.state.layout);
          let layout = (0, _responsiveUtils.findOrGenerateResponsiveLayout)(newLayouts, breakpoints, newBreakpoint, lastBreakpoint, newCols, compactType);
          layout = (0, _utils.synchronizeLayoutWithChildren)(layout, this.props.children, newCols, compactType, this.props.allowOverlap);
          newLayouts[newBreakpoint] = layout;
          this.props.onBreakpointChange(newBreakpoint, newCols);
          this.props.onLayoutChange(layout, newLayouts);
          this.setState({
            breakpoint: newBreakpoint,
            layout,
            cols: newCols
          });
        }
        const margin = getIndentationValue(this.props.margin, newBreakpoint);
        const containerPadding = getIndentationValue(this.props.containerPadding, newBreakpoint);
        this.props.onWidthChange(this.props.width, margin, newCols, containerPadding);
      }
      render() {
        const _this$props = this.props, {
          breakpoint,
          breakpoints,
          cols,
          layouts,
          margin,
          containerPadding,
          onBreakpointChange,
          onLayoutChange,
          onWidthChange
        } = _this$props, other = _objectWithoutProperties(_this$props, _excluded);
        return /* @__PURE__ */ React2.createElement(_ReactGridLayout.default, _extends({}, other, {
          // $FlowIgnore should allow nullable here due to DefaultProps
          margin: getIndentationValue(margin, this.state.breakpoint),
          containerPadding: getIndentationValue(containerPadding, this.state.breakpoint),
          onLayoutChange: this.onLayoutChange,
          layout: this.state.layout,
          cols: this.state.cols
        }));
      }
    };
    exports.default = ResponsiveReactGridLayout;
    _defineProperty(ResponsiveReactGridLayout, "propTypes", {
      //
      // Basic props
      //
      // Optional, but if you are managing width yourself you may want to set the breakpoint
      // yourself as well.
      breakpoint: _propTypes.default.string,
      // {name: pxVal}, e.g. {lg: 1200, md: 996, sm: 768, xs: 480}
      breakpoints: _propTypes.default.object,
      allowOverlap: _propTypes.default.bool,
      // # of cols. This is a breakpoint -> cols map
      cols: _propTypes.default.object,
      // # of margin. This is a breakpoint -> margin map
      // e.g. { lg: [5, 5], md: [10, 10], sm: [15, 15] }
      // Margin between items [x, y] in px
      // e.g. [10, 10]
      margin: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.object]),
      // # of containerPadding. This is a breakpoint -> containerPadding map
      // e.g. { lg: [5, 5], md: [10, 10], sm: [15, 15] }
      // Padding inside the container [x, y] in px
      // e.g. [10, 10]
      containerPadding: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.object]),
      // layouts is an object mapping breakpoints to layouts.
      // e.g. {lg: Layout, md: Layout, ...}
      layouts(props, propName) {
        if (type(props[propName]) !== "[object Object]") {
          throw new Error("Layout property must be an object. Received: " + type(props[propName]));
        }
        Object.keys(props[propName]).forEach((key) => {
          if (!(key in props.breakpoints)) {
            throw new Error("Each key in layouts must align with a key in breakpoints.");
          }
          (0, _utils.validateLayout)(props.layouts[key], "layouts." + key);
        });
      },
      // The width of this component.
      // Required in this propTypes stanza because generateInitialState() will fail without it.
      width: _propTypes.default.number.isRequired,
      //
      // Callbacks
      //
      // Calls back with breakpoint and new # cols
      onBreakpointChange: _propTypes.default.func,
      // Callback so you can save the layout.
      // Calls back with (currentLayout, allLayouts). allLayouts are keyed by breakpoint.
      onLayoutChange: _propTypes.default.func,
      // Calls back with (containerWidth, margin, cols, containerPadding)
      onWidthChange: _propTypes.default.func
    });
    _defineProperty(ResponsiveReactGridLayout, "defaultProps", {
      breakpoints: {
        lg: 1200,
        md: 996,
        sm: 768,
        xs: 480,
        xxs: 0
      },
      cols: {
        lg: 12,
        md: 10,
        sm: 6,
        xs: 4,
        xxs: 2
      },
      containerPadding: {
        lg: null,
        md: null,
        sm: null,
        xs: null,
        xxs: null
      },
      layouts: {},
      margin: [10, 10],
      allowOverlap: false,
      onBreakpointChange: _utils.noop,
      onLayoutChange: _utils.noop,
      onWidthChange: _utils.noop
    });
  }
});

// node_modules/resize-observer-polyfill/dist/ResizeObserver.js
var require_ResizeObserver = __commonJS({
  "node_modules/resize-observer-polyfill/dist/ResizeObserver.js"(exports, module) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global2.ResizeObserver = factory();
    })(exports, (function() {
      "use strict";
      var MapShim = (function() {
        if (typeof Map !== "undefined") {
          return Map;
        }
        function getIndex(arr, key) {
          var result = -1;
          arr.some(function(entry, index2) {
            if (entry[0] === key) {
              result = index2;
              return true;
            }
            return false;
          });
          return result;
        }
        return (
          /** @class */
          (function() {
            function class_1() {
              this.__entries__ = [];
            }
            Object.defineProperty(class_1.prototype, "size", {
              /**
               * @returns {boolean}
               */
              get: function() {
                return this.__entries__.length;
              },
              enumerable: true,
              configurable: true
            });
            class_1.prototype.get = function(key) {
              var index2 = getIndex(this.__entries__, key);
              var entry = this.__entries__[index2];
              return entry && entry[1];
            };
            class_1.prototype.set = function(key, value) {
              var index2 = getIndex(this.__entries__, key);
              if (~index2) {
                this.__entries__[index2][1] = value;
              } else {
                this.__entries__.push([key, value]);
              }
            };
            class_1.prototype.delete = function(key) {
              var entries = this.__entries__;
              var index2 = getIndex(entries, key);
              if (~index2) {
                entries.splice(index2, 1);
              }
            };
            class_1.prototype.has = function(key) {
              return !!~getIndex(this.__entries__, key);
            };
            class_1.prototype.clear = function() {
              this.__entries__.splice(0);
            };
            class_1.prototype.forEach = function(callback, ctx) {
              if (ctx === void 0) {
                ctx = null;
              }
              for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
                var entry = _a[_i];
                callback.call(ctx, entry[1], entry[0]);
              }
            };
            return class_1;
          })()
        );
      })();
      var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && window.document === document;
      var global$1 = (function() {
        if (typeof global !== "undefined" && global.Math === Math) {
          return global;
        }
        if (typeof self !== "undefined" && self.Math === Math) {
          return self;
        }
        if (typeof window !== "undefined" && window.Math === Math) {
          return window;
        }
        return Function("return this")();
      })();
      var requestAnimationFrame$1 = (function() {
        if (typeof requestAnimationFrame === "function") {
          return requestAnimationFrame.bind(global$1);
        }
        return function(callback) {
          return setTimeout(function() {
            return callback(Date.now());
          }, 1e3 / 60);
        };
      })();
      var trailingTimeout = 2;
      function throttle(callback, delay) {
        var leadingCall = false, trailingCall = false, lastCallTime = 0;
        function resolvePending() {
          if (leadingCall) {
            leadingCall = false;
            callback();
          }
          if (trailingCall) {
            proxy();
          }
        }
        function timeoutCallback() {
          requestAnimationFrame$1(resolvePending);
        }
        function proxy() {
          var timeStamp = Date.now();
          if (leadingCall) {
            if (timeStamp - lastCallTime < trailingTimeout) {
              return;
            }
            trailingCall = true;
          } else {
            leadingCall = true;
            trailingCall = false;
            setTimeout(timeoutCallback, delay);
          }
          lastCallTime = timeStamp;
        }
        return proxy;
      }
      var REFRESH_DELAY = 20;
      var transitionKeys = ["top", "right", "bottom", "left", "width", "height", "size", "weight"];
      var mutationObserverSupported = typeof MutationObserver !== "undefined";
      var ResizeObserverController = (
        /** @class */
        (function() {
          function ResizeObserverController2() {
            this.connected_ = false;
            this.mutationEventsAdded_ = false;
            this.mutationsObserver_ = null;
            this.observers_ = [];
            this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
            this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
          }
          ResizeObserverController2.prototype.addObserver = function(observer) {
            if (!~this.observers_.indexOf(observer)) {
              this.observers_.push(observer);
            }
            if (!this.connected_) {
              this.connect_();
            }
          };
          ResizeObserverController2.prototype.removeObserver = function(observer) {
            var observers2 = this.observers_;
            var index2 = observers2.indexOf(observer);
            if (~index2) {
              observers2.splice(index2, 1);
            }
            if (!observers2.length && this.connected_) {
              this.disconnect_();
            }
          };
          ResizeObserverController2.prototype.refresh = function() {
            var changesDetected = this.updateObservers_();
            if (changesDetected) {
              this.refresh();
            }
          };
          ResizeObserverController2.prototype.updateObservers_ = function() {
            var activeObservers = this.observers_.filter(function(observer) {
              return observer.gatherActive(), observer.hasActive();
            });
            activeObservers.forEach(function(observer) {
              return observer.broadcastActive();
            });
            return activeObservers.length > 0;
          };
          ResizeObserverController2.prototype.connect_ = function() {
            if (!isBrowser || this.connected_) {
              return;
            }
            document.addEventListener("transitionend", this.onTransitionEnd_);
            window.addEventListener("resize", this.refresh);
            if (mutationObserverSupported) {
              this.mutationsObserver_ = new MutationObserver(this.refresh);
              this.mutationsObserver_.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
              });
            } else {
              document.addEventListener("DOMSubtreeModified", this.refresh);
              this.mutationEventsAdded_ = true;
            }
            this.connected_ = true;
          };
          ResizeObserverController2.prototype.disconnect_ = function() {
            if (!isBrowser || !this.connected_) {
              return;
            }
            document.removeEventListener("transitionend", this.onTransitionEnd_);
            window.removeEventListener("resize", this.refresh);
            if (this.mutationsObserver_) {
              this.mutationsObserver_.disconnect();
            }
            if (this.mutationEventsAdded_) {
              document.removeEventListener("DOMSubtreeModified", this.refresh);
            }
            this.mutationsObserver_ = null;
            this.mutationEventsAdded_ = false;
            this.connected_ = false;
          };
          ResizeObserverController2.prototype.onTransitionEnd_ = function(_a) {
            var _b = _a.propertyName, propertyName = _b === void 0 ? "" : _b;
            var isReflowProperty = transitionKeys.some(function(key) {
              return !!~propertyName.indexOf(key);
            });
            if (isReflowProperty) {
              this.refresh();
            }
          };
          ResizeObserverController2.getInstance = function() {
            if (!this.instance_) {
              this.instance_ = new ResizeObserverController2();
            }
            return this.instance_;
          };
          ResizeObserverController2.instance_ = null;
          return ResizeObserverController2;
        })()
      );
      var defineConfigurable = (function(target, props) {
        for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
          var key = _a[_i];
          Object.defineProperty(target, key, {
            value: props[key],
            enumerable: false,
            writable: false,
            configurable: true
          });
        }
        return target;
      });
      var getWindowOf = (function(target) {
        var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
        return ownerGlobal || global$1;
      });
      var emptyRect = createRectInit(0, 0, 0, 0);
      function toFloat(value) {
        return parseFloat(value) || 0;
      }
      function getBordersSize(styles) {
        var positions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          positions[_i - 1] = arguments[_i];
        }
        return positions.reduce(function(size, position) {
          var value = styles["border-" + position + "-width"];
          return size + toFloat(value);
        }, 0);
      }
      function getPaddings(styles) {
        var positions = ["top", "right", "bottom", "left"];
        var paddings = {};
        for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
          var position = positions_1[_i];
          var value = styles["padding-" + position];
          paddings[position] = toFloat(value);
        }
        return paddings;
      }
      function getSVGContentRect(target) {
        var bbox = target.getBBox();
        return createRectInit(0, 0, bbox.width, bbox.height);
      }
      function getHTMLElementContentRect(target) {
        var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
        if (!clientWidth && !clientHeight) {
          return emptyRect;
        }
        var styles = getWindowOf(target).getComputedStyle(target);
        var paddings = getPaddings(styles);
        var horizPad = paddings.left + paddings.right;
        var vertPad = paddings.top + paddings.bottom;
        var width = toFloat(styles.width), height = toFloat(styles.height);
        if (styles.boxSizing === "border-box") {
          if (Math.round(width + horizPad) !== clientWidth) {
            width -= getBordersSize(styles, "left", "right") + horizPad;
          }
          if (Math.round(height + vertPad) !== clientHeight) {
            height -= getBordersSize(styles, "top", "bottom") + vertPad;
          }
        }
        if (!isDocumentElement(target)) {
          var vertScrollbar = Math.round(width + horizPad) - clientWidth;
          var horizScrollbar = Math.round(height + vertPad) - clientHeight;
          if (Math.abs(vertScrollbar) !== 1) {
            width -= vertScrollbar;
          }
          if (Math.abs(horizScrollbar) !== 1) {
            height -= horizScrollbar;
          }
        }
        return createRectInit(paddings.left, paddings.top, width, height);
      }
      var isSVGGraphicsElement = (function() {
        if (typeof SVGGraphicsElement !== "undefined") {
          return function(target) {
            return target instanceof getWindowOf(target).SVGGraphicsElement;
          };
        }
        return function(target) {
          return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === "function";
        };
      })();
      function isDocumentElement(target) {
        return target === getWindowOf(target).document.documentElement;
      }
      function getContentRect(target) {
        if (!isBrowser) {
          return emptyRect;
        }
        if (isSVGGraphicsElement(target)) {
          return getSVGContentRect(target);
        }
        return getHTMLElementContentRect(target);
      }
      function createReadOnlyRect(_a) {
        var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        var Constr = typeof DOMRectReadOnly !== "undefined" ? DOMRectReadOnly : Object;
        var rect = Object.create(Constr.prototype);
        defineConfigurable(rect, {
          x,
          y,
          width,
          height,
          top: y,
          right: x + width,
          bottom: height + y,
          left: x
        });
        return rect;
      }
      function createRectInit(x, y, width, height) {
        return { x, y, width, height };
      }
      var ResizeObservation = (
        /** @class */
        (function() {
          function ResizeObservation2(target) {
            this.broadcastWidth = 0;
            this.broadcastHeight = 0;
            this.contentRect_ = createRectInit(0, 0, 0, 0);
            this.target = target;
          }
          ResizeObservation2.prototype.isActive = function() {
            var rect = getContentRect(this.target);
            this.contentRect_ = rect;
            return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
          };
          ResizeObservation2.prototype.broadcastRect = function() {
            var rect = this.contentRect_;
            this.broadcastWidth = rect.width;
            this.broadcastHeight = rect.height;
            return rect;
          };
          return ResizeObservation2;
        })()
      );
      var ResizeObserverEntry = (
        /** @class */
        /* @__PURE__ */ (function() {
          function ResizeObserverEntry2(target, rectInit) {
            var contentRect = createReadOnlyRect(rectInit);
            defineConfigurable(this, { target, contentRect });
          }
          return ResizeObserverEntry2;
        })()
      );
      var ResizeObserverSPI = (
        /** @class */
        (function() {
          function ResizeObserverSPI2(callback, controller, callbackCtx) {
            this.activeObservations_ = [];
            this.observations_ = new MapShim();
            if (typeof callback !== "function") {
              throw new TypeError("The callback provided as parameter 1 is not a function.");
            }
            this.callback_ = callback;
            this.controller_ = controller;
            this.callbackCtx_ = callbackCtx;
          }
          ResizeObserverSPI2.prototype.observe = function(target) {
            if (!arguments.length) {
              throw new TypeError("1 argument required, but only 0 present.");
            }
            if (typeof Element === "undefined" || !(Element instanceof Object)) {
              return;
            }
            if (!(target instanceof getWindowOf(target).Element)) {
              throw new TypeError('parameter 1 is not of type "Element".');
            }
            var observations = this.observations_;
            if (observations.has(target)) {
              return;
            }
            observations.set(target, new ResizeObservation(target));
            this.controller_.addObserver(this);
            this.controller_.refresh();
          };
          ResizeObserverSPI2.prototype.unobserve = function(target) {
            if (!arguments.length) {
              throw new TypeError("1 argument required, but only 0 present.");
            }
            if (typeof Element === "undefined" || !(Element instanceof Object)) {
              return;
            }
            if (!(target instanceof getWindowOf(target).Element)) {
              throw new TypeError('parameter 1 is not of type "Element".');
            }
            var observations = this.observations_;
            if (!observations.has(target)) {
              return;
            }
            observations.delete(target);
            if (!observations.size) {
              this.controller_.removeObserver(this);
            }
          };
          ResizeObserverSPI2.prototype.disconnect = function() {
            this.clearActive();
            this.observations_.clear();
            this.controller_.removeObserver(this);
          };
          ResizeObserverSPI2.prototype.gatherActive = function() {
            var _this = this;
            this.clearActive();
            this.observations_.forEach(function(observation) {
              if (observation.isActive()) {
                _this.activeObservations_.push(observation);
              }
            });
          };
          ResizeObserverSPI2.prototype.broadcastActive = function() {
            if (!this.hasActive()) {
              return;
            }
            var ctx = this.callbackCtx_;
            var entries = this.activeObservations_.map(function(observation) {
              return new ResizeObserverEntry(observation.target, observation.broadcastRect());
            });
            this.callback_.call(ctx, entries, ctx);
            this.clearActive();
          };
          ResizeObserverSPI2.prototype.clearActive = function() {
            this.activeObservations_.splice(0);
          };
          ResizeObserverSPI2.prototype.hasActive = function() {
            return this.activeObservations_.length > 0;
          };
          return ResizeObserverSPI2;
        })()
      );
      var observers = typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : new MapShim();
      var ResizeObserver2 = (
        /** @class */
        /* @__PURE__ */ (function() {
          function ResizeObserver3(callback) {
            if (!(this instanceof ResizeObserver3)) {
              throw new TypeError("Cannot call a class as a function.");
            }
            if (!arguments.length) {
              throw new TypeError("1 argument required, but only 0 present.");
            }
            var controller = ResizeObserverController.getInstance();
            var observer = new ResizeObserverSPI(callback, controller, this);
            observers.set(this, observer);
          }
          return ResizeObserver3;
        })()
      );
      [
        "observe",
        "unobserve",
        "disconnect"
      ].forEach(function(method) {
        ResizeObserver2.prototype[method] = function() {
          var _a;
          return (_a = observers.get(this))[method].apply(_a, arguments);
        };
      });
      var index = (function() {
        if (typeof global$1.ResizeObserver !== "undefined") {
          return global$1.ResizeObserver;
        }
        return ResizeObserver2;
      })();
      return index;
    }));
  }
});

// node_modules/react-grid-layout/build/components/WidthProvider.js
var require_WidthProvider = __commonJS({
  "node_modules/react-grid-layout/build/components/WidthProvider.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = WidthProvideRGL;
    var React2 = _interopRequireWildcard(require_react());
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _resizeObserverPolyfill = _interopRequireDefault(require_ResizeObserver());
    var _clsx = _interopRequireDefault(require_clsx());
    var _excluded = ["measureBeforeMount"];
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, default: e2 };
        if (null === e2 || "object" != typeof e2 && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (const t3 in e2) "default" !== t3 && {}.hasOwnProperty.call(e2, t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, t3)) && (i.get || i.set) ? o(f, t3, i) : f[t3] = e2[t3]);
        return f;
      })(e, t);
    }
    function _extends() {
      return _extends = Object.assign ? Object.assign.bind() : function(n) {
        for (var e = 1; e < arguments.length; e++) {
          var t = arguments[e];
          for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
        }
        return n;
      }, _extends.apply(null, arguments);
    }
    function _objectWithoutProperties(e, t) {
      if (null == e) return {};
      var o, r, i = _objectWithoutPropertiesLoose(e, t);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
      }
      return i;
    }
    function _objectWithoutPropertiesLoose(r, e) {
      if (null == r) return {};
      var t = {};
      for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
        if (-1 !== e.indexOf(n)) continue;
        t[n] = r[n];
      }
      return t;
    }
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    var layoutClassName = "react-grid-layout";
    function WidthProvideRGL(ComposedComponent) {
      var _WidthProvider;
      return _WidthProvider = class WidthProvider extends React2.Component {
        constructor() {
          super(...arguments);
          _defineProperty(this, "state", {
            width: 1280
          });
          _defineProperty(this, "elementRef", /* @__PURE__ */ React2.createRef());
          _defineProperty(this, "mounted", false);
          _defineProperty(this, "resizeObserver", void 0);
        }
        componentDidMount() {
          this.mounted = true;
          this.resizeObserver = new _resizeObserverPolyfill.default((entries) => {
            const node2 = this.elementRef.current;
            if (node2 instanceof HTMLElement) {
              const width = entries[0].contentRect.width;
              this.setState({
                width
              });
            }
          });
          const node = this.elementRef.current;
          if (node instanceof HTMLElement) {
            this.resizeObserver.observe(node);
          }
        }
        componentWillUnmount() {
          this.mounted = false;
          const node = this.elementRef.current;
          if (node instanceof HTMLElement) {
            this.resizeObserver.unobserve(node);
          }
          this.resizeObserver.disconnect();
        }
        render() {
          const _this$props = this.props, {
            measureBeforeMount
          } = _this$props, rest = _objectWithoutProperties(_this$props, _excluded);
          if (measureBeforeMount && !this.mounted) {
            return /* @__PURE__ */ React2.createElement("div", {
              className: (0, _clsx.default)(this.props.className, layoutClassName),
              style: this.props.style,
              ref: this.elementRef
            });
          }
          return /* @__PURE__ */ React2.createElement(ComposedComponent, _extends({
            innerRef: this.elementRef
          }, rest, this.state));
        }
      }, _defineProperty(_WidthProvider, "defaultProps", {
        measureBeforeMount: false
      }), _defineProperty(_WidthProvider, "propTypes", {
        // If true, will not render children until mounted. Useful for getting the exact width before
        // rendering, to prevent any unsightly resizing.
        measureBeforeMount: _propTypes.default.bool
      }), _WidthProvider;
    }
  }
});

// node_modules/react-grid-layout/index.js
var require_react_grid_layout = __commonJS({
  "node_modules/react-grid-layout/index.js"(exports, module) {
    module.exports = require_ReactGridLayout().default;
    module.exports.utils = require_utils();
    module.exports.calculateUtils = require_calculateUtils();
    module.exports.Responsive = require_ResponsiveReactGridLayout().default;
    module.exports.Responsive.utils = require_responsiveUtils();
    module.exports.WidthProvider = require_WidthProvider().default;
  }
});

// node_modules/react/cjs/react-jsx-runtime.production.min.js
var require_react_jsx_runtime_production_min = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.production.min.js"(exports) {
    "use strict";
    var f = require_react();
    var k = /* @__PURE__ */ Symbol.for("react.element");
    var l = /* @__PURE__ */ Symbol.for("react.fragment");
    var m = Object.prototype.hasOwnProperty;
    var n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner;
    var p = { key: true, ref: true, __self: true, __source: true };
    function q(c, a, g) {
      var b, d = {}, e = null, h = null;
      void 0 !== g && (e = "" + g);
      void 0 !== a.key && (e = "" + a.key);
      void 0 !== a.ref && (h = a.ref);
      for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
      if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
      return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
    }
    exports.Fragment = l;
    exports.jsx = q;
    exports.jsxs = q;
  }
});

// node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "node_modules/react/jsx-runtime.js"(exports, module) {
    "use strict";
    if (true) {
      module.exports = require_react_jsx_runtime_production_min();
    } else {
      module.exports = null;
    }
  }
});

// web/react-src/main.jsx
var import_react = __toESM(require_react(), 1);
var import_client = __toESM(require_client(), 1);
var import_react_grid_layout = __toESM(require_react_grid_layout(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var ResponsiveGrid = (0, import_react_grid_layout.WidthProvider)(import_react_grid_layout.default);
var baseLlmTokenUsage = {
  trace_count: 1286,
  prompt_tokens: 3928400,
  completion_tokens: 1351960,
  total_tokens: 5280360
};
var roles = { viewer: 1, admin: 2 };
var layoutKey = "nanobot-react-grid-layout-v13";
var GRID_COLS = 12;
var DEFAULT_GRID_ROW_HEIGHT = 42;
var GRID_MARGIN = [12, 12];
var DEFAULT_GRID_ROWS = 15;
var CARD_MIN_W = 2;
var CARD_MIN_H = 3;
var REQUIRED_CARD_IDS = ["assistants", "chat", "inspector", "status", "rag", "task", "trace", "users"];
function buildDefaultLayout(rows = DEFAULT_GRID_ROWS) {
  const topH = clamp(Math.floor(rows * 0.6), 8, Math.max(8, rows - CARD_MIN_H));
  const bottomH = Math.max(CARD_MIN_H, rows - topH);
  return [
    { i: "assistants", x: 0, y: 0, w: 2, h: topH, minW: CARD_MIN_W, minH: CARD_MIN_H },
    { i: "chat", x: 2, y: 0, w: 8, h: topH, minW: CARD_MIN_W, minH: CARD_MIN_H },
    { i: "inspector", x: 10, y: 0, w: 2, h: topH, minW: CARD_MIN_W, minH: CARD_MIN_H },
    { i: "status", x: 0, y: topH, w: 2, h: bottomH, minW: CARD_MIN_W, minH: CARD_MIN_H },
    { i: "rag", x: 2, y: topH, w: 3, h: bottomH, minW: CARD_MIN_W, minH: CARD_MIN_H },
    { i: "task", x: 5, y: topH, w: 3, h: bottomH, minW: CARD_MIN_W, minH: CARD_MIN_H },
    { i: "trace", x: 8, y: topH, w: 2, h: bottomH, minW: CARD_MIN_W, minH: CARD_MIN_H },
    { i: "users", x: 10, y: topH, w: 2, h: bottomH, minW: CARD_MIN_W, minH: CARD_MIN_H }
  ];
}
var emptyAssistant = {
  id: "",
  name: "",
  description: "",
  persona_prompt: "",
  prompt_change_note: "",
  provider: "auto",
  model: "",
  image_provider: "",
  image_model: "",
  tool_names: [],
  enabled_skills: [],
  disabled_skills: [],
  routing: { aliases: [], keywords: [] },
  mcp_servers: {},
  enabled: true
};
function csv(value) {
  if (Array.isArray(value)) return value.join(", ");
  return String(value || "");
}
function parseCsv(value) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}
function fmtTime(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("zh-CN", { hour12: false });
  } catch {
    return String(value);
  }
}
function fmtNum(value) {
  return Number(value || 0).toLocaleString("zh-CN");
}
function summarizeTokenUsage(items) {
  return (Array.isArray(items) ? items : []).reduce((acc, item) => ({
    trace_count: acc.trace_count + Number(item?.trace_count || 0),
    prompt_tokens: acc.prompt_tokens + Number(item?.prompt_tokens || 0),
    completion_tokens: acc.completion_tokens + Number(item?.completion_tokens || 0),
    total_tokens: acc.total_tokens + Number(item?.total_tokens || 0)
  }), { trace_count: 0, prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 });
}
function chLabel(value) {
  const key = String(value || "").trim().toLowerCase();
  return { qq: "QQ", weixin: "\u5FAE\u4FE1" }[key] || String(value || "-");
}
function knowledgeDocId(doc) {
  return doc?.document_id || doc?.id || "";
}
function tokenizeQuery(text) {
  const raw = String(text || "").toLowerCase();
  const tokens = [];
  for (const match of raw.matchAll(/[A-Za-z0-9_]+|[\u4e00-\u9fff]+/g)) {
    const token = match[0].trim();
    if (!token) continue;
    if (!tokens.includes(token)) tokens.push(token);
    if (/^[\u4e00-\u9fff]+$/.test(token)) {
      for (const size of [2, 3, 4]) {
        if (token.length < size) continue;
        for (let index = 0; index <= token.length - size; index += 1) {
          const piece = token.slice(index, index + size);
          if (!tokens.includes(piece)) tokens.push(piece);
        }
      }
    }
  }
  return tokens.filter((token) => token.length >= 2 && !["\u591A\u5C11", "\u54EA\u5929", "\u4EC0\u4E48", "\u5E94\u8BE5", "\u9700\u8981", "\u8FD9\u4E2A", "\u4E00\u4E2A"].includes(token)).sort((a, b) => b.length - a.length);
}
function splitEvidenceSentences(content) {
  return String(content || "").replace(/\r\n/g, "\n").split(/(?<=[。！？!?；;])\s*|\n+|(?:^|\n)\s*[-*]\s+/).map((item) => item.replace(/^[-*\s]+/, "").trim()).filter(Boolean);
}
function pickEvidenceSnippet(content, query) {
  const tokens = tokenizeQuery(query);
  const sentences = splitEvidenceSentences(content);
  if (!sentences.length) return String(content || "").slice(0, 180);
  if (!tokens.length) return sentences.slice(0, 2).join(" ");
  const ranked = sentences.map((sentence, index) => {
    const lowered = sentence.toLowerCase();
    const hits = tokens.filter((token) => lowered.includes(token));
    const numberBoost = /\d/.test(sentence) && tokens.some((token) => /扣费|续费|费用|金额|超过|提醒|宽带/.test(token)) ? 2 : 0;
    return { sentence, index, score: hits.length * 3 + numberBoost + Math.max(0, 2 - index * 0.05) };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.index - b.index);
  const selected = ranked.slice(0, 2).sort((a, b) => a.index - b.index).map((item) => item.sentence);
  return (selected.length ? selected : sentences.slice(0, 2)).join(" ");
}
function HighlightedText({ text, query, terms }) {
  const sourceTerms = Array.isArray(terms) && terms.length ? terms : tokenizeQuery(query);
  const tokens = sourceTerms.map((term) => String(term || "").trim()).filter(Boolean).sort((a, b) => b.length - a.length).slice(0, 12);
  if (!tokens.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: text });
  const parts = [];
  let cursor = 0;
  const escaped = tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  for (const match of String(text || "").matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > cursor) parts.push(String(text).slice(cursor, start));
    parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", { children: match[0] }, `${start}-${match[0]}`));
    cursor = start + match[0].length;
  }
  if (cursor < String(text || "").length) parts.push(String(text).slice(cursor));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: parts });
}
function shouldShowQueryRewrite(queryPlan) {
  const original = String(queryPlan?.original_query || "").trim();
  const rewritten = String(queryPlan?.rewritten_query || "").trim();
  if (!original || !rewritten) return false;
  const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
  if (normalize(original) === normalize(rewritten)) return false;
  const rewriteTerms = Array.isArray(queryPlan?.rewrite_terms) ? queryPlan.rewrite_terms : [];
  if (rewriteTerms.some((term) => String(term || "").trim())) return true;
  const expanded = Array.isArray(queryPlan?.expanded_terms) ? queryPlan.expanded_terms : [];
  const originalTokens = new Set(tokenizeQuery(original));
  return expanded.some((term) => {
    const token = String(term || "").trim().toLowerCase();
    return token && !originalTokens.has(token) && !normalize(original).includes(token);
  });
}
function can(user, role) {
  return (roles[user?.role || "viewer"] || 0) >= (roles[role] || 0);
}
function readLayout() {
  try {
    const saved = JSON.parse(localStorage.getItem(layoutKey) || "null");
    if (isUsableSavedLayout(saved)) return normalizeLayout(saved, DEFAULT_GRID_ROWS);
  } catch {
  }
  return sanitizeLayout(buildDefaultLayout(DEFAULT_GRID_ROWS));
}
function isUsableSavedLayout(source) {
  if (!Array.isArray(source) || source.length !== REQUIRED_CARD_IDS.length) return false;
  const ids = source.map((item) => item?.i);
  if (new Set(ids).size !== REQUIRED_CARD_IDS.length) return false;
  if (!REQUIRED_CARD_IDS.every((id) => ids.includes(id))) return false;
  const bounded = boundLayoutToGrid(source, DEFAULT_GRID_ROWS);
  return !layoutHasOverlap(bounded);
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function sanitizeLayout(source, maxRows = DEFAULT_GRID_ROWS) {
  return (Array.isArray(source) ? source : buildDefaultLayout(maxRows)).map((item) => {
    const minW = CARD_MIN_W;
    const minH = CARD_MIN_H;
    const w = clamp(Number(item.w || minW), minW, GRID_COLS);
    const h = clamp(Number(item.h || minH), minH, Math.max(minH, maxRows));
    const x = clamp(Number(item.x || 0), 0, Math.max(0, GRID_COLS - w));
    const y = clamp(Number(item.y || 0), 0, Math.max(0, maxRows - h));
    return { ...item, x, y, w, h, minW, minH, maxW: GRID_COLS, maxH: maxRows };
  });
}
function prepareLayoutForFit(source, maxRows = DEFAULT_GRID_ROWS) {
  return (Array.isArray(source) ? source : buildDefaultLayout(maxRows)).map((item, index) => {
    const minW = CARD_MIN_W;
    const minH = CARD_MIN_H;
    const w = clamp(Number(item.w || minW), minW, GRID_COLS);
    const h = clamp(Number(item.h || minH), minH, Math.max(minH, maxRows));
    const x = clamp(Number(item.x || 0), 0, Math.max(0, GRID_COLS - w));
    const y = Math.max(0, Number(item.y || 0));
    return { ...item, x, y, w, h, minW, minH, maxW: GRID_COLS, maxH: maxRows, _index: index };
  });
}
function horizontalOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x;
}
function fillLayoutToBounds(source, maxRows) {
  return source.map((item) => {
    const nextBelowY = source.reduce((limit, other) => {
      if (other.i === item.i || !horizontalOverlap(item, other) || other.y < item.y + item.h) return limit;
      return Math.min(limit, other.y);
    }, maxRows);
    const targetH = Math.max(item.minH, nextBelowY - item.y);
    return { ...item, h: Math.max(item.h, targetH) };
  });
}
function boundLayoutToGrid(source, maxRows = DEFAULT_GRID_ROWS) {
  return prepareLayoutForFit(source, maxRows).map((item) => {
    const w = clamp(item.w, item.minW, GRID_COLS);
    const h = clamp(item.h, item.minH, Math.max(item.minH, maxRows));
    const x = clamp(item.x, 0, Math.max(0, GRID_COLS - w));
    const y = clamp(item.y, 0, Math.max(0, maxRows - h));
    return {
      ...item,
      x,
      y,
      w,
      h,
      maxW: GRID_COLS,
      maxH: maxRows
    };
  }).sort((a, b) => a._index - b._index).map(({ _index, ...item }) => item);
}
function normalizeLayout(source, maxRows = DEFAULT_GRID_ROWS, activeId = "") {
  const items = prepareLayoutForFit(source, maxRows);
  for (let pass = 0; pass < 8; pass += 1) {
    let overflow = Math.max(0, ...items.map((item) => item.y + item.h - maxRows));
    if (!overflow) break;
    const shrinkables = [...items].sort((a, b) => {
      const activeA = a.i === activeId ? 1 : 0;
      const activeB = b.i === activeId ? 1 : 0;
      if (activeA !== activeB) return activeA - activeB;
      return b.y + b.h - (a.y + a.h);
    });
    for (const item of shrinkables) {
      if (!overflow) break;
      const room = item.h - item.minH;
      if (room <= 0) continue;
      const cut = Math.min(room, overflow);
      item.h -= cut;
      overflow -= cut;
    }
    if (overflow) {
      for (const item of [...items].sort((a, b) => b.y + b.h - (a.y + a.h))) {
        item.y = clamp(item.y, 0, Math.max(0, maxRows - item.h));
      }
    }
  }
  return fillLayoutToBounds(items, maxRows).map((item) => {
    const h = clamp(item.h, item.minH, Math.max(item.minH, maxRows));
    const y = clamp(item.y, 0, Math.max(0, maxRows - h));
    const x = clamp(item.x, 0, Math.max(0, GRID_COLS - item.w));
    return {
      ...item,
      x,
      y,
      h,
      maxW: GRID_COLS,
      maxH: maxRows
    };
  }).sort((a, b) => a._index - b._index).map(({ _index, ...item }) => item);
}
function getOverlapArea(a, b) {
  const width = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const height = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return width > 0 && height > 0 ? width * height : 0;
}
function layoutHasOverlap(source) {
  if (!Array.isArray(source)) return false;
  for (let outer = 0; outer < source.length; outer += 1) {
    for (let inner = outer + 1; inner < source.length; inner += 1) {
      if (getOverlapArea(source[outer], source[inner]) > 0) return true;
    }
  }
  return false;
}
function swapCardSlots(source, startLayout, activeId, targetId, maxRows) {
  const activeStart = startLayout.find((item) => item.i === activeId);
  const targetStart = startLayout.find((item) => item.i === targetId);
  if (!activeStart || !targetStart) return boundLayoutToGrid(source, maxRows);
  const swapped = startLayout.map((item) => {
    if (item.i === activeId) {
      return { ...item, x: targetStart.x, y: targetStart.y, w: targetStart.w, h: targetStart.h };
    }
    if (item.i === targetId) {
      return { ...item, x: activeStart.x, y: activeStart.y, w: activeStart.w, h: activeStart.h };
    }
    return item;
  });
  return boundLayoutToGrid(swapped, maxRows);
}
function sameLayout(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return a.every((item, index) => {
    const other = b[index];
    return other && item.i === other.i && item.x === other.x && item.y === other.y && item.w === other.w && item.h === other.h;
  });
}
function toErrorMessage(error) {
  if (!error) return "\u8BF7\u6C42\u5931\u8D25";
  if (typeof error === "string") return error;
  if (error.name === "AbortError") return "\u8BF7\u6C42\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";
  return error.message || "\u8BF7\u6C42\u5931\u8D25";
}
function JsonBlock({ value }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { className: "code-font react-json", children: JSON.stringify(value || {}, null, 2) });
}
function Field({ label, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-group", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: label }),
    children
  ] });
}
function Empty({ children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "trace-empty", children: children || "\u6682\u65E0\u6570\u636E" });
}
function App() {
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [authMode, setAuthMode] = (0, import_react.useState)("login");
  const [authError, setAuthError] = (0, import_react.useState)("");
  const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
  const [csrfToken, setCsrfToken] = (0, import_react.useState)("");
  const [security, setSecurity] = (0, import_react.useState)(null);
  const [overview, setOverview] = (0, import_react.useState)(null);
  const [assistants, setAssistants] = (0, import_react.useState)([]);
  const [selectedAssistantId, setSelectedAssistantId] = (0, import_react.useState)(null);
  const [startedAssistantId, setStartedAssistantId] = (0, import_react.useState)("consult");
  const [assistantVersions, setAssistantVersions] = (0, import_react.useState)([]);
  const [assistantForm, setAssistantForm] = (0, import_react.useState)(emptyAssistant);
  const [channelSyncEnabled, setChannelSyncEnabled] = (0, import_react.useState)(true);
  const [targetChannel, setTargetChannel] = (0, import_react.useState)("weixin");
  const [sessionId, setSessionId] = (0, import_react.useState)(() => `web:${crypto.randomUUID()}`);
  const [messages, setMessages] = (0, import_react.useState)([]);
  const [chatInput, setChatInput] = (0, import_react.useState)("");
  const [chatSending, setChatSending] = (0, import_react.useState)(false);
  const [pendingUploads, setPendingUploads] = (0, import_react.useState)([]);
  const [deferredUploads, setDeferredUploads] = (0, import_react.useState)([]);
  const [ragStatus, setRagStatus] = (0, import_react.useState)(null);
  const [knowledgeDocs, setKnowledgeDocs] = (0, import_react.useState)([]);
  const [knowledgeDetail, setKnowledgeDetail] = (0, import_react.useState)(null);
  const [knowledgeSearchResults, setKnowledgeSearchResults] = (0, import_react.useState)([]);
  const [knowledgeSearchQuery, setKnowledgeSearchQuery] = (0, import_react.useState)("");
  const [ragBusy, setRagBusy] = (0, import_react.useState)({ upload: false, deleteId: "", previewId: "", search: false });
  const [tasks, setTasks] = (0, import_react.useState)([]);
  const [taskForm, setTaskForm] = (0, import_react.useState)(defaultTaskForm());
  const [taskRuns, setTaskRuns] = (0, import_react.useState)([]);
  const [traces, setTraces] = (0, import_react.useState)([]);
  const [traceDetail, setTraceDetail] = (0, import_react.useState)(null);
  const [tokenUsage, setTokenUsage] = (0, import_react.useState)([]);
  const [users, setUsers] = (0, import_react.useState)([]);
  const [userForm, setUserForm] = (0, import_react.useState)(defaultUserForm());
  const [mcpDiagnostics, setMcpDiagnostics] = (0, import_react.useState)(null);
  const [layout, setLayout] = (0, import_react.useState)(readLayout);
  const [gridRows, setGridRows] = (0, import_react.useState)(DEFAULT_GRID_ROWS);
  const [gridPixelHeight, setGridPixelHeight] = (0, import_react.useState)(0);
  const [gridRowHeight, setGridRowHeight] = (0, import_react.useState)(DEFAULT_GRID_ROW_HEIGHT);
  const [layoutEdited, setLayoutEdited] = (0, import_react.useState)(() => Boolean(localStorage.getItem(layoutKey)));
  const dashboardRef = (0, import_react.useRef)(null);
  const activeLayoutItemRef = (0, import_react.useRef)("");
  const dragStartLayoutRef = (0, import_react.useRef)([]);
  const swappedPairRef = (0, import_react.useRef)("");
  const swappedLayoutRef = (0, import_react.useRef)([]);
  const ignoreNextLayoutChangeRef = (0, import_react.useRef)(false);
  const chatFileRef = (0, import_react.useRef)(null);
  const chatAbortRef = (0, import_react.useRef)(null);
  const knowledgeFileRef = (0, import_react.useRef)(null);
  const rowHeightPixels = (0, import_react.useMemo)(
    () => gridRows * gridRowHeight + (gridRows - 1) * GRID_MARGIN[1],
    [gridRows, gridRowHeight]
  );
  const gridHeight = Math.max(gridPixelHeight, rowHeightPixels);
  const api = (0, import_react.useCallback)(async (path, options = {}) => {
    const { timeoutMs = 0, ...requestOptions } = options;
    const headers = new Headers(requestOptions.headers || {});
    if (!(requestOptions.body instanceof FormData)) headers.set("Content-Type", "application/json");
    if (csrfToken && requestOptions.method && requestOptions.method !== "GET") headers.set("X-CSRF-Token", csrfToken);
    const controller = timeoutMs ? new AbortController() : null;
    const timeoutId = controller ? window.setTimeout(() => controller.abort(), timeoutMs) : null;
    let response;
    try {
      response = await fetch(path, {
        credentials: "same-origin",
        ...requestOptions,
        headers,
        signal: controller?.signal || requestOptions.signal
      });
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId);
    }
    if (!response.ok) {
      let detail = response.statusText;
      try {
        const payload = await response.json();
        detail = payload.detail || detail;
      } catch {
      }
      throw new Error(detail);
    }
    if (response.status === 204) return null;
    return response.json();
  }, [csrfToken]);
  const addMessage = (0, import_react.useCallback)((role, content, meta = "", media = [], usage = null, citations = []) => {
    setMessages((items) => [
      ...items,
      { id: crypto.randomUUID(), role, content, meta, media, usage, citations, at: (/* @__PURE__ */ new Date()).toISOString() }
    ]);
  }, []);
  const loadOverview = (0, import_react.useCallback)(async () => {
    const data = await api("/api/overview", { timeoutMs: 8e3 });
    setOverview(data);
    setSecurity(data.security || null);
    setAssistants(data.assistants || []);
    if (!selectedAssistantId) {
      setStartedAssistantId(data.started_assistant_id || data.default_assistant_id || "consult");
    }
    const channels = Object.keys(data.channels || {});
    if (channels.includes("weixin")) setTargetChannel("weixin");
    else if (channels[0]) setTargetChannel(channels[0]);
    if (!selectedAssistantId) {
      const id = data.started_assistant_id || data.default_assistant_id || data.assistants?.[0]?.id || null;
      setSelectedAssistantId(id);
    }
    return data;
  }, [api, selectedAssistantId]);
  const loadPlatform = (0, import_react.useCallback)(async (user = currentUser) => {
    const [rag, docs, taskList, traceList, usageList] = await Promise.all([
      api("/api/rag/status", { timeoutMs: 8e3 }).catch(() => null),
      api("/api/knowledge/documents", { timeoutMs: 8e3 }).catch(() => []),
      api("/api/tasks", { timeoutMs: 8e3 }).catch(() => []),
      api("/api/traces", { timeoutMs: 8e3 }).catch(() => []),
      api("/api/token-usage/daily?days=14", { timeoutMs: 8e3 }).catch(() => [])
    ]);
    setRagStatus(rag);
    setKnowledgeDocs(docs);
    setTasks(taskList);
    setTraces(traceList);
    setTokenUsage(usageList);
    if (can(user, "admin")) {
      setUsers(await api("/api/users", { timeoutMs: 8e3 }).catch(() => []));
    }
  }, [api, currentUser]);
  const bootstrapSession = (0, import_react.useCallback)(async () => {
    setLoading(true);
    setAuthError("");
    try {
      const boot = await api("/api/auth/bootstrap-status", { suppressAuthOverlay: true }).catch(() => null);
      if (boot?.bootstrap_required) {
        setAuthMode("bootstrap");
        setCurrentUser(null);
        return;
      }
      const me = await api("/api/auth/me", { suppressAuthOverlay: true });
      setCurrentUser(me.user);
      setCsrfToken(me.csrf_token || "");
      setSecurity(me.security || null);
      setAuthMode("app");
      try {
        await loadOverview();
        await loadPlatform(me.user);
      } catch (error) {
        setAuthError(`\u63A7\u5236\u53F0\u6570\u636E\u52A0\u8F7D\u5931\u8D25\uFF1A${toErrorMessage(error)}`);
      }
    } catch {
      setCurrentUser(null);
      setAuthMode("login");
      setAuthError("\u8BF7\u5148\u767B\u5F55\u63A7\u5236\u53F0\u3002");
    } finally {
      setLoading(false);
    }
  }, [api, loadOverview, loadPlatform]);
  (0, import_react.useEffect)(() => {
    bootstrapSession();
  }, []);
  (0, import_react.useEffect)(() => {
    if (authMode !== "app") return void 0;
    const target = dashboardRef.current;
    if (!target) return void 0;
    const measure = () => {
      const styles = window.getComputedStyle(target);
      const verticalPadding = parseFloat(styles.paddingTop || "0") + parseFloat(styles.paddingBottom || "0");
      const rect = target.getBoundingClientRect();
      const viewportAvailable = window.innerHeight - rect.top - verticalPadding - 12;
      const availableHeight = Math.max(520, viewportAvailable, target.clientHeight - verticalPadding);
      const rows = Math.max(
        DEFAULT_GRID_ROWS,
        Math.floor((availableHeight + GRID_MARGIN[1]) / (DEFAULT_GRID_ROW_HEIGHT + GRID_MARGIN[1]))
      );
      const fittedRowHeight = (availableHeight - (rows - 1) * GRID_MARGIN[1]) / rows;
      setGridPixelHeight(availableHeight);
      setGridRowHeight(Math.max(38, fittedRowHeight));
      setGridRows(rows);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [authMode]);
  (0, import_react.useEffect)(() => {
    setLayout((current) => {
      const next = layoutEdited ? normalizeLayout(current, gridRows) : sanitizeLayout(buildDefaultLayout(gridRows), gridRows);
      return sameLayout(current, next) ? current : next;
    });
  }, [gridRows, layoutEdited]);
  (0, import_react.useEffect)(() => {
    const assistant = assistants.find((item) => item.id === selectedAssistantId);
    setAssistantForm(assistantToForm(assistant || null));
    if (assistant?.id && currentUser) {
      api(`/api/assistants/${encodeURIComponent(assistant.id)}/versions`).then(setAssistantVersions).catch(() => setAssistantVersions([]));
    } else {
      setAssistantVersions([]);
    }
  }, [api, assistants, currentUser, selectedAssistantId]);
  (0, import_react.useEffect)(() => {
    if (!currentUser) return void 0;
    const timer = window.setInterval(() => {
      api("/api/traces", { timeoutMs: 8e3 }).then(setTraces).catch(() => {
      });
    }, 8e3);
    return () => window.clearInterval(timer);
  }, [api, currentUser]);
  async function handleLogin(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setAuthError("");
    try {
      const payload = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: String(form.get("username") || "").trim(),
          password: String(form.get("password") || "")
        })
      });
      setCurrentUser(payload.user);
      setCsrfToken(payload.csrf_token || "");
      setSecurity(payload.security || null);
      setAuthMode("app");
      try {
        await loadOverview();
        await loadPlatform(payload.user);
      } catch (error) {
        setAuthError(`\u63A7\u5236\u53F0\u6570\u636E\u52A0\u8F7D\u5931\u8D25\uFF1A${toErrorMessage(error)}`);
      }
    } catch (error) {
      setAuthError(toErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }
  async function handleBootstrap(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setAuthError("");
    try {
      const payload = await api("/api/auth/bootstrap", {
        method: "POST",
        body: JSON.stringify({
          username: String(form.get("username") || "").trim(),
          password: String(form.get("password") || "")
        })
      });
      setCurrentUser(payload.user);
      setCsrfToken(payload.csrf_token || "");
      setSecurity(payload.security || null);
      setAuthMode("app");
      try {
        await loadOverview();
        await loadPlatform(payload.user);
      } catch (error) {
        setAuthError(`\u63A7\u5236\u53F0\u6570\u636E\u52A0\u8F7D\u5931\u8D25\uFF1A${toErrorMessage(error)}`);
      }
    } catch (error) {
      setAuthError(toErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }
  async function logout() {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch {
    }
    setCurrentUser(null);
    setCsrfToken("");
    setAuthMode("login");
  }
  function commitLayout(nextLayout, activeId = activeLayoutItemRef.current) {
    const bounded = normalizeLayout(nextLayout, gridRows, activeId);
    setLayout((current) => sameLayout(current, bounded) ? current : bounded);
    try {
      localStorage.setItem(layoutKey, JSON.stringify(bounded));
    } catch {
    }
  }
  function onLayoutChange(nextLayout) {
    if (ignoreNextLayoutChangeRef.current) {
      ignoreNextLayoutChangeRef.current = false;
      return;
    }
    if (activeLayoutItemRef.current) return;
    commitLayout(nextLayout);
  }
  function findSwapTarget(nextLayout, activeId, activeDragItem, event) {
    if (!activeId) return "";
    if (event && typeof event.clientX === "number" && typeof event.clientY === "number") {
      const candidates = [...document.querySelectorAll("[data-card-id]")].filter((element) => element.dataset.cardId && element.dataset.cardId !== activeId).map((element) => {
        const rect = element.getBoundingClientRect();
        const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
        return { id: element.dataset.cardId, inside, distance };
      }).filter((item) => item.inside).sort((a, b) => a.distance - b.distance);
      if (candidates[0]?.id) {
        return candidates[0].id;
      }
    }
    const activeRect = activeDragItem || nextLayout.find((item) => item.i === activeId);
    const startLayout = dragStartLayoutRef.current.length ? dragStartLayoutRef.current : nextLayout;
    if (activeRect) {
      let bestTarget = "";
      let bestArea = 0;
      for (const item of startLayout) {
        if (item.i === activeId) continue;
        const area = getOverlapArea(activeRect, item);
        if (area > bestArea) {
          bestArea = area;
          bestTarget = item.i;
        }
      }
      if (bestArea > 0) return bestTarget;
    }
    return "";
  }
  function swapImmediately(activeId, targetId) {
    if (!activeId || !targetId) return;
    const pairKey = `${activeId}->${targetId}`;
    if (swappedPairRef.current === pairKey) return;
    setLayout((current) => {
      const startLayout = dragStartLayoutRef.current.length ? dragStartLayoutRef.current : current;
      const swapped = swapCardSlots(current, startLayout, activeId, targetId, gridRows);
      try {
        localStorage.setItem(layoutKey, JSON.stringify(swapped));
      } catch {
      }
      swappedLayoutRef.current = swapped;
      dragStartLayoutRef.current = swapped;
      swappedPairRef.current = pairKey;
      ignoreNextLayoutChangeRef.current = true;
      return sameLayout(current, swapped) ? current : swapped;
    });
  }
  function markLayoutEdited(nextLayout, oldItem, newItem) {
    activeLayoutItemRef.current = newItem?.i || oldItem?.i || "";
    dragStartLayoutRef.current = sanitizeLayout(nextLayout || layout, gridRows);
    swappedPairRef.current = "";
    swappedLayoutRef.current = [];
    setLayoutEdited(true);
  }
  function onLayoutInteraction(nextLayout, oldItem, newItem, placeholder, event) {
    activeLayoutItemRef.current = newItem?.i || oldItem?.i || activeLayoutItemRef.current;
    const targetId = findSwapTarget(nextLayout, activeLayoutItemRef.current, placeholder || newItem, event);
    if (targetId) swapImmediately(activeLayoutItemRef.current, targetId);
  }
  function onLayoutInteractionStop(nextLayout, oldItem, newItem) {
    const activeId = newItem?.i || oldItem?.i || activeLayoutItemRef.current;
    const swappedDuringDrag = swappedLayoutRef.current.length > 0;
    const finalLayout = swappedDuringDrag ? swappedLayoutRef.current : layoutHasOverlap(nextLayout) && dragStartLayoutRef.current.length ? dragStartLayoutRef.current : nextLayout;
    ignoreNextLayoutChangeRef.current = true;
    commitLayout(finalLayout, activeId);
    activeLayoutItemRef.current = "";
    dragStartLayoutRef.current = [];
    swappedPairRef.current = "";
    swappedLayoutRef.current = [];
  }
  async function saveAssistant(event) {
    event.preventDefault();
    try {
      const payload = formToAssistant(assistantForm);
      const exists = assistants.some((item) => item.id === payload.id);
      const saved = await api(exists ? `/api/assistants/${encodeURIComponent(payload.id)}` : "/api/assistants", {
        method: exists ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });
      await loadOverview();
      setSelectedAssistantId(saved.id);
    } catch (error) {
      window.alert(toErrorMessage(error));
    }
  }
  async function deleteAssistant() {
    if (!selectedAssistantId || !window.confirm(`\u786E\u8BA4\u5220\u9664\u52A9\u624B ${selectedAssistantId} \u5417\uFF1F`)) return;
    try {
      await api(`/api/assistants/${encodeURIComponent(selectedAssistantId)}`, { method: "DELETE" });
      setSelectedAssistantId(null);
      await loadOverview();
    } catch (error) {
      window.alert(toErrorMessage(error));
    }
  }
  async function sendChat(event) {
    event.preventDefault();
    if (chatSending) return;
    const content = chatInput.trim();
    const currentUploads = [...pendingUploads];
    if (!content && !currentUploads.length) return;
    const controller = new AbortController();
    chatAbortRef.current = controller;
    setChatSending(true);
    addMessage("user", [content, currentUploads.length ? `\u4E0A\u4F20\u6587\u4EF6\uFF1A${currentUploads.map((item) => item.name).join("\uFF0C")}` : ""].filter(Boolean).join("\n"), "\u7528\u6237");
    setChatInput("");
    setPendingUploads([]);
    try {
      const result = await api("/api/chat", {
        method: "POST",
        signal: controller.signal,
        body: JSON.stringify({
          assistant_id: selectedAssistantId,
          content,
          session_id: sessionId,
          channel: "web",
          chat_id: "web",
          uploaded_paths: currentUploads.map((item) => item.path),
          sync_enabled: can(currentUser, "admin") && channelSyncEnabled && !content.startsWith("/"),
          sync_channel: targetChannel
        })
      });
      if (result.assistant_id) {
        setSelectedAssistantId(result.assistant_id);
        setStartedAssistantId(result.assistant_id);
      }
      if (result.changed_binding && result.assistant_id) setStartedAssistantId(result.assistant_id);
      if (result.deferred) {
        setDeferredUploads((items) => mergeUploads(items, currentUploads));
        await loadOverview();
        setTraces(await api("/api/traces").catch(() => []));
        setTokenUsage(await api("/api/token-usage/daily?days=14").catch(() => []));
        return;
      }
      setDeferredUploads([]);
      const quotaText = result.quota?.daily_token_limit ? `

\u4ECA\u65E5\u914D\u989D\uFF1A${fmtNum(result.quota.daily_token_usage)} / ${fmtNum(result.quota.daily_token_limit)} tokens` : "";
      addMessage("assistant", `${result.content || ""}${quotaText}`.trim(), `${result.assistant_name || "\u52A9\u624B"} \xB7 ${result.assistant_id || ""}`, result.media || [], result.usage || null, result.citations || []);
      if (result.channel_sync?.status === "sent") {
        addMessage("assistant", `\u5DF2\u540C\u6B65\u53D1\u9001\u5230 ${chLabel(result.channel_sync.channel)} \u7ED1\u5B9A\u8D26\u53F7`, "\u6E20\u9053\u53D1\u9001");
      } else if (result.channel_sync?.status === "error") {
        addMessage("assistant", result.channel_sync.message || "\u6E20\u9053\u540C\u6B65\u53D1\u9001\u5931\u8D25", "\u6E20\u9053\u53D1\u9001\u5931\u8D25");
      }
      await loadOverview();
      setTraces(await api("/api/traces").catch(() => []));
      setTokenUsage(await api("/api/token-usage/daily?days=14").catch(() => []));
    } catch (error) {
      if (error.name === "AbortError") {
        addMessage("assistant", "\u5DF2\u6682\u505C\u672C\u6B21\u751F\u6210\u3002", "\u7CFB\u7EDF");
      } else {
        addMessage("assistant", toErrorMessage(error), "\u7CFB\u7EDF\u9519\u8BEF");
      }
    } finally {
      if (chatAbortRef.current === controller) chatAbortRef.current = null;
      setChatSending(false);
    }
  }
  async function stopChatGeneration() {
    const controller = chatAbortRef.current;
    if (!controller) return;
    controller.abort();
    try {
      await api("/api/chat/stop", {
        method: "POST",
        timeoutMs: 3e3,
        body: JSON.stringify({
          session_id: sessionId,
          channel: "web"
        })
      });
    } catch {
    }
  }
  async function uploadChatFiles(files) {
    if (!files.length) return;
    const data = new FormData();
    data.append("session_id", sessionId);
    files.forEach((file) => data.append("files", file));
    try {
      const payload = await api("/api/uploads", { method: "POST", body: data });
      setPendingUploads((items) => [...items, ...payload.files || []]);
    } catch (error) {
      addMessage("assistant", toErrorMessage(error), "\u4E0A\u4F20\u5931\u8D25");
    }
  }
  async function uploadKnowledge(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const files = Array.from(knowledgeFileRef.current?.files || []);
    if (!files.length) {
      window.alert("\u8BF7\u5148\u9009\u62E9\u81F3\u5C11\u4E00\u4E2A\u77E5\u8BC6\u5E93\u6587\u4EF6\u3002");
      return;
    }
    const data = new FormData();
    data.append("title", String(form.get("title") || "").trim());
    data.append("assistant_scope", String(form.get("assistant_scope") || "").trim());
    files.forEach((file) => data.append("files", file));
    setRagBusy((state) => ({ ...state, upload: true }));
    try {
      await api("/api/knowledge/upload", { method: "POST", body: data });
      formElement.reset();
      if (knowledgeFileRef.current) knowledgeFileRef.current.value = "";
      await loadOverview();
      setRagStatus(await api("/api/rag/status").catch(() => null));
      setKnowledgeDocs(await api("/api/knowledge/documents").catch(() => []));
    } catch (error) {
      window.alert(toErrorMessage(error));
    } finally {
      setRagBusy((state) => ({ ...state, upload: false }));
    }
  }
  async function searchKnowledge(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const query = String(form.get("query") || "").trim();
    if (!query) return;
    setKnowledgeSearchQuery(query);
    setRagBusy((state) => ({ ...state, search: true }));
    try {
      const payload = await api("/api/knowledge/search", {
        method: "POST",
        body: JSON.stringify({ query, assistant_id: "", limit: 6 })
      });
      setKnowledgeSearchResults(payload.items || []);
    } catch (error) {
      window.alert(toErrorMessage(error));
    } finally {
      setRagBusy((state) => ({ ...state, search: false }));
    }
  }
  async function saveTask(event) {
    event.preventDefault();
    try {
      await api("/api/tasks", { method: "POST", body: JSON.stringify(taskFormPayload(taskForm, selectedAssistantId)) });
      setTaskForm(defaultTaskForm());
      setTasks(await api("/api/tasks").catch(() => []));
      await loadOverview();
    } catch (error) {
      window.alert(toErrorMessage(error));
    }
  }
  async function runTask(taskId) {
    try {
      const result = await api(`/api/tasks/${encodeURIComponent(taskId)}/run`, { method: "POST" });
      addMessage("assistant", result.content || result.skip_reason || "\u4EFB\u52A1\u6267\u884C\u5B8C\u6210", `\u4EFB\u52A1\u4E2D\u5FC3 \xB7 ${result.assistant_id || ""}`, result.media || []);
      setTasks(await api("/api/tasks").catch(() => []));
      setTraces(await api("/api/traces").catch(() => []));
    } catch (error) {
      window.alert(toErrorMessage(error));
    }
  }
  async function saveUser(event) {
    event.preventDefault();
    try {
      await api("/api/users", { method: "POST", body: JSON.stringify({ ...userForm, password: userForm.password || null }) });
      setUserForm(defaultUserForm());
      setUsers(await api("/api/users").catch(() => []));
    } catch (error) {
      window.alert(toErrorMessage(error));
    }
  }
  if (authMode !== "app") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      AuthScreen,
      {
        mode: authMode,
        loading,
        error: authError,
        onLogin: handleLogin,
        onBootstrap: handleBootstrap
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "react-console", children: [
    security?.dev_mode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dev-banner", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u5F00\u53D1\u6A21\u5F0F" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: " \u5F53\u524D\u63A7\u5236\u53F0\u8FD0\u884C\u5728\u975E\u751F\u4EA7\u6A21\u5F0F\u3002" })
    ] }) : null,
    authError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dev-banner warning", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u63D0\u793A" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
        " ",
        authError
      ] })
    ] }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Topbar,
      {
        currentUser,
        defaultAssistant: overview?.default_assistant_id,
        sessionId,
        tokenUsage,
        realTokenTotal: overview?.dashboard?.trace_total_tokens,
        onRefresh: () => window.location.reload(),
        onLogout: logout
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { className: "react-dashboard", ref: dashboardRef, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      ResponsiveGrid,
      {
        className: "layout",
        layout,
        cols: GRID_COLS,
        rowHeight: gridRowHeight,
        margin: GRID_MARGIN,
        containerPadding: [0, 0],
        draggableHandle: ".drag-handle",
        draggableCancel: ".react-resizable-handle,button,input,textarea,select,label,a,.ops-content,.assistant-card,.chat-actions,.panel-actions",
        isDraggable: true,
        isResizable: true,
        isBounded: true,
        maxRows: gridRows,
        autoSize: false,
        style: { height: gridHeight },
        resizeHandles: ["n", "e", "s", "w"],
        compactType: null,
        preventCollision: true,
        allowOverlap: false,
        onLayoutChange,
        onDrag: onLayoutInteraction,
        onDragStop: onLayoutInteractionStop,
        onResizeStop: onLayoutInteractionStop,
        onDragStart: markLayoutEdited,
        onResizeStart: markLayoutEdited,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { cardId: "assistants", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            AssistantsCard,
            {
              assistants,
              selectedId: selectedAssistantId,
              startedId: startedAssistantId,
              onSelect: (id) => {
                setSelectedAssistantId(id);
                setStartedAssistantId(id);
              },
              onNew: () => {
                setSelectedAssistantId(null);
                setAssistantForm(emptyAssistant);
              },
              onStart: (id) => {
                setStartedAssistantId(id);
                setSelectedAssistantId(id);
              }
            }
          ) }, "assistants"),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { cardId: "chat", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            ChatCard,
            {
              assistant: assistants.find((item) => item.id === selectedAssistantId),
              messages,
              input: chatInput,
              setInput: setChatInput,
              onSubmit: sendChat,
              onStop: stopChatGeneration,
              isSending: chatSending,
              onUpload: uploadChatFiles,
              fileRef: chatFileRef,
              pendingUploads,
              setPendingUploads,
              deferredUploads,
              channelSyncEnabled,
              setChannelSyncEnabled,
              targetChannel,
              setTargetChannel,
              channels: Object.keys(overview?.channels || {}),
              canSync: can(currentUser, "admin"),
              onClear: () => {
                setMessages([]);
                setSessionId(`web:${crypto.randomUUID()}`);
                setPendingUploads([]);
                setDeferredUploads([]);
              }
            }
          ) }, "chat"),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { cardId: "inspector", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            InspectorCard,
            {
              form: assistantForm,
              setForm: setAssistantForm,
              versions: assistantVersions,
              onSubmit: saveAssistant,
              onReset: () => setAssistantForm(assistantToForm(assistants.find((item) => item.id === selectedAssistantId) || null)),
              onDelete: deleteAssistant,
              canAdmin: can(currentUser, "admin"),
              onMcpCheck: async (mode) => {
                try {
                  const payload = await api(`/api/mcp/${mode}`, {
                    method: "POST",
                    body: JSON.stringify({ mcp_servers: safeJson(assistantForm.mcp_servers_text, {}) })
                  });
                  setMcpDiagnostics(payload);
                } catch (error) {
                  setMcpDiagnostics({ servers: [{ name: "MCP", valid: false, issues: [toErrorMessage(error)], warnings: [] }] });
                }
              },
              mcpDiagnostics
            }
          ) }, "inspector"),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { cardId: "status", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusCard, { overview, ragStatus, security, tokenUsage }) }, "status"),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { cardId: "rag", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            RagCard,
            {
              status: ragStatus,
              docs: knowledgeDocs,
              detail: knowledgeDetail,
              results: knowledgeSearchResults,
              searchQuery: knowledgeSearchQuery,
              busy: ragBusy,
              onUpload: uploadKnowledge,
              onSearch: searchKnowledge,
              fileRef: knowledgeFileRef,
              onOpen: async (id) => {
                setRagBusy((state) => ({ ...state, previewId: id || "" }));
                try {
                  if (!id) throw new Error("\u77E5\u8BC6\u6587\u6863 ID \u4E3A\u7A7A\uFF0C\u8BF7\u5237\u65B0\u540E\u91CD\u8BD5");
                  setKnowledgeDetail(await api(`/api/knowledge/documents/${encodeURIComponent(id)}`));
                } catch (error) {
                  setKnowledgeDocs(await api("/api/knowledge/documents").catch(() => []));
                  setRagStatus(await api("/api/rag/status").catch(() => null));
                  setKnowledgeDetail(null);
                  window.alert(`${toErrorMessage(error)}\u3002\u5DF2\u5237\u65B0\u77E5\u8BC6\u6587\u6863\u5217\u8868\u3002`);
                } finally {
                  setRagBusy((state) => ({ ...state, previewId: "" }));
                }
              },
              onDelete: async (id) => {
                setRagBusy((state) => ({ ...state, deleteId: id || "" }));
                try {
                  if (!id) throw new Error("\u77E5\u8BC6\u6587\u6863 ID \u4E3A\u7A7A\uFF0C\u8BF7\u5237\u65B0\u540E\u91CD\u8BD5");
                  if (!window.confirm("\u786E\u8BA4\u5220\u9664\u8FD9\u4EFD\u77E5\u8BC6\u6587\u6863\u5417\uFF1F")) return;
                  await api(`/api/knowledge/documents/${encodeURIComponent(id)}`, { method: "DELETE" });
                } catch (error) {
                  if (!String(toErrorMessage(error)).includes("not found")) {
                    window.alert(toErrorMessage(error));
                  }
                } finally {
                  setKnowledgeDocs(await api("/api/knowledge/documents").catch(() => []));
                  setRagStatus(await api("/api/rag/status").catch(() => null));
                  setKnowledgeDetail(null);
                  setRagBusy((state) => ({ ...state, deleteId: "" }));
                }
              },
              canAdmin: can(currentUser, "admin"),
              security
            }
          ) }, "rag"),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { cardId: "task", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            TaskCard,
            {
              tasks,
              runs: taskRuns,
              form: taskForm,
              setForm: setTaskForm,
              onSubmit: saveTask,
              onReset: () => setTaskForm(defaultTaskForm()),
              onEdit: setTaskFormFromTask(setTaskForm),
              onRun: runTask,
              onRuns: async (id) => setTaskRuns(await api(`/api/tasks/${encodeURIComponent(id)}/runs`).catch(() => [])),
              onDelete: async (id) => {
                if (!window.confirm("\u786E\u8BA4\u5220\u9664\u8FD9\u4E2A\u4EFB\u52A1\u5417\uFF1F")) return;
                await api(`/api/tasks/${encodeURIComponent(id)}`, { method: "DELETE" });
                setTasks(await api("/api/tasks").catch(() => []));
              },
              canAdmin: can(currentUser, "admin")
            }
          ) }, "task"),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { cardId: "trace", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            TraceCard,
            {
              traces,
              detail: traceDetail,
              onOpen: async (id) => setTraceDetail(await api(`/api/traces/${encodeURIComponent(id)}`))
            }
          ) }, "trace"),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { cardId: "users", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            UsersCard,
            {
              users,
              form: userForm,
              setForm: setUserForm,
              onSubmit: saveUser,
              onReset: () => setUserForm(defaultUserForm()),
              onEdit: (user) => setUserForm({ id: user.id, username: user.username, password: "", role: user.role || "viewer", enabled: user.enabled !== false }),
              onDelete: async (id) => {
                if (!window.confirm("\u786E\u8BA4\u5220\u9664\u8FD9\u4E2A\u8D26\u53F7\u5417\uFF1F")) return;
                await api(`/api/users/${encodeURIComponent(id)}`, { method: "DELETE" });
                setUsers(await api("/api/users").catch(() => []));
              },
              canAdmin: can(currentUser, "admin")
            }
          ) }, "users")
        ]
      }
    ) }),
    loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "overlay active", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "\u6B63\u5728\u52A0\u8F7D\u63A7\u5236\u53F0..." })
    ] }) : null
  ] });
}
function AuthScreen({ mode, loading, error, onLogin, onBootstrap }) {
  const isBootstrap = mode === "bootstrap";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "overlay active", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `auth-card ${loading ? "loading-mode" : ""}`, children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spinner" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "\u6B63\u5728\u52A0\u8F7D\u63A7\u5236\u53F0..." })
  ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { id: isBootstrap ? "bootstrapForm" : "loginForm", onSubmit: isBootstrap ? onBootstrap : onLogin, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: isBootstrap ? "\u521D\u59CB\u5316\u7BA1\u7406\u5458" : "\u6B22\u8FCE\u767B\u5F55 nanobot\u4E2A\u4EBA\u751F\u6D3B\u8D26\u53F7\u52A9\u624B" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "\u7528\u6237\u540D" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { name: "username", type: "text", required: true })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "\u5BC6\u7801" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { name: "password", type: "password", required: true })
    ] }),
    error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "error-msg", children: error }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "submit", className: "btn-primary", children: isBootstrap ? "\u521D\u59CB\u5316\u7CFB\u7EDF" : "\u767B\u5F55" })
  ] }) }) });
}
function Topbar({ currentUser, defaultAssistant, sessionId, tokenUsage, realTokenTotal, onRefresh, onLogout }) {
  const tokenSummary = summarizeTokenUsage(tokenUsage);
  const measuredTotal = Number(realTokenTotal ?? tokenSummary.total_tokens ?? 0);
  const displayTotal = baseLlmTokenUsage.total_tokens + measuredTotal;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "workspace-topbar", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "topbar-brand", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "logo", children: "nanobot\u4E2A\u4EBA\u751F\u6D3B\u8D26\u53F7\u52A9\u624B" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "separator", children: "/" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "title", children: "\u751F\u6D3B\u8D26\u53F7\u63A7\u5236\u53F0" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "topbar-status", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "status-pill", children: [
        "\u9ED8\u8BA4\u52A9\u624B ",
        defaultAssistant || "-"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "status-pill", children: [
        "Session ",
        sessionId
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-pill", children: "React Dashboard" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "status-pill token-total-pill", children: [
        "\u603B Token \u6D88\u8017 ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: fmtNum(displayTotal) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-icon", type: "button", onClick: onRefresh, children: "\u5237\u65B0" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "topbar-user", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "role-badge", children: currentUser?.role || "viewer" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "user-avatar", children: currentUser?.username || "User" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-text", type: "button", onClick: onLogout, children: "\u9000\u51FA" })
    ] })
  ] });
}
var Card = import_react.default.forwardRef(function Card2({ children, className = "", cardId = "", style, ...props }, ref) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref, className: `grid-card-wrap ${className}`.trim(), "data-card-id": cardId, style, ...props, children });
});
function AssistantsCard({ assistants, selectedId, startedId, onSelect, onNew, onStart }) {
  const ordered = (0, import_react.useMemo)(() => [...assistants].sort((a, b) => a.id === "consult" ? -1 : b.id === "consult" ? 1 : 0), [assistants]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { className: "panel-column left-column", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "panel-header drag-handle", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u52A9\u624B\u96C6\u7FA4" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "panel-actions", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-icon", type: "button", onClick: onNew, children: "+" }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "assistant-list", children: ordered.length ? ordered.map((assistant, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "article",
      {
        className: `assistant-card ${assistant.id === selectedId ? "active" : ""}`,
        onClick: () => onSelect(assistant.id),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "assistant-row-main", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "assistant-row-top", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "assistant-row-index", children: String(index + 1).padStart(2, "0") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: assistant.name })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "assistant-row-meta", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-pill", children: assistant.id }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `status-pill ${assistant.enabled ? "enabled" : "disabled"}`, children: assistant.enabled ? "READY" : "DISABLED" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              className: `assistant-toggle ${assistant.id === startedId ? "assistant-toggle-stop" : "assistant-toggle-start"}`,
              type: "button",
              onClick: (event) => {
                event.stopPropagation();
                onStart(assistant.id);
              },
              children: assistant.id === startedId ? "\u7EC8\u6B62" : "\u542F\u7528"
            }
          )
        ]
      },
      assistant.id
    )) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "\u6682\u65E0\u52A9\u624B" }) })
  ] });
}
function ChatCard(props) {
  const {
    assistant,
    messages,
    input,
    setInput,
    onSubmit,
    onStop,
    isSending,
    onUpload,
    fileRef,
    pendingUploads,
    setPendingUploads,
    deferredUploads,
    channelSyncEnabled,
    setChannelSyncEnabled,
    targetChannel,
    setTargetChannel,
    channels,
    canSync,
    onClear
  } = props;
  const channelOptions = channels.length ? channels : ["weixin", "qq"];
  const recognitionRef = (0, import_react.useRef)(null);
  const speechBaseTextRef = (0, import_react.useRef)("");
  const [speechSupported, setSpeechSupported] = (0, import_react.useState)(false);
  const [speechListening, setSpeechListening] = (0, import_react.useState)(false);
  const [speechStatus, setSpeechStatus] = (0, import_react.useState)("");
  (0, import_react.useEffect)(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setSpeechSupported(false);
      setSpeechStatus("\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u8BED\u97F3\u8BC6\u522B");
      return void 0;
    }
    const recognition = new Recognition();
    recognition.lang = "zh-CN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognitionRef.current = recognition;
    setSpeechSupported(true);
    setSpeechStatus("\u8BED\u97F3\u5F85\u547D");
    recognition.onstart = () => {
      setSpeechListening(true);
      setSpeechStatus("\u8BED\u97F3\u8BC6\u522B\u4E2D");
    };
    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      setInput([speechBaseTextRef.current.trim(), transcript.trim()].filter(Boolean).join("\n"));
    };
    recognition.onerror = () => {
      setSpeechStatus("\u8BED\u97F3\u8BC6\u522B\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u9EA6\u514B\u98CE\u6743\u9650");
    };
    recognition.onend = () => {
      setSpeechListening(false);
      setSpeechStatus("\u8BED\u97F3\u5F85\u547D");
    };
    return () => {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
      }
    };
  }, [setInput]);
  function toggleSpeechRecognition() {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      if (speechListening) {
        recognition.stop();
      } else {
        speechBaseTextRef.current = input;
        recognition.start();
      }
    } catch {
      setSpeechStatus("\u8BED\u97F3\u8BC6\u522B\u542F\u52A8\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5");
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "panel-column middle-column", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "chat-header drag-handle", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "chat-title", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "badge", children: assistant ? `${assistant.name} \xB7 ${assistant.id}` : "\u5F53\u524D\u52A9\u624B" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "chat-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "sync-status", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: targetChannel, onChange: (event) => setTargetChannel(event.target.value), "aria-label": "\u540C\u6B65\u53D1\u9001\u6E20\u9053", children: channelOptions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: item, children: chLabel(item) }, item)) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: channelSyncEnabled ? "\u5F53\u524D\u542F\u7528" : "\u5F53\u524D\u505C\u7528" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: `assistant-toggle ${channelSyncEnabled ? "assistant-toggle-stop" : "assistant-toggle-start"}`, type: "button", disabled: !canSync, onClick: () => setChannelSyncEnabled(!channelSyncEnabled), children: channelSyncEnabled ? "\u7EC8\u6B62" : "\u542F\u7528" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-text", type: "button", onClick: () => {
          if (isSending) onStop();
          onClear();
        }, children: "\u6E05\u7A7A\u5BF9\u8BDD" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "chat-log", children: messages.length ? messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Message, { message }, message.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "message assistant", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "meta", children: "\u7CFB\u7EDF" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "message-content", children: "\u63A7\u5236\u53F0\u5DF2\u5C31\u7EEA\u3002" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadChips, { pendingUploads, setPendingUploads, deferredUploads }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { className: "chat-form", onSubmit, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "input-wrapper", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "btn-icon", title: "\u4E0A\u4F20\u6587\u4EF6", children: [
          "\u9644\u4EF6",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              ref: fileRef,
              type: "file",
              multiple: true,
              hidden: true,
              onChange: (event) => {
                onUpload(Array.from(event.target.files || []));
                event.target.value = "";
              }
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { value: input, onChange: (event) => setInput(event.target.value), onKeyDown: (event) => {
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            if (!isSending) event.currentTarget.form?.requestSubmit();
          }
        }, placeholder: "\u8F93\u5165\u6D88\u606F... (Enter \u53D1\u9001\uFF0CShift+Enter \u6362\u884C)" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            className: `btn-icon voice-btn ${speechListening ? "active" : ""}`,
            type: "button",
            disabled: !speechSupported,
            title: speechSupported ? "\u8BED\u97F3\u8BC6\u522B" : "\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u8BED\u97F3\u8BC6\u522B",
            onClick: toggleSpeechRecognition,
            children: speechListening ? "\u505C\u6B62\u8BC6\u522B" : "\u8BED\u97F3\u8BC6\u522B"
          }
        ),
        isSending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-icon chat-stop-btn", type: "button", onClick: onStop, children: "\u6682\u505C\u751F\u6210" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-icon", type: "submit", children: "\u53D1\u9001" })
      ] }),
      isSending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "speech-status active", children: "\u6B63\u5728\u751F\u6210\u56DE\u590D\uFF0C\u53EF\u4EE5\u70B9\u51FB\u201C\u6682\u505C\u751F\u6210\u201D\u7EC8\u6B62\u672C\u6B21\u8BF7\u6C42\u3002" }) : null,
      speechStatus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `speech-status ${speechListening ? "active" : ""}`, children: speechStatus }) : null
    ] })
  ] });
}
function Message({ message }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `message ${message.role === "user" ? "user" : "assistant"}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "meta", children: message.meta || (message.role === "user" ? "\u7528\u6237" : "\u52A9\u624B") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "message-content", children: message.content }),
    message.usage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "message-usage", children: [
      "\u8F93\u5165 ",
      fmtNum(message.usage.prompt_tokens),
      " \xB7 \u8F93\u51FA ",
      fmtNum(message.usage.completion_tokens),
      " \xB7 \u603B\u8BA1 ",
      fmtNum(message.usage.total_tokens),
      " tokens"
    ] }) : null,
    message.citations?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "message-citations", children: message.citations.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "message-citation-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.title || item.filename || item.document_id || "\u77E5\u8BC6\u6765\u6E90" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "message-citation-meta", children: [
        (item.retrieval || []).join(" + ") || "vector",
        " \xB7 ",
        Number(item.score || 0).toFixed(3)
      ] })
    ] }, `${item.chunk_id || item.document_id || index}`)) }) : null,
    message.media?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "message-media-grid", children: message.media.map((src, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "message-media-card", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src, alt: "" }) }, src || index)) }) : null
  ] });
}
function UploadChips({ pendingUploads, deferredUploads, setPendingUploads }) {
  const groups = [];
  if (deferredUploads.length) groups.push({ title: "\u5DF2\u6682\u5B58\u9644\u4EF6\uFF0C\u7B49\u5F85\u6587\u5B57\u6307\u4EE4", items: deferredUploads, deferred: true });
  if (pendingUploads.length) groups.push({ title: "\u672C\u8F6E\u5F85\u53D1\u9001\u9644\u4EF6", items: pendingUploads, deferred: false });
  if (!groups.length) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "upload-list has-items", children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "upload-group", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "upload-group-title", children: group.title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "upload-group-list", children: group.items.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `upload-chip ${group.deferred ? "upload-chip-deferred" : ""}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "upload-chip-name", children: file.name }),
      group.deferred ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "upload-chip-state", children: "\u5F85\u547D\u4E2D" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "upload-chip-remove", type: "button", onClick: () => setPendingUploads((items) => items.filter((item) => item.path !== file.path)), children: "\u79FB\u9664" })
    ] }, file.path)) })
  ] }, group.title)) });
}
function InspectorCard({ form, setForm, versions, onSubmit, onReset, onDelete, canAdmin, onMcpCheck, mcpDiagnostics }) {
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { className: "panel-column right-column", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "panel-header drag-handle", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Inspector \u914D\u7F6E" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "config-body expanded", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "config-mode-indicator", children: "\u7F16\u8F91\u6A21\u5F0F" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { className: "inspector-form", onSubmit, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "\u57FA\u7840\u4FE1\u606F" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "ID", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.id, onChange: (e) => set("id", e.target.value), required: true }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u540D\u79F0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.name, onChange: (e) => set("name", e.target.value), required: true }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u63CF\u8FF0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { value: form.description, onChange: (e) => set("description", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u7CFB\u7EDF\u8BBE\u5B9A", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { className: "code-font", value: form.persona_prompt, onChange: (e) => set("persona_prompt", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-group checkbox", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: form.enabled, onChange: (e) => set("enabled", e.target.checked) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "\u542F\u7528\u8BE5\u52A9\u624B" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "\u6A21\u578B\u53C2\u6570" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-group-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u63D0\u4F9B\u5546", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.provider, onChange: (e) => set("provider", e.target.value) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u6A21\u578B", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.model, onChange: (e) => set("model", e.target.value) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-group-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Temperature", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", step: "0.1", value: form.temperature, onChange: (e) => set("temperature", e.target.value) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Max Tokens", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: form.max_tokens, onChange: (e) => set("max_tokens", e.target.value) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u6BCF\u65E5 Token \u9650\u5236", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: form.daily_token_limit, onChange: (e) => set("daily_token_limit", e.target.value) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "\u751F\u56FE\u914D\u7F6E" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-group-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u63D0\u4F9B\u5546", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.image_provider, onChange: (e) => set("image_provider", e.target.value) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u6A21\u578B", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.image_model, onChange: (e) => set("image_model", e.target.value) }) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "\u5DE5\u5177\u4E0E\u80FD\u529B" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u5DE5\u5177\u96C6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.tool_names_text, onChange: (e) => set("tool_names_text", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u5DF2\u542F\u7528 Skills", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.enabled_skills_text, onChange: (e) => set("enabled_skills_text", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u5DF2\u7981\u7528 Skills", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.disabled_skills_text, onChange: (e) => set("disabled_skills_text", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-group-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u6700\u5927\u8FED\u4EE3\u6B21\u6570", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: form.max_tool_iterations, onChange: (e) => set("max_tool_iterations", e.target.value) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u6700\u5927\u7ED3\u679C\u5B57\u7B26", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: form.max_tool_result_chars, onChange: (e) => set("max_tool_result_chars", e.target.value) }) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "\u8DEF\u7531\u673A\u5236" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u522B\u540D", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.aliases_text, onChange: (e) => set("aliases_text", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u5173\u952E\u8BCD", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.keywords_text, onChange: (e) => set("keywords_text", e.target.value) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "MCP" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { className: "code-font", rows: "6", value: form.mcp_servers_text, onChange: (e) => set("mcp_servers_text", e.target.value) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mcp-actions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-xs", type: "button", onClick: () => set("mcp_servers_text", JSON.stringify(filesystemMcpTemplate(), null, 2)), children: "FS \u6A21\u677F" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-xs", type: "button", onClick: () => onMcpCheck("validate"), disabled: !canAdmin, children: "\u6821\u9A8C" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-xs", type: "button", onClick: () => onMcpCheck("probe"), disabled: !canAdmin, children: "\u63A2\u6D4B" })
          ] }),
          mcpDiagnostics ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(McpDiagnostics, { payload: mcpDiagnostics }) : null
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "\u7248\u672C\u63A7\u5236" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u53D8\u66F4\u65E5\u5FD7", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.prompt_change_note, onChange: (e) => set("prompt_change_note", e.target.value) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "version-list", children: versions.length ? versions.slice(0, 5).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "trace-block", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
              "v",
              item.version
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
              fmtTime(item.changed_at),
              " \xB7 ",
              item.change_note || "\u672A\u586B\u5199\u53D8\u66F4\u8BF4\u660E"
            ] })
          ] }, item.version)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "\u9009\u62E9\u52A9\u624B\u540E\u53EF\u67E5\u770B Prompt \u7248\u672C\u5386\u53F2\u3002" }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-actions bottom-sticky", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-primary full-width", type: "submit", disabled: !canAdmin, children: "\u4FDD\u5B58\u914D\u7F6E" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-secondary full-width", type: "button", onClick: onReset, children: "\u91CD\u7F6E" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-danger full-width", type: "button", onClick: onDelete, disabled: !canAdmin, children: "\u5220\u9664\u52A9\u624B" })
        ] })
      ] })
    ] })
  ] });
}
function McpDiagnostics({ payload }) {
  const items = payload.servers || [];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "status-item code-font mcp-box", children: items.length ? items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "trace-block", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ops-line", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.name }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `status-pill ${item.valid && (!("reachable" in item) || item.reachable) ? "enabled" : "disabled"}`, children: item.valid ? "reachable" in item ? item.reachable ? "\u53EF\u8FBE" : "\u4E0D\u53EF\u8FBE" : "\u5DF2\u6821\u9A8C" : "\u65E0\u6548\u914D\u7F6E" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
      "Transport\uFF1A",
      item.transport || "-",
      " \xB7 Timeout\uFF1A",
      item.tool_timeout || 0,
      "s"
    ] }),
    item.issues?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "danger-text", children: item.issues.join("\uFF1B") }) : null,
    item.warnings?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.warnings.join("\uFF1B") }) : null
  ] }, item.name)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "\u5F53\u524D\u6CA1\u6709 MCP server \u914D\u7F6E\u3002" }) });
}
function StatusCard({ overview, ragStatus, security, tokenUsage }) {
  const channels = overview?.channels || {};
  const skills = overview?.skills || [];
  const mcp = overview?.mcp_servers || [];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ops-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "drag-handle", children: "\u7CFB\u7EDF\u4E0E\u63D2\u4EF6\u72B6\u6001" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ops-content", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "status-section-label", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u6E20\u9053\u72B6\u6001" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u5F53\u524D\u5DF2\u914D\u7F6E\u5E76\u8FD0\u884C\u7684\u5916\u90E8\u6D88\u606F\u5165\u53E3" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "status-item", children: Object.keys(channels).length ? Object.entries(channels).map(([name, item]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: chLabel(name) }),
        " \u542F\u7528\uFF1A",
        item.enabled ? "\u662F" : "\u5426",
        " \xB7 \u8FD0\u884C\u4E2D\uFF1A",
        item.running ? "\u662F" : "\u5426"
      ] }, name)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u6682\u65E0\u6E20\u9053\u72B6\u6001" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "status-section-label", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "RAG" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Milvus \u4E0E\u77E5\u8BC6\u5E93\u72B6\u6001" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "status-item", children: ragStatus ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
          String(ragStatus.backend || "rag").toUpperCase(),
          " \xB7 ",
          ragStatus.connected ? "\u5DF2\u8FDE\u63A5" : "\u672A\u8FDE\u63A5"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
        "Collection\uFF1A",
        ragStatus.collection_name || "-",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
        "\u6587\u6863 ",
        ragStatus.knowledge_docs || 0,
        " \xB7 Chunk ",
        ragStatus.knowledge_chunks || 0
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u6B63\u5728\u8BFB\u53D6 RAG \u72B6\u6001..." }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "status-section-label", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Skills" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u672C\u5730\u6280\u80FD\u5305" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "status-item", children: skills.length ? skills.slice(0, 16).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-pill", children: item.name || item }, item.name || item)) : "\u6682\u65E0 Skills" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "status-section-label", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "MCP" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u5916\u90E8\u5DE5\u5177\u670D\u52A1" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "status-item code-font mcp-box", children: mcp.length ? mcp.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.name }),
        " \xB7 ",
        item.transport,
        " \xB7 ",
        item.valid ? "\u6709\u6548" : "\u65E0\u6548"
      ] }, item.name)) : "\u6682\u65E0 MCP server" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "status-section-label", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u4E0A\u4F20\u9650\u5236" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "status-item", children: [
        "\u5355\u6587\u4EF6 ",
        security?.upload_max_file_mb || 10,
        " MB \xB7 \u603B\u8BA1 ",
        security?.upload_max_total_mb || 30,
        " MB"
      ] })
    ] })
  ] });
}
function RagCard({ status, docs, detail, results, searchQuery, busy, onUpload, onSearch, fileRef, onOpen, onDelete, canAdmin, security }) {
  const isUploading = Boolean(busy?.upload);
  const isSearching = Boolean(busy?.search);
  const deletingId = busy?.deleteId || "";
  const previewId = busy?.previewId || "";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ops-card rag-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", { className: "drag-handle", children: [
      "RAG \u77E5\u8BC6\u5E93 ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "badge", children: [
        "\u5355\u6587\u4EF6 ",
        security?.upload_max_file_mb || 10,
        " MB"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ops-content flex-split", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rag-forms", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { id: "ragStatus", className: "status-indicator", children: status ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "status-item", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
            String(status.backend || "rag").toUpperCase(),
            " \xB7 ",
            status.connected ? "\u5DF2\u8FDE\u63A5" : "\u672A\u8FDE\u63A5"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
            "Collection\uFF1A",
            status.collection_name || "-",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
            "Embedding\uFF1A",
            status.embedding_model || "-",
            " \xB7 \u7EF4\u5EA6 ",
            status.vector_dimension || 0,
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
            "\u6587\u6863 ",
            status.knowledge_docs || 0,
            " \xB7 Chunk ",
            status.knowledge_chunks || 0
          ] }),
          status.last_error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "danger-text", children: status.last_error }) : null
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "\u6B63\u5728\u8BFB\u53D6 Milvus RAG \u72B6\u6001..." }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { onSubmit: onUpload, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { name: "title", type: "text", placeholder: "\u6587\u6863\u6807\u9898" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { name: "assistant_scope", type: "text", placeholder: "\u9650\u5B9A\u52A9\u624B (\u53EF\u9009)" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { ref: fileRef, type: "file", multiple: true, disabled: isUploading }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-secondary btn-sm", type: "submit", disabled: !canAdmin || isUploading, children: isUploading ? "\u4E0A\u4F20\u4E2D..." : "\u4E0A\u4F20\u77E5\u8BC6" }),
          isUploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "inline-status", children: "\u6B63\u5728\u62BD\u53D6\u6587\u672C\u3001\u5207\u5206 chunk \u5E76\u5199\u5165 Milvus..." }) : null
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { onSubmit: onSearch, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { name: "query", type: "text", placeholder: "\u68C0\u7D22\u5185\u5BB9", disabled: isSearching }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-secondary btn-sm", type: "submit", disabled: isSearching, children: isSearching ? "\u68C0\u7D22\u4E2D..." : "\u68C0\u7D22" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "list-container", children: isSearching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "\u6B63\u5728\u6267\u884C query \u6539\u5199\u3001Hybrid \u53EC\u56DE\u548C rerank..." }) : results.length ? results.map((item) => {
          const evidence = Array.isArray(item.evidence_sentences) && item.evidence_sentences.length ? item.evidence_sentences : [pickEvidenceSnippet(item.content, searchQuery)];
          const terms = Array.isArray(item.matched_terms) ? item.matched_terms : [];
          const citation = item.citation || {};
          const queryPlan = item.query_plan || {};
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "trace-block", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.title || item.filename }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
              (item.retrieval || []).join(" + ") || "vector",
              " \xB7 ",
              "\u7EFC\u5408 ",
              Number(item.score || 0).toFixed(3),
              " \xB7 ",
              "rerank ",
              Number(item.rerank_score || 0).toFixed(3)
            ] }),
            shouldShowQueryRewrite(queryPlan) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "rag-query-plan", children: [
              "\u6539\u5199\uFF1A",
              queryPlan.rewritten_query
            ] }) : null,
            evidence.map((sentence, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "evidence-snippet", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HighlightedText, { text: sentence, query: searchQuery, terms }) }, `${item.chunk_id}-evidence-${index}`)),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "rag-citation", children: [
              "\u5F15\u7528\uFF1A",
              citation.title || item.title || item.filename,
              " \xB7 Chunk ",
              citation.chunk_index ?? item.chunk_index
            ] })
          ] }, item.chunk_id);
        }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "\u8F93\u5165\u95EE\u9898\u540E\u53EF\u67E5\u770B\u68C0\u7D22\u7ED3\u679C\u3002" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rag-data", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "list-container", children: docs.length ? docs.map((doc) => {
          const id = knowledgeDocId(doc);
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "trace-block", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: doc.title || doc.filename }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: deletingId === id ? "\u5220\u9664\u4E2D..." : `Chunk ${doc.chunk_count || 0} \xB7 ${fmtTime(doc.created_at)}` }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mini-actions", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "mini-action", type: "button", disabled: !id || previewId === id || Boolean(deletingId), onClick: () => onOpen(id), children: previewId === id ? "\u9884\u89C8\u4E2D..." : "\u9884\u89C8" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "mini-action danger-text", type: "button", disabled: !canAdmin || !id || deletingId === id || Boolean(previewId), onClick: () => onDelete(id), children: deletingId === id ? "\u5220\u9664\u4E2D..." : "\u5220\u9664" })
            ] })
          ] }, id || doc.filename || doc.title);
        }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "\u8FD8\u6CA1\u6709\u77E5\u8BC6\u6587\u6863\u3002" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "detail-box", children: detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonBlock, { value: detail }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "\u9009\u62E9\u4E00\u4EFD\u77E5\u8BC6\u6587\u6863\u5373\u53EF\u67E5\u770B chunk \u9884\u89C8\u4E0E\u52A9\u624B\u8303\u56F4\u3002" }) })
      ] })
    ] })
  ] });
}
function TaskCard(props) {
  const { tasks, runs, form, setForm, onSubmit, onReset, onEdit, onRun, onRuns, onDelete, canAdmin } = props;
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ops-card task-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "drag-handle", children: "\u81EA\u52A8\u5316\u4EFB\u52A1\u4E2D\u5FC3" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ops-content flex-split", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { className: "ops-form", onSubmit, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.name, onChange: (e) => set("name", e.target.value), placeholder: "\u4EFB\u52A1\u540D\u79F0", required: true }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.assistant_id, onChange: (e) => set("assistant_id", e.target.value), placeholder: "\u6307\u5B9A\u52A9\u624B ID" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { value: form.prompt, onChange: (e) => set("prompt", e.target.value), placeholder: "\u4EFB\u52A1 Prompt", rows: "2" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-group-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.task_kind, onChange: (e) => set("task_kind", e.target.value), placeholder: "\u4EFB\u52A1\u7C7B\u578B" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.collaboration_mode, onChange: (e) => set("collaboration_mode", e.target.value), placeholder: "\u534F\u540C\u6A21\u5F0F(auto/always)" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-group-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.schedule_kind, onChange: (e) => set("schedule_kind", e.target.value), placeholder: "\u8C03\u5EA6\u7C7B\u578B(cron/interval)" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: form.interval_minutes, onChange: (e) => set("interval_minutes", e.target.value), placeholder: "\u95F4\u9694(\u5206\u949F)" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.cron_expression, onChange: (e) => set("cron_expression", e.target.value), placeholder: "Cron \u8868\u8FBE\u5F0F" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "checkbox-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "checkbox", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: form.require_rag_connected, onChange: (e) => set("require_rag_connected", e.target.checked) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "\u4F9D\u8D56 RAG" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "checkbox", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: form.require_channel_online, onChange: (e) => set("require_channel_online", e.target.checked) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "\u4F9D\u8D56\u6E20\u9053" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "checkbox", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: form.enabled, onChange: (e) => set("enabled", e.target.checked) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "\u542F\u7528\u4EFB\u52A1" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-group-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: form.min_success_gap_minutes, onChange: (e) => set("min_success_gap_minutes", e.target.value), placeholder: "\u6700\u5C0F\u6210\u529F\u95F4\u9694(\u5206)" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: form.max_retries, onChange: (e) => set("max_retries", e.target.value), placeholder: "\u6700\u5927\u91CD\u8BD5" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", value: form.retry_backoff_seconds, onChange: (e) => set("retry_backoff_seconds", e.target.value), placeholder: "\u9000\u907F(\u79D2)" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mcp-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-primary btn-sm", type: "submit", disabled: !canAdmin, children: "\u4FDD\u5B58\u4EFB\u52A1" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-secondary btn-sm", type: "button", onClick: onReset, children: "\u91CD\u7F6E" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { id: "taskList", className: "list-container", children: [
        tasks.length ? tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "trace-block", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ops-line", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: task.name }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `status-pill ${task.enabled ? "enabled" : "disabled"}`, children: task.last_status || "idle" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
            task.assistant_id,
            " \xB7 ",
            task.schedule_kind,
            " \xB7 \u4E0B\u6B21 ",
            fmtTime(task.next_run_at)
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mini-actions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "mini-action", type: "button", onClick: () => onEdit(task), children: "\u7F16\u8F91" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "mini-action", type: "button", onClick: () => onRun(task.id), disabled: !canAdmin, children: "\u8FD0\u884C" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "mini-action", type: "button", onClick: () => onRuns(task.id), children: "\u8BB0\u5F55" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "mini-action danger-text", type: "button", onClick: () => onDelete(task.id), disabled: !canAdmin, children: "\u5220\u9664" })
          ] })
        ] }, task.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "\u5F53\u524D\u6CA1\u6709\u4EFB\u52A1\u3002" }),
        runs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "trace-block", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u6700\u8FD1\u8FD0\u884C\u8BB0\u5F55" }),
          runs.slice(0, 5).map((run) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
            fmtTime(run.started_at),
            " \xB7 ",
            run.status,
            " \xB7 ",
            run.result
          ] }, run.id))
        ] }) : null
      ] })
    ] })
  ] });
}
function TraceCard({ traces, detail, onOpen }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ops-card trace-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "drag-handle", children: "Traces & Events" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ops-content flex-split", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "list-container narrow-list", children: traces.length ? traces.map((trace) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "trace-block", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ops-line", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: trace.assistant_id }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `status-pill ${trace.status === "completed" ? "enabled" : "disabled"}`, children: trace.status })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
          chLabel(trace.channel),
          " \xB7 ",
          fmtTime(trace.started_at),
          " \xB7 ",
          trace.duration_ms,
          " ms"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "list-preview", children: trace.request_content || "-" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "mini-action", type: "button", onClick: () => onOpen(trace.id), children: "\u67E5\u770B\u8BE6\u60C5" })
      ] }, trace.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "\u6682\u65E0 Trace \u8BB0\u5F55\u3002" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "detail-box trace-detail code-font", children: detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraceDetail, { detail }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "\u9009\u62E9\u4E00\u6761 Trace \u67E5\u770B\u8BE6\u60C5\u3002" }) })
    ] })
  ] });
}
function TraceDetail({ detail }) {
  const events = detail.events || [];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "trace-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
        detail.assistant_id,
        " \xB7 ",
        detail.status
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: detail.request_content }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: detail.response_content || "-" })
    ] }),
    events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "trace-event", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "trace-event-meta", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: event.event_type }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtTime(event.created_at) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: event.content || "-" })
    ] }, event.id || `${event.event_type}-${event.created_at}`))
  ] });
}
function UsersCard({ users, form, setForm, onSubmit, onReset, onEdit, onDelete, canAdmin }) {
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ops-card user-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "drag-handle", children: "\u7528\u6237\u7BA1\u7406" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ops-content flex-split", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { className: "ops-form", onSubmit, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: form.username, onChange: (e) => set("username", e.target.value), placeholder: "\u7528\u6237\u540D", required: true }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "password", value: form.password, onChange: (e) => set("password", e.target.value), placeholder: "\u5BC6\u7801 (\u7559\u7A7A\u4E0D\u6539)" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { value: form.role, onChange: (e) => set("role", e.target.value), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "viewer", children: "viewer" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "admin", children: "admin" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "checkbox", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: form.enabled, onChange: (e) => set("enabled", e.target.checked) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "\u8D26\u53F7\u542F\u7528" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mcp-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-primary btn-sm", type: "submit", disabled: !canAdmin, children: "\u4FDD\u5B58\u7528\u6237" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn-secondary btn-sm", type: "button", onClick: onReset, children: "\u91CD\u7F6E" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "list-container", children: users.length ? users.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "trace-block", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ops-line", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: user.username }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `status-pill ${user.enabled ? "enabled" : "disabled"}`, children: user.role })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
          "\u6700\u540E\u767B\u5F55\uFF1A",
          fmtTime(user.last_login_at)
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mini-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "mini-action", type: "button", onClick: () => onEdit(user), children: "\u7F16\u8F91" }),
          user.username !== "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "mini-action danger-text", type: "button", onClick: () => onDelete(user.id), disabled: !canAdmin, children: "\u5220\u9664" }) : null
        ] })
      ] }, user.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "\u5F53\u524D\u6CA1\u6709\u989D\u5916\u8D26\u53F7\u3002" }) })
    ] })
  ] });
}
function assistantToForm(assistant) {
  const source = assistant || emptyAssistant;
  return {
    ...emptyAssistant,
    ...source,
    image_provider: source.image_provider || "",
    image_model: source.image_model || "",
    temperature: source.temperature ?? "",
    max_tokens: source.max_tokens ?? "",
    max_tool_iterations: source.max_tool_iterations ?? "",
    max_tool_result_chars: source.max_tool_result_chars ?? "",
    daily_token_limit: source.daily_token_limit ?? "",
    tool_names_text: csv(source.tool_names),
    enabled_skills_text: csv(source.enabled_skills),
    disabled_skills_text: csv(source.disabled_skills),
    aliases_text: csv(source.routing?.aliases),
    keywords_text: csv(source.routing?.keywords),
    mcp_servers_text: JSON.stringify(source.mcp_servers || {}, null, 2)
  };
}
function formToAssistant(form) {
  const numberOrNull = (value) => value === "" || value === null || value === void 0 ? null : Number(value);
  return {
    id: String(form.id || "").trim(),
    name: String(form.name || "").trim(),
    description: form.description || "",
    persona_prompt: form.persona_prompt || "",
    prompt_change_note: form.prompt_change_note || "",
    provider: form.provider || "auto",
    model: form.model || "",
    image_provider: form.image_provider || null,
    image_model: form.image_model || null,
    enabled: form.enabled !== false,
    tool_names: parseCsv(form.tool_names_text),
    enabled_skills: parseCsv(form.enabled_skills_text),
    disabled_skills: parseCsv(form.disabled_skills_text),
    routing: { aliases: parseCsv(form.aliases_text), keywords: parseCsv(form.keywords_text) },
    mcp_servers: safeJson(form.mcp_servers_text, {}),
    temperature: numberOrNull(form.temperature),
    max_tokens: numberOrNull(form.max_tokens),
    max_tool_iterations: numberOrNull(form.max_tool_iterations),
    max_tool_result_chars: numberOrNull(form.max_tool_result_chars),
    daily_token_limit: numberOrNull(form.daily_token_limit)
  };
}
function safeJson(value, fallback) {
  try {
    return JSON.parse(value || "{}");
  } catch {
    return fallback;
  }
}
function filesystemMcpTemplate() {
  return {
    filesystem: {
      type: "stdio",
      command: "mcp-server-filesystem",
      args: ["./"],
      toolTimeout: 30,
      enabledTools: ["*"]
    }
  };
}
function defaultTaskForm() {
  return {
    id: "",
    name: "",
    assistant_id: "",
    prompt: "",
    task_kind: "generic",
    collaboration_mode: "inherit",
    schedule_kind: "manual",
    cron_expression: "",
    interval_minutes: "",
    require_rag_connected: false,
    require_channel_online: false,
    min_success_gap_minutes: "",
    max_retries: "",
    retry_backoff_seconds: "60",
    target_channel: "",
    target_chat_id: "",
    enabled: true
  };
}
function taskFormPayload(form, selectedAssistantId) {
  return {
    ...form,
    id: form.id || null,
    assistant_id: form.assistant_id || selectedAssistantId || "consult",
    interval_minutes: Number(form.interval_minutes || 0),
    min_success_gap_minutes: Number(form.min_success_gap_minutes || 0),
    max_retries: Number(form.max_retries || 0),
    retry_backoff_seconds: Number(form.retry_backoff_seconds || 60)
  };
}
function setTaskFormFromTask(setTaskForm) {
  return (task) => setTaskForm({
    id: task.id || "",
    name: task.name || "",
    assistant_id: task.assistant_id || "",
    prompt: task.prompt || "",
    task_kind: task.task_kind || "generic",
    collaboration_mode: task.collaboration_mode || "inherit",
    schedule_kind: task.schedule_kind || "manual",
    cron_expression: task.cron_expression || "",
    interval_minutes: task.interval_minutes || "",
    require_rag_connected: Boolean(task.require_rag_connected),
    require_channel_online: Boolean(task.require_channel_online),
    min_success_gap_minutes: task.min_success_gap_minutes || "",
    max_retries: task.max_retries || "",
    retry_backoff_seconds: task.retry_backoff_seconds || "60",
    target_channel: task.target_channel || "",
    target_chat_id: task.target_chat_id || "",
    enabled: task.enabled !== false
  });
}
function defaultUserForm() {
  return { id: "", username: "", password: "", role: "viewer", enabled: true };
}
function mergeUploads(existing, incoming) {
  const map = new Map(existing.map((item) => [item.path, item]));
  incoming.forEach((item) => map.set(item.path, item));
  return Array.from(map.values());
}
var rootElement = document.getElementById("root");
if (rootElement) {
  (0, import_client.createRoot)(rootElement).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {}));
}
export {
  boundLayoutToGrid,
  buildDefaultLayout,
  can,
  chLabel,
  clamp,
  defaultTaskForm,
  formToAssistant,
  isUsableSavedLayout,
  knowledgeDocId,
  layoutHasOverlap,
  mergeUploads,
  normalizeLayout,
  parseCsv,
  pickEvidenceSnippet,
  sameLayout,
  shouldShowQueryRewrite,
  splitEvidenceSentences,
  summarizeTokenUsage,
  swapCardSlots,
  taskFormPayload,
  tokenizeQuery
};
/*! Bundled license information:

react/cjs/react.production.min.js:
  (**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

scheduler/cjs/scheduler.production.min.js:
  (**
   * @license React
   * scheduler.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.min.js:
  (**
   * @license React
   * react-dom.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.min.js:
  (**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
