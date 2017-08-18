"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var find = require("./moon-util").find;
var termReduceFull = require("./moon-jit-compiler").termReduceFull;

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
      var invalid = /[^a-zA-Z0-9\(\)_{}\[\]\"#\|\/\-<>$=@]/;

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
            if (priArity.hasOwnProperty(name)) {
              var len = args.length - 1;
              var arity = priArity[name];
              var priArgs = [];
              for (var i = 0; i < arity; ++i) {
                priArgs.push(i < len ? args[i + 1](E)(T) : T.Var("v" + (i - len)));
              }
              var curried = T.Pri(name, priArgs);
              for (var i = 0; i < arity - len; ++i) {
                curried = T.Lam("v" + (arity - 1 - len - i), curried);
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
        }while (invalid.test(source[index] || "")) {
          ++index;
        } // Lambda
        if (/(=>)/.test(source.slice(index, index + 2))) {
          index += 2;
          var lift = [];
          var body = parse([[binder, null], vs], lift, 0, 0);
          return function (E) {
            return function (T) {
              return T.Lam(binder, lifted(lift, body)(E)(T));
            };
          };

          // Let
        } else if (/=/.test(source[index])) {
          ++index;
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
          ++index;
          var lift = [];
          var body = parse([[binder, null], vs], lift);
          return function (E) {
            return function (T) {
              return T.Fix(binder, lifted(lift, body, 0, 0)(E)(T));
            };
          };

          // Variable
        } else {
          if (isPri && priArity.hasOwnProperty(binder)) return binder;
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
        return wp(w) + a + "=>" + (spaces ? " " : "") + str(b, 1, s) + wp(-w);
      case "Var":
        return wp(w) + a + wp(-w);
      case "Ref":
        return wp(w) + a + wp(-w);
      case "Let":
        return wp(w) + a + "=" + (spaces ? " " : "") + str(b, 0, s) + " " + nl(0) + str(c, 0, s) + wp(-w);
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

var priArity = {
  "if": 3,
  "add": 2,
  "sub": 2,
  "mul": 2,
  "div": 2,
  "mod": 2,
  "pow": 2,
  "log": 2,
  "ltn": 2,
  "gtn": 2,
  "eql": 2,
  "flr": 1,
  "sin": 1,
  "cos": 1,
  "tan": 1,
  "asn": 1,
  "acs": 1,
  "atn": 1,
  "con": 2,
  "slc": 3,
  "cmp": 2,
  "nts": 1,
  "stn": 1,
  "gen": 1,
  "get": 2,
  "for": 4
};

module.exports = {
  termFromString: termFromString,
  termToString: termToString
};