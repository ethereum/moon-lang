"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Welcome to Moon's reference implementation. Since there is no formal spec
// of the language yet, here is a brief informal but pretty much complete one.
// Moon is, in essence, the lambda-calculus plus JSON and pure JSON-operations.
// Its core language has just 9 constructors.
//
// data MoonTerm
//   = App MoonTerm MoonTerm
//   | Lam MoonTerm
//   | Var Number
//   | Ref String
//   | Let String MoonTerm MoonTerm
//   | Fix String MoonTerm
//   | Pri String [MoonTerm]
//   | Num Number
//   | Str String
//   | Map [[String, MoonTerm]]
// 
// App, Lam, Var are the λ-calculus. Ref is a named free variable. Let binds a
// named variable, Fix is the fixed point, Pri encodes a primitive operation.
// Num, Str and Map hold JSON data. There are 27 primitive ops:
// 
// if  :: Number -> MoonTerm -> MoonTerm
// add :: Number -> Number -> Number
// sub :: Number -> Number -> Number
// mul :: Number -> Number -> Number
// div :: Number -> Number -> Number
// mod :: Number -> Number -> Number
// pow :: Number -> Number -> Number
// log :: Number -> Number -> Number
// ltn :: Number -> Number -> Number
// gtn :: Number -> Number -> Number
// eql :: Number -> Number -> Number
// flr :: Number -> Number
// sin :: Number -> Number
// cos :: Number -> Number
// tan :: Number -> Number
// asn :: Number -> Number
// acs :: Number -> Number
// atn :: Number -> Number
// con :: String -> String -> String
// slc :: String -> Number -> Number -> String
// cmp :: String -> String -> Number
// nts :: Number -> String
// stn :: String -> Number
// gen :: ((String -> a -> Map a) -> Map a -> Map a) -> Map a
// get :: String -> Map a -> Nullable a
// for :: Number -> Number -> st -> (Number -> st -> st) -> st
//
// Most operations are hopefully obvious. `con` is concatenation, `slc` is
// slicing, `cmp` is string equality comparison. `nts` and `stn` converts from
// strings to numbers and back. `gen` generates a Map from its fold. `get` gets
// the value of a key in a map, and may return null.  `for` receives an initial
// index, an exclusive limit, an initial state, a function (that receives the
// index and the current state and returns the next state), and then it returns
// the last state of the loop.
//
// Terms of that ADT are transported using a compact binary format:
//
// App 00 + term + term
// Lam 01 + term
// Var 10 + nat
// Ref 11000 + ref
// Fun 01001 + ref + term
// Let 11010 + ref + term + term
// Fix 11011 + ref + term
// Pri 11100 + prim + terms
// Num 11101 + sign + nat + nat
// Str 11110 + nat + [nat]
// Map 11111 + nat + [str + term]
//
// (TODO: explain more precisely)
//
// Note that, through this file, I actually use a slightly different ADT, which has
// string-based vars and string variable names on lambdas. The binary format, though,
// uses bruijn indices for lambdas and strings for everything else.

var find = function find(fn, list) {
  return list === null ? null : fn(list[0]) ? list[0] : find(fn, list[1]);
};

var termFromString = function termFromString(source) {
  var error = "No parse.";
  var parse = function parse(source) {
    var index = 0;
    var nextName = 0;
    var lift = [];
    var lifted = function lifted(lift, term) {
      return function (E) {
        return function (T) {
          return lift.reduceRight(function (rest, _ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                name = _ref2[0],
                term = _ref2[1];

            return T.App(term(E)(T), T.Lam(name, rest));
          }, term(E)(T));
        };
      };
    };
    function parseTerm(vs, li, isKey, isPri) {
      var invalid = /[^a-zA-Z0-9\(\)_{}\[\]\"#\|\/\-<>$]/;

      // Skip spacing
      while (invalid.test(source[index] || "")) {
        ++index;
      } // Comment
      if (/(\/\/|--)/.test(source.slice(index, index + 2))) {
        var i = index;
        while (source[index] && source[index++] !== "\n" && index !== source.length) {}
        return parse(vs, li, isKey, isPri);

        // Application
      } else if (source[index] === "(") {
        var startIndex = index;
        ++index;
        var next;
        var args = [];
        args.push(parse(vs, li, 0, 1));
        while ((next = parse(vs, li, 0, 0)) !== null) {
          args.push(next);
        }
        var endIndex = index;
        return function (E) {
          return function (T) {
            var name = args[0];
            if (pri.hasOwnProperty(name)) {
              var len = args.length - 1;
              var arity = pri[name][1];
              var priArgs = [];
              for (var i = 0; i < arity; ++i) {
                priArgs.push(i < len ? args[i + 1](E)(T) : T.Var("x" + (i - len)));
              }
              var curried = T.Pri(name, priArgs);
              for (var i = 0; i < arity - len; ++i) {
                curried = T.Lam("x" + (arity - 1 - len - i), curried);
              }
              for (var i = 0; i < len - arity; ++i) {
                curried = T.App(curried, args[arity + 1 + i]);
              }
              return curried;
            } else {
              var app = name(E)(T);
              for (var i = 1; i < args.length; ++i) {
                app = T.App(app, args[i](E)(T));
              }
            }
            return app;
          };
        };

        // String
      } else if (/"/.test(source[index]) || isKey && !/}/.test(source[index])) {
        index += isKey ? 0 : 1;
        var string = "";
        while (!/"/.test(source[index]) && !(isKey && /:/.test(source[index]))) {
          if (source[index] === undefined) throw error;
          if (source[index] !== "\\") {
            string += source[index++];
          } else {
            ++index;
            if (/[\\"\/bfnrt]/.test(source[index])) {
              switch (source[index]) {
                case "b":
                  string += "\b";break;
                case "f":
                  string += "\f";break;
                case "n":
                  string += "\n";break;
                case "r":
                  string += "\r";break;
                case "t":
                  string += "\t";break;
                case "\\":
                  string += "\\";break;
                case "/":
                  string += "/";break;
                case '"':
                  string += '';break;
                default:
                  throw error;
              }
            } else if (/u/.test(source[index])) {
              ++index;
              var hex = string[index++] + string[index++] + string[index++] + string[index++];
              if (/[0-9a-fA-F]{4}/.test(hex)) {
                string += JSON.parse("\\u" + hex);
              } else {
                throw error;
              }
            }
          }
          if (source[index] === undefined) throw error;
        }
        ++index;
        return function (E) {
          return function (T) {
            return T.Str(string);
          };
        };

        // Number
      } else if (/[0-9\-]/.test(source[index]) && !/^[a-f0-9]{16}$/.test(source.slice(index, index + 16))) {
        var number = "";
        if (source[index] === "-") number = source[index++];
        while (/[0-9]/.test(source[index])) {
          number += source[index++];
        }if (source[index] === ".") {
          number += source[index++];
          while (/[0-9]/.test(source[index])) {
            number += source[index++];
          }
        }
        if (/^[eE]/.test(source[index])) {
          number += source[index++];
          if (/[+\-]/.test(source[index])) number += source[index++];
          while (/[0-9]/.test(source[index])) {
            number += source[index++];
          }
        }
        return function (E) {
          return function (T) {
            return T.Num(Number(number));
          };
        };

        // Map/Array notation (syntax sugar)
      } else if (/\{/.test(source[index]) || /\[/.test(source[index])) {
        var isArray = /\[/.test(source[index++]);
        var kvs = [];
        var len = 0;
        var next;
        while ((next = parse(vs, li, isArray ? 0 : 1, 0)) !== null) {
          var key = isArray ? String(len++) : next()({ Str: function Str(s) {
              return s;
            } }); // TODO: expectString param
          var val = isArray ? next : parse(vs, li, 0, 0);
          kvs.push([key, val]);
        }
        if (isArray) kvs.push(["length", function (E) {
          return function (T) {
            return T.Num(len);
          };
        }]);
        return function (E) {
          return function (T) {
            return T.Map(kvs.map(function (_ref3) {
              var _ref4 = _slicedToArray(_ref3, 2),
                  k = _ref4[0],
                  v = _ref4[1];

              return [k, v(E)(T)];
            }));
          };
        };

        // End of Map/Array
      } else if (/(\}|\]|\))/.test(source[index]) || index >= source.length) {
        ++index;
        return null;

        // Bang
      } else if (/</.test(source[index])) {
        ++index;
        var body = parse(vs, li, 0, 0);
        var name = "_" + nextName++;
        li.push([name, body]);
        return function (E) {
          return function (T) {
            return T.Var(name);
          };
        };

        // Expand at compile time
      } else if (/#/.test(source[index])) {
        ++index;
        var body = parse(vs, li, 0, 0);
        return function (E) {
          return function (T) {
            return T.Nor(function (T) {
              return body(1)(T);
            });
          };
        };

        // Binder-related
      } else {
        var binder = "";

        while (/[a-zA-Z0-9_$]/.test(source[index]) && index !== source.length) {
          binder += source[index++];
        } // Lambda
        if (source[index] === ".") {
          var lift = [];
          var body = parse([[binder, null], vs], lift, 0, 0);
          return function (E) {
            return function (T) {
              return T.Lam(binder, lifted(lift, body)(E)(T));
            };
          };

          // Let
        } else if (source[index] === ":" && !isKey) {
          var subs = parse([[binder, "_rec"], vs], li, 0, 0);
          var lift = [];
          var body = parse([[binder, subs], vs], lift, 0, 0);
          return function (E) {
            return function (T) {
              return T.Let(binder, subs(E)(T), lifted(lift, body)(E)(T));
            };
          };

          // Block
        } else if (/\|/.test(source[index])) {
          ++index;
          var lift = [];
          var body = parse(vs, lift, 0, 0);
          return function (E) {
            return function (T) {
              return lifted(lift, body)(E)(T);
            };
          };

          // Fix
        } else if (source[index] === "@") {
          var lift = [];
          var body = parse([[binder, null], vs], lift);
          return function (E) {
            return function (T) {
              return T.Fix(binder, lifted(lift, body, 0, 0)(E)(T));
            };
          };

          // Variable
        } else {
          if (isPri && pri.hasOwnProperty(binder)) return binder;
          var bind = find(function (v) {
            return v[0] === binder;
          }, vs);
          if (!bind) {
            return function (E) {
              return function (T) {
                return T.Ref(binder);
              };
            };
          } else if (bind[0] === "_rec") {
            throw "Recursive let not allowed: check variable '" + binder + "'";
          } else {
            return function (E) {
              return function (T) {
                return E && bind[1] ? bind[1](1)(T) : T.Var(bind[0]);
              };
            };
          }
        }
      }
    }
    function parse(vs, li, isKey, isPri) {
      var parsed = parseTerm(vs, li, isKey, isPri);
      if (/>/.test(source[index]) && parsed !== null) {
        ++index;
        li.push(["_", parsed]);
        return parse(vs, li, isKey, isPri);
      }
      return parsed;
    }
    var parsed = parse(null, lift, 0, 0);
    return lifted(lift, parsed)(0);
  };
  var finalize = function finalize(term, scope) {
    return term({
      App: function App(f, x) {
        return function (S) {
          return function (T) {
            return T.App(f(S)(T), x(S)(T));
          };
        };
      },
      Lam: function Lam(name, body) {
        return function (S) {
          return function (T) {
            return T.Lam(name, body([name, S])(T));
          };
        };
      },
      Var: function Var(name) {
        return function (S) {
          return function (T) {
            return (find(function (n) {
              return n === name;
            }, S) ? T.Var : T.Ref)(name);
          };
        };
      },
      Ref: function Ref(name) {
        return function (S) {
          return function (T) {
            return T.Ref(name);
          };
        };
      },
      Let: function Let(name, term, body) {
        return function (S) {
          return function (T) {
            return T.Let(name, term(S)(T), body([name, S])(T));
          };
        };
      },
      Fix: function Fix(name, body) {
        return function (S) {
          return function (T) {
            return T.Fix(name, body([name, S])(T));
          };
        };
      },
      Pri: function Pri(name, args) {
        return function (S) {
          return function (T) {
            return T.Pri(name, args.map(function (arg) {
              return arg(S)(T);
            }));
          };
        };
      },
      Num: function Num(num) {
        return function (S) {
          return function (T) {
            return T.Num(num);
          };
        };
      },
      Str: function Str(str) {
        return function (S) {
          return function (T) {
            return T.Str(str);
          };
        };
      },
      Map: function Map(kvs) {
        return function (S) {
          return function (T) {
            return T.Map(kvs.map(function (_ref5) {
              var _ref6 = _slicedToArray(_ref5, 2),
                  k = _ref6[0],
                  v = _ref6[1];

              return [k, v(S)(T)];
            }));
          };
        };
      },
      Nor: function Nor(term) {
        return function (S) {
          return function (T) {
            return finalize(termReduceFull(finalize(term, null)), S)(T);
          };
        };
      }
    })(scope, 0);
  };
  var parsed = parse(source);
  return finalize(parsed, null);
};

var termToString = function termToString(term, spaces) {
  var tree = term({
    App: function App(f, x) {
      return ["App", f, x];
    },
    Lam: function Lam(name, body) {
      return ["Lam", name, body];
    },
    Var: function Var(name) {
      return ["Var", name];
    },
    Ref: function Ref(name) {
      return ["Ref", name];
    },
    Let: function Let(name, term, body) {
      return ["Let", name, term, body];
    },
    Fix: function Fix(name, body) {
      return ["Fix", name, body];
    },
    Pri: function Pri(name, args) {
      return ["Pri", name, args];
    },
    Num: function Num(num) {
      return ["Num", num];
    },
    Str: function Str(str) {
      return ["Str", str];
    },
    Map: function Map(kvs) {
      return ["Map", kvs];
    }
  });
  var lvl = 0;
  var str = function str(_ref7, k, s) {
    var _ref8 = _slicedToArray(_ref7, 4),
        type = _ref8[0],
        a = _ref8[1],
        b = _ref8[2],
        c = _ref8[3];

    var nl = function nl(add) {
      return (!s && spaces > 0 ? " \n" : "") + sp((lvl += add, lvl) * (s ? 0 : spaces || 0));
    };
    var wp = function wp(add) {
      return add > 0 ? nl(add) : add < 0 ? up(add) : "";
    };
    var up = function up(add) {
      return lvl += add, "";
    };
    var sp = function sp(n) {
      return n === 0 ? "" : (spaces ? " " : "") + sp(n - 1);
    };
    var w = k === 1 && type !== "Lam" || k === 2 && type !== "Num" && type !== "Str" && type !== "Map" ? 1 : 0;
    switch (type) {
      case "App":
        var fnStr = str(a, 0, s);
        var fnApp = fnStr[0] === "(" && fnStr[fnStr.length - 1] === ")";
        var fnCln = fnApp ? fnStr.slice(1, -1) : fnStr;
        return wp(w) + "(" + fnCln + " " + str(b, 0, 1) + ")" + wp(-w);
      case "Lam":
        return wp(w) + a + "." + (spaces ? " " : "") + str(b, 1, s) + wp(-w);
      case "Var":
        return wp(w) + a + wp(-w);
      case "Ref":
        return wp(w) + a + wp(-w);
      case "Let":
        return wp(w) + a + ":" + (spaces ? " " : "") + str(b, 0, s) + " " + nl(0) + str(c, 0, s) + wp(-w);
      case "Fix":
        return wp(w) + a + "@" + str(b, 0, s) + wp(-w);
      case "Pri":
        return wp(w) + "(" + a + " " + b.map(function (x) {
          return str(x, 0, s);
        }).join(" ") + ")" + wp(-w);
      case "Num":
        return wp(w) + a + wp(-w);
      case "Str":
        return wp(w) + '"' + a + '"' + wp(-w);
      case "Map":
        var lenIdx = a.reduce(function (i, _ref9, j) {
          var _ref10 = _slicedToArray(_ref9, 2),
              k = _ref10[0],
              v = _ref10[1];

          return k === "length" ? j : i;
        }, null);
        if (lenIdx !== null) {
          var len = Number(a[lenIdx][1][1]);
          var arr = a.filter(function (_ref11) {
            var _ref12 = _slicedToArray(_ref11, 2),
                k = _ref12[0],
                v = _ref12[1];

            return k !== "length";
          }).map(function (_ref13) {
            var _ref14 = _slicedToArray(_ref13, 2),
                k = _ref14[0],
                v = _ref14[1];

            return v;
          });
          var inn = arr.map(function (v, i) {
            return up(1) + str(v, 0, s) + up(-1) + (i < len - 1 ? "," + nl(0) : "");
          }).join("");
          return wp(w) + "[" + nl(1) + inn + nl(-1) + "]" + wp(-w);
        } else {
          var inn = a.map(function (_ref15, i) {
            var _ref16 = _slicedToArray(_ref15, 2),
                k = _ref16[0],
                v = _ref16[1];

            return k + ':' + sp(1) + str(v, 2, s) + (i < a.length - 1 ? "," + nl(0) : "");
          }).join("");
          return wp(w) + "{" + nl(1) + inn + nl(-1) + "}" + wp(-w);
        }
    }
  };
  return str(tree, 0, 0);
};

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
          return "({" + kvs.map(function (_ref17) {
            var _ref18 = _slicedToArray(_ref17, 2),
                k = _ref18[0],
                v = _ref18[1];

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
        return "({" + map.map(function (_ref19) {
          var _ref20 = _slicedToArray(_ref19, 2),
              k = _ref20[0],
              v = _ref20[1];

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

var termToBinary = function termToBinary(term) {
  var encodeStr = function encodeStr(str) {
    var len = encodeNat(str.length);
    var nats = str.split("").map(function (c) {
      return encodeNat(c.charCodeAt(0));
    }).join("");
    return len + nats;
  };
  var encodeRef = function encodeRef(ref) {
    var str = "";
    for (var i = 0; i < ref.length; ++i) {
      str += refs[ref[i]];
    }
    return str + "000000";
  };
  var encodeNat = function encodeNat(nat) {
    var bits = (nat + 2).toString(2).slice(1);
    for (var i = 0, chunks = bits.length; i < chunks; ++i) {
      bits = (i === 0 ? "0" : "1") + bits;
    }return bits;
  };
  var encodeNum = function encodeNum(num) {
    var exp = 0;
    var sgn = 0;
    var man = 0;
    var esg = 0;
    if (num !== 0) {
      if (num < 0) sgn = 1, num = -num;
      while (num > 2) {
        num /= 2, exp++;
      }while (num < 1) {
        num *= 2, exp--;
      }while (num !== 0) {
        man = man * 2 + (num | 0), num = (num - (num | 0)) * 2;
      }
    }
    if (exp < 0) esg = 1, exp = -exp;
    return String(sgn) + encodeNat(man) + String(esg) + encodeNat(exp);
  };
  return term({
    App: function App(f, x) {
      return function (S, d) {
        return "00" + f(S) + x(S);
      };
    },
    Lam: function Lam(name, body) {
      return function (S, d) {
        if (name === "v" + d) {
          return "01" + body([name, S], d + 1);
        } else {
          return "11001" + encodeRef(name) + body([name, S], d + 1);
        }
      };
    },
    Var: function Var(name) {
      return function (S, d) {
        var find = function find(S) {
          return !S ? function () {
            throw "";
          }() : S[0] === name ? 0 : 1 + find(S[1]);
        };
        return "10" + encodeNat(find(S));
      };
    },
    Ref: function Ref(name) {
      return function (S, d) {
        return "11000" + encodeRef(name);
      };
    },
    Let: function Let(name, term, body) {
      return function (S, d) {
        return "11010" + encodeRef(name) + term(S, d) + body([name, S], d + 1);
      };
    },
    Fix: function Fix(name, term) {
      return function (S, d) {
        return "11011" + encodeRef(name) + term([name, S], d + 1);
      };
    },
    Pri: function Pri(name, args) {
      return function (S, d) {
        return "11100" + pri[name][5] + args.map(function (arg) {
          return arg(S, d);
        }).join("");
      };
    },
    Num: function Num(num) {
      return function (S, d) {
        return "11101" + encodeNum(num);
      };
    },
    Str: function Str(str) {
      return function (S, d) {
        return "11110" + encodeStr(str);
      };
    },
    Map: function Map(kvs) {
      return function (S, d) {
        return "11111" + encodeNat(kvs.length) + kvs.map(function (_ref21) {
          var _ref22 = _slicedToArray(_ref21, 2),
              k = _ref22[0],
              v = _ref22[1];

          return encodeStr(k) + v(S, d);
        }).join("");
      };
    }
  })(null, 0);
};

var termFromBinary = function termFromBinary(src) {
  var idx = 0;
  var parseStr = function parseStr() {
    var len = parseNat();
    var nats = [];
    for (var j = 0; j < len; ++j) {
      nats.push(parseNat());
    }return nats.map(function (n) {
      return String.fromCharCode(n);
    }).join("");
  };
  var parseRef = function parseRef() {
    var ref = "";
    while (src.slice(idx, idx += 6) !== "000000") {
      ref += refs[src.slice(idx - 6, idx)];
    }
    return ref;
  };
  var parseNat = function parseNat() {
    for (var chunks = 0; src[(chunks++, idx++)] !== "0";) {};
    return parseInt("1" + src.slice(idx, idx += chunks), 2) - 2;
  };
  var head = function head(_head) {
    if (src.slice(idx, idx + _head.length) === _head) {
      idx += _head.length;
      return true;
    }
    return false;
  };
  var parseTerm = function parseTerm(S, d) {
    if (head("00")) {
      var f = parseTerm(S, d);
      var x = parseTerm(S, d);
      return function (T) {
        return T.App(f(T), x(T));
      };
    } else if (head("01")) {
      var body = parseTerm(["v" + d, S], d + 1);
      return function (T) {
        return T.Lam("v" + d, body(T));
      };
    } else if (head("10")) {
      var i = parseNat();
      for (var k = 0; k < i; ++k) {
        S = S[1];
      }return function (T) {
        return T.Var(S[0]);
      };
    } else if (head("11000")) {
      var name = parseRef();
      return function (T) {
        return T.Ref(name);
      };
    } else if (head("11001")) {
      var name = parseRef();
      var body = parseTerm([name, S], d + 1);
      return function (T) {
        return T.Lam(name, body(T));
      };
    } else if (head("11010")) {
      var name = parseRef();
      var term = parseTerm(S, d);
      var body = parseTerm([name, S], d + 1);
      return function (T) {
        return T.Let(name, term(T), body(T));
      };
    } else if (head("11011")) {
      var name = parseRef();
      var body = parseTerm([name, S], d + 1);
      return function (T) {
        return T.Fix(name, body(T));
      };
    } else if (head("11100")) {
      var pri = pri2[src.slice(idx, idx += 5)];
      var args = [];
      for (var i = 0; i < pri[1]; ++i) {
        args.push(parseTerm(S, d));
      }return function (T) {
        return T.Pri(pri[0], args.map(function (a) {
          return a(T);
        }));
      };
    } else if (head("11101")) {
      var sgn = src[idx++] === "0" ? 1 : -1;
      var man = parseNat();
      var esg = src[idx++] === "0" ? 1 : -1;
      var exp = parseNat();
      while (man > 2) {
        man /= 2;
      }return function (T) {
        return T.Num(sgn * man * Math.pow(2, esg * exp));
      };
    } else if (head("11110")) {
      var str = parseStr();
      return function (T) {
        return T.Str(str);
      };
    } else if (head("11111")) {
      var len = parseNat();
      var kvs = [];
      for (var i = 0; i < len; ++i) {
        kvs.push([parseStr(d), parseTerm(S, d)]);
      }return function (T) {
        return T.Map(kvs.map(function (_ref23) {
          var _ref24 = _slicedToArray(_ref23, 2),
              k = _ref24[0],
              v = _ref24[1];

          return [k, v(T)];
        }));
      };
    }
  };
  return parseTerm(null, 0);
};

var termToBytes = function termToBytes(term) {
  var binary = termToBinary(term);
  var hex = "";
  for (var i = 0; i < binary.length; i += 4) {
    var bits = binary.slice(i, i + 4);
    while (bits.length < 4) {
      bits = bits + "0";
    }hex += parseInt(bits, 2).toString(16);
  }
  if (hex.length % 2 !== 0) hex += "0";
  return hex;
};

var termFromBytes = function termFromBytes(bytes) {
  var binary = "";
  for (var i = 0; i < bytes.length; ++i) {
    binary += ("0000" + parseInt(bytes[i], 16).toString(2)).slice(-4);
  }return termFromBinary(binary);
};

var commonLib = ["$F=(a)=>typeof a===\"function\"?1:0", "$S=(a)=>typeof a===\"string\"?1:0", "$N=(a)=>typeof a===\"number\"?1:0", "$O=(a)=>typeof a===\"object\"&&!a.__?1:0", "$U=undefined", "$V=undefined"];

var refs = function () {
  var refs = {};
  " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_".split("").forEach(function (chr, idx) {
    var bin = ("000000" + idx.toString(2)).slice(-6);
    refs[bin] = chr;
    refs[chr] = bin;
  });
  return refs;
}();

var pris = [["if", 3, "(a,b,c)=>$N(a)?(a?b():c()):$P(['if',a,b(),c()])", function (a, b, c) {
  return "(" + a + "?" + b + ":" + c + ")";
}, "000", "00000"], ["add", 2, "(a,b)=>$N(a)&&$N(b)?a+b:$P(['add',a,b])", function (a, b) {
  return "(" + a + "+" + b + ")";
}, "001", "00001"], ["sub", 2, "(a,b)=>$N(a)&&$N(b)?a-b:$P(['sub',a,b])", function (a, b) {
  return "(" + a + "-" + b + ")";
}, "002", "00010"], ["mul", 2, "(a,b)=>$N(a)&&$N(b)?a*b:$P(['mul',a,b])", function (a, b) {
  return "(" + a + "*" + b + ")";
}, "010", "00011"], ["div", 2, "(a,b)=>$N(a)&&$N(b)?a/b:$P(['div',a,b])", function (a, b) {
  return "(" + a + "/" + b + ")";
}, "011", "00100"], ["mod", 2, "(a,b)=>$N(a)&&$N(b)?a%b:$P(['mod',a,b])", function (a, b) {
  return "(" + a + "%" + b + ")";
}, "012", "00101"], ["pow", 2, "(a,b)=>$N(a)&&$N(b)?Math.pow(a,b):$P(['pow',a,b])", function (a, b) {
  return "Math.pow(" + a + "," + b + ")";
}, "020", "00110"], ["log", 2, "(a,b)=>$N(a)&&$N(b)?Math.log(b)/Math.log(a):$P(['log',a,b])", function (a, b) {
  return "Math.log(" + b + ")/Math.log(" + a + ")";
}, "021", "00111"], ["ltn", 2, "(a,b)=>$N(a)&&$N(b)?(a<b?1:0):$P(['ltn',a,b])", function (a, b) {
  return "(" + a + "<" + b + "?1:0)";
}, "022", "01000"], ["gtn", 2, "(a,b)=>$N(a)&&$N(b)?(a>b?1:0):$P(['gtn',a,b])", function (a, b) {
  return "(" + a + ">" + b + "?1:0)";
}, "100", "01001"], ["eql", 2, "(a,b)=>$N(a)&&$N(b)?(a===b?1:0):$P(['eql',a,b])", function (a, b) {
  return "(" + a + "===" + b + "?1:0)";
}, "101", "01010"], ["flr", 1, "(a)=>$N(a)?Math.floor(a):$P(['flr',a])", function (a) {
  return "Math.floor(" + a + ")";
}, "102", "01011"], ["sin", 1, "(a)=>$N(a)?Math.sin(a):$P(['sin',a])", function (a) {
  return "Math.sin(" + a + ")";
}, "110", "01100"], ["cos", 1, "(a)=>$N(a)?Math.cos(a):$P(['cos',a])", function (a) {
  return "Math.cos(" + a + ")";
}, "111", "01101"], ["tan", 1, "(a)=>$N(a)?Math.tan(a):$P(['tan',a])", function (a) {
  return "Math.tan(" + a + ")";
}, "112", "01110"], ["asn", 1, "(a)=>$N(a)?Math.asin(a):$P(['asn',a])", function (a) {
  return "Math.asin(" + a + ")";
}, "120", "01111"], ["acs", 1, "(a)=>$N(a)?Math.acos(a):$P(['acs',a])", function (a) {
  return "Math.acos(" + a + ")";
}, "121", "10000"], ["atn", 1, "(a)=>$N(a)?Math.atan(a):$P(['atn',a])", function (a) {
  return "Math.atan(" + a + ")";
}, "122", "10001"], ["con", 2, "(a,b)=>$S(a)&&$S(b)?a+b:$P(['con',a,b])", function (a, b) {
  return "(" + a + "+" + b + ")";
}, "200", "10010"], ["slc", 3, "(a,b,c)=>$S(a)&&$N(b)&&$N(c)?a.slice(b,c):$P(['slc',a,b,c])", function (a, b, c) {
  return a + ".slice(" + b + "," + c + ")";
}, "201", "10011"], ["cmp", 2, "(a,b)=>$S(a)&&$S(b)?(a===b?1:0):$P(['cmp',a,b])", function (a, b) {
  return a + "===" + b;
}, "202", "10100"], ["nts", 1, "(a)=>$N(a)?String(a):$P(['nts',a])", function (a) {
  return "String(" + a + ")";
}, "210", "10101"], ["stn", 1, "(a)=>$S(a)?Number(a):$P(['stn',a])", function (a) {
  return "Number(" + a + ")";
}, "211", "10110"], ["gen", 1, "(f,_)=>f(k=>v=>a=>(!$S(k)||!$O(a)?$P(['gen',f]):(a[k]=v,a)))({})", function (f) {
  return f + "(k=>v=>a=>(a[k]=v,a))({})";
}, "212", "10111"], ["get", 2, "(a,k)=>$O(a)&&$S(k)?(($V=a[k])!==$U?$V:null):$P(['get',a,k])", function (a, k, d) {
  return "(($V=" + a + "[" + k + "])!==$U?$V:" + d + ")";
}, "220", "11000"], ["for", 4, "(a,b,c,d)=>{if($N(a)&&$N(b)&&$F(d)){while(a<b)c=d(a++)(c);return c};return $P(['for',a,b,c,d]);}", function (i, j, x, f) {
  return "((i,j,x,f)=>{f=" + f + ";x=" + x + ";for(i=" + i + ",j=" + j + ";i<j;++i){x=f(i)(x);};return x;})()";
}, "222", "11010"]];

var pri = pris.reduce(function (pris, pri) {
  return pris[pri[0]] = pri, pris;
}, {});
var pri2 = pris.reduce(function (pris, pri) {
  return pris[pri[5]] = pri, pris;
}, {});

module.exports = {
  termCompileFast: termCompileFast,
  termDecompileFast: termDecompileFast,
  termReduceFast: termReduceFast,
  termCompileFull: termCompileFull,
  termDecompileFull: termDecompileFull,
  termReduceFull: termReduceFull,
  termReduce: termReduce,
  termToString: termToString,
  termFromString: termFromString,
  termToBinary: termToBinary,
  termFromBinary: termFromBinary,
  termToBytes: termToBytes,
  termFromBytes: termFromBytes
};