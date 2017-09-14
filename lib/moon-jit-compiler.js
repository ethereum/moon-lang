"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var find = require("./moon-util").find;

var termCompileFast = function termCompileFast(term) {
  var toJS = function toJS(term) {
    return term({
      App: function App(f, x) {
        return function (_) {
          return f() + "(" + x() + ")";
        };
      },
      Lam: function Lam(name, body) {
        return function (self) {
          return self ? "(function _" + self + "(_" + name + "){return " + body() + "})" : "(_" + name + "=>" + body() + ")";
        };
      },
      Var: function Var(name) {
        return function (_) {
          return "_" + name;
        };
      },
      Ref: function Ref(name) {
        return function (_) {
          return "_" + name;
        };
      },
      Let: function Let(name, term, body) {
        return function (_) {
          var t = term();
          var b = body();
          if (/^\(\(\)=>{/.test(b)) {
            return "(()=>{var _" + name + "=" + t + ";" + b.slice(6);
          } else {
            return "(()=>{var _" + name + "=" + t + ";return " + b + "})()";
          }
        };
      },
      Fix: function Fix(name, body) {
        return function (_) {
          return body(name);
        };
      },
      Pri: function Pri(name, args) {
        return function (_) {
          var _pri$name;

          return (_pri$name = pri[name])[3].apply(_pri$name, _toConsumableArray(args.map(function (a) {
            return a();
          })));
        };
      },
      Num: function Num(num) {
        return function (_) {
          return JSON.stringify(num);
        };
      },
      Str: function Str(str) {
        return function (_) {
          return JSON.stringify(str);
        };
      },
      Map: function Map(kvs) {
        return function (_) {
          for (var i = 0; i < kvs.length; ++i) {
            if (kvs[i][0] === "length") return "([" + kvs.map(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  k = _ref2[0],
                  v = _ref2[1];

              return v();
            }).join(",") + "])";
          }return "({" + kvs.map(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                k = _ref4[0],
                v = _ref4[1];

            return '"' + k + '"' + ":" + v();
          }).join(",") + "})";
        };
      }
    })();
  };
  return "(()=>{" + "\"use strict\";" + "var " + commonLib.join(",") + ";" + "return " + toJS(term) + "})";
};

var termDecompileFast = function termDecompileFast(func) {
  try {
    var fromJS = function fromJS(value) {
      if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
        return function (T) {
          var kvs = [];
          for (var key in value) {
            kvs.push([key, fromJS(value[key])(T)]);
          }return T.Map(kvs);
        };
      } else if (typeof value === "string") {
        return function (T) {
          return T.Str(value);
        };
      } else if (typeof value === "number") {
        return function (T) {
          return T.Num(value);
        };
      }
    };
    return fromJS(func);
  } catch (e) {
    throw new Error("Couldn't reduce term on fast mode.");
  }
};

var termReduceFast = function termReduceFast(term) {
  return termDecompileFast(eval(termCompileFast(term))());
};

var termCompileFull = function termCompileFull(term) {
  var toJS = function toJS(term) {
    return term({
      App: function App(f, x) {
        return "$A(" + f + "," + x + ")";
      },
      Lam: function Lam(name, body) {
        return "(_" + name + "=>" + body + ")";
      },
      Var: function Var(name) {
        return "_" + name;
      },
      Ref: function Ref(name) {
        return "$D('" + name + "')";
      },
      Let: function Let(name, term, body) {
        return (/^\(\(\)=>{/.test(body) ? "(()=>{var _" + name + "=" + term + ";" + body.slice(6) : "(()=>{var _" + name + "=" + term + ";return " + body + "})()"
        );
      },
      Fix: function Fix(name, body) {
        return "(_" + name + "=>(_" + name + "=" + body + ",_" + name + "))()";
      },
      Pri: function Pri(name, xs) {
        return "$" + pri[name][0] + "(" + xs.map(function (o, i) {
          return pri[name][0] === "if" && i ? "()=>" + o : o;
        }).join(",") + ")";
      },
      Num: function Num(n) {
        return JSON.stringify(n);
      },
      Str: function Str(s) {
        return JSON.stringify(s);
      },
      Map: function Map(map) {
        return "({" + map.map(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
              k = _ref6[0],
              v = _ref6[1];

          return '"' + k + '"' + ":" + v;
        }).join(",") + "})";
      }
    });
  };
  var compiled = "(()=>{" + "\"use strict\";" + "var $P=((a)=>(a.__=1,a));" + "var $D=(a)=>$P(['ref',a]);" + "var $A=(a,b)=>typeof a==='function'?a(b):$P(['app',a,b]);" + "var " + commonLib.join(",") + "," + pris.map(function (pri) {
    return "$" + pri[0] + "=" + pri[2];
  }).join(",") + ";" + "return " + toJS(term) + "})";
  return compiled;
};

var termDecompileFull = function termDecompileFull(func) {
  return function fromJS(value) {
    var chars = "abcdefghijklmnopqrstuvwxyz";
    var name = function name(n) {
      return n > 26 ? chars[n % 26] + name(n / 26 | 0) : chars[n];
    };
    return function nf(value, depth) {
      var App = function App(x) {
        return x.isApp = true, x;
      };
      var app = function app(f) {
        return App(function (x) {
          return x === null ? f : app(function (d) {
            return function (T) {
              return T.App(f(d)(T), nf(x, d)(T));
            };
          });
        });
      };
      if (value.isApp) {
        return value(null)(depth);
      } else if (typeof value === "number") {
        return function (T) {
          return T.Num(value);
        };
      } else if (typeof value === "string") {
        return function (T) {
          return T.Str(value);
        };
      } else if (typeof value === "function") {
        return function (T) {
          return T.Lam(name(depth), nf(value(app(function (d) {
            return function (T) {
              return T.Var(name(depth));
            };
          })), depth + 1)(T));
        };
      } else if (value[0] === "ref") {
        return function (T) {
          return T.Var(value[1]);
        };
      } else if (value[0] === "app") {
        return function (T) {
          return T.App(nf(value[1], depth)(T), nf(value[2], depth)(T));
        };
      } else if (pri.hasOwnProperty(value[0])) {
        return function (T) {
          return T.Pri(value[0], value.slice(1).map(function (value) {
            return nf(value, depth)(T);
          }));
        };
      } else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
        return function (T) {
          var kvs = [];
          for (var key in value) {
            kvs.push([key, nf(value[key], depth)(T)]);
          }return T.Map(kvs);
        };
      } else {
        return value;
      }
    }(value, 0);
  }(func);
};

var termReduceFull = function termReduceFull(term) {
  return termDecompileFull(eval(termCompileFull(term))());
};

var termReduce = function termReduce(term) {
  return function (T) {
    try {
      return termReduceFast(term)(T);
    } catch (e) {
      try {
        return termReduceFull(term)(T);
      } catch (e) {
        throw "No normal form: " + e;
      }
    }
  };
};

var commonLib = ["$F=(a)=>typeof a===\"function\"?1:0", "$S=(a)=>typeof a===\"string\"?1:0", "$N=(a)=>typeof a===\"number\"?1:0", "$O=(a)=>typeof a===\"object\"&&!a.__?1:0"];

// TODO: make a proper file to avoid repetition of this on other files
var pris = [["if", 3, "(a,b,c)=>$N(a)?(a?b():c()):$P(['if',a,b(),c()])", function (a, b, c) {
  return "(" + a + "?" + b + ":" + c + ")";
}], ["add", 2, "(a,b)=>$N(a)&&$N(b)?a+b:$P(['add',a,b])", function (a, b) {
  return "(" + a + "+" + b + ")";
}], ["sub", 2, "(a,b)=>$N(a)&&$N(b)?a-b:$P(['sub',a,b])", function (a, b) {
  return "(" + a + "-" + b + ")";
}], ["mul", 2, "(a,b)=>$N(a)&&$N(b)?a*b:$P(['mul',a,b])", function (a, b) {
  return "(" + a + "*" + b + ")";
}], ["div", 2, "(a,b)=>$N(a)&&$N(b)?a/b:$P(['div',a,b])", function (a, b) {
  return "(" + a + "/" + b + ")";
}], ["mod", 2, "(a,b)=>$N(a)&&$N(b)?a%b:$P(['mod',a,b])", function (a, b) {
  return "(" + a + "%" + b + ")";
}], ["pow", 2, "(a,b)=>$N(a)&&$N(b)?Math.pow(a,b):$P(['pow',a,b])", function (a, b) {
  return "Math.pow(" + a + "," + b + ")";
}], ["log", 2, "(a,b)=>$N(a)&&$N(b)?Math.log(b)/Math.log(a):$P(['log',a,b])", function (a, b) {
  return "Math.log(" + b + ")/Math.log(" + a + ")";
}], ["ltn", 2, "(a,b)=>$N(a)&&$N(b)?(a<b?1:0):$P(['ltn',a,b])", function (a, b) {
  return "(" + a + "<" + b + "?1:0)";
}], ["gtn", 2, "(a,b)=>$N(a)&&$N(b)?(a>b?1:0):$P(['gtn',a,b])", function (a, b) {
  return "(" + a + ">" + b + "?1:0)";
}], ["eql", 2, "(a,b)=>$N(a)&&$N(b)?(a===b?1:0):$P(['eql',a,b])", function (a, b) {
  return "(" + a + "===" + b + "?1:0)";
}], ["flr", 1, "(a)=>$N(a)?Math.floor(a):$P(['flr',a])", function (a) {
  return "Math.floor(" + a + ")";
}], ["sin", 1, "(a)=>$N(a)?Math.sin(a):$P(['sin',a])", function (a) {
  return "Math.sin(" + a + ")";
}], ["cos", 1, "(a)=>$N(a)?Math.cos(a):$P(['cos',a])", function (a) {
  return "Math.cos(" + a + ")";
}], ["tan", 1, "(a)=>$N(a)?Math.tan(a):$P(['tan',a])", function (a) {
  return "Math.tan(" + a + ")";
}], ["asn", 1, "(a)=>$N(a)?Math.asin(a):$P(['asn',a])", function (a) {
  return "Math.asin(" + a + ")";
}], ["acs", 1, "(a)=>$N(a)?Math.acos(a):$P(['acs',a])", function (a) {
  return "Math.acos(" + a + ")";
}], ["atn", 1, "(a)=>$N(a)?Math.atan(a):$P(['atn',a])", function (a) {
  return "Math.atan(" + a + ")";
}], ["con", 2, "(a,b)=>$S(a)&&$S(b)?a+b:$P(['con',a,b])", function (a, b) {
  return "(" + a + "+" + b + ")";
}], ["slc", 3, "(a,b,c)=>$S(a)&&$N(b)&&$N(c)?(b===c-1?a[b]||'':a.substring(b,c)):$P(['slc',a,b,c])", function (a, b, c) {
  return "((a,b,c)=>b===c-1?a[b]||'':a.substring(b,c))(" + a + "," + b + "," + c + ")";
}], ["cmp", 2, "(a,b)=>$S(a)&&$S(b)?(a===b?1:0):$P(['cmp',a,b])", function (a, b) {
  return a + "===" + b;
}], ["nts", 1, "(a)=>$N(a)?String(a):$P(['nts',a])", function (a) {
  return "String(" + a + ")";
}], ["stn", 1, "(a)=>$S(a)?Number(a):$P(['stn',a])", function (a) {
  return "Number(" + a + ")";
}], ["gen", 1, "(f,_)=>f(k=>v=>a=>(!$S(k)||!$O(a)?$P(['gen',f]):(a[k]=v,a)))({})", function (f) {
  return f + "(k=>v=>a=>(a[k]=v,a))({})";
}], ["get", 2, "(a,k)=>$O(a)&&$S(k)?a[k]:$P(['get',a,k])", function (a, k) {
  return a + "[" + k + "]";
}], ["for", 4, "(a,b,c,d)=>{if($N(a)&&$N(b)&&$F(d)){while(a<b)c=d(a++)(c);return c};return $P(['for',a,b,c,d]);}", function (i, j, x, f) {
  return "((i,j,x,f)=>{f=" + f + ";x=" + x + ";for(i=" + i + ",j=" + j + ";i<j;++i){x=f(i)(x);};return x;})()";
}], ["len", 1, "(a)=>$S(a)?a.length:$P(['len',a])", function (a) {
  return "(" + a + ".length)";
}], ["and", 2, "(a,b)=>$N(a)&&$N(b)?(a&b)>>>0:$P(['and',a,b])", function (a, b) {
  return "((" + a + "&" + b + ")>>>0)";
}], ["or", 2, "(a,b)=>$N(a)&&$N(b)?(a|b)>>>0:$P(['or',a,b])", function (a, b) {
  return "((" + a + "|" + b + ")>>>0)";
}], ["xor", 2, "(a,b)=>$N(a)&&$N(b)?(a^b)>>>0:$P(['or',a,b])", function (a, b) {
  return "((" + a + "^" + b + ")>>>0)";
}]];

var pri = pris.reduce(function (pris, pri) {
  return pris[pri[0]] = pri, pris;
}, {});

module.exports = {
  termCompileFast: termCompileFast,
  termDecompileFast: termDecompileFast,
  termReduceFast: termReduceFast,
  termCompileFull: termCompileFull,
  termDecompileFull: termDecompileFull,
  termReduceFull: termReduceFull,
  termReduce: termReduce
};