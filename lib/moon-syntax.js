"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// Comments: https://github.com/MaiaVictor/moon-lang/issues/23

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
      } else if (/"/.test(source[index]) || isKey && !/[}\]]/.test(source[index])) {
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
          } else if (bind[1] === "_rec") {
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
        var name = "_" + nextName++;
        li.push([name, parsed]);
        var rest = parse(vs, li, isKey, isPri);
        return function (E) {
          return function (T) {
            return T.Let("_", T.Var(name), rest(E)(T));
          };
        };
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

var termFormatter = function termFormatter(decorations) {
  return function (term) {
    var D = decorations;

    // data T
    //   = App AST [AST]
    //   | Lam [String] AST
    //   | Var String
    //   | Ref String
    //   | Let [(String, AST)] AST
    //   | Pri String [AST]
    //   | Num Number
    //   | Str String
    //   | Map [(String, AST)]
    //   | Arr [AST]
    //   | Blk AST
    //   | Lif AST
    //   | Seq AST
    //   | Sub String AST AST
    //
    // type AST = {
    //   term: T
    //   size: Number
    // }

    var _App = 0,
        _Lam = 1,
        _Var = 2,
        _Ref = 3,
        _Let = 4,
        _Fix = 5,
        _Pri = 6,
        _Num = 7,
        _Str = 8,
        _Map = 9,
        Arr = 10,
        Blk = 11,
        Lif = 12,
        Seq = 13,
        Sub = 14;

    // AST
    //   Builds a formattable AST from a Moon AST
    var ast = term({
      App: function App(f, x) {
        return {
          term: [_App, f, [x]],
          size: 3 + f.size + x.size // fx -> (f x)
        };
      },
      Lam: function Lam(name, body) {
        return {
          term: [_Lam, [name], body],
          size: 4 + name.length + body.size // xt -> x => t
        };
      },
      Var: function Var(name) {
        return {
          term: [_Var, name],
          size: name.length
        };
      },
      Ref: function Ref(name) {
        return {
          term: [_Ref, name],
          size: name.length
        };
      },
      Let: function Let(name, term, body) {
        return {
          term: [_Let, [[name, term]], body],
          size: 4 + name.length + term.size + body.size // kvt -> k = v t
        };
      },
      Fix: function Fix(name, body) {
        return {
          term: [_Fix, name, body],
          size: 2 + name.length + body.size // xt -> x@ t
        };
      },
      Pri: function Pri(name, args) {
        return {
          term: [_Pri, name, args],
          size: 2 + name.length + args.reduce(function (size, arg) {
            return size + 1 + arg.size;
          }, 0) // oabc -> (o a b c)
        };
      },
      Num: function Num(num) {
        return {
          term: [_Num, num],
          size: String(num).length
        };
      },
      Str: function Str(str) {
        return {
          term: [_Str, str],
          size: 2 + str.length
        };
      },
      Map: function Map(kvs) {
        var isArray = false;
        for (var i = 0; i < kvs.length; ++i) {
          if (kvs[i][0] === "length") isArray = true;
        }if (isArray) {
          var vals = kvs.filter(function (_ref7) {
            var _ref8 = _slicedToArray(_ref7, 2),
                k = _ref8[0],
                v = _ref8[1];

            return k !== "length";
          }).map(function (_ref9) {
            var _ref10 = _slicedToArray(_ref9, 2),
                k = _ref10[0],
                v = _ref10[1];

            return v;
          });
          return {
            term: [Arr, vals],
            size: 2 + vals.reduce(function (size, v) {
              return size + v.size;
            }, 0) + Math.max(vals.length - 1, 0)
          };
        } else {
          return {
            term: [_Map, kvs.map(function (_ref11) {
              var _ref12 = _slicedToArray(_ref11, 2),
                  k = _ref12[0],
                  v = _ref12[1];

              return [k, v];
            })],
            size: 2 + kvs.reduce(function (size, _ref13) {
              var _ref14 = _slicedToArray(_ref13, 2),
                  k = _ref14[0],
                  v = _ref14[1];

              return size + k.length + 1 + v.size;
            }, 0) + Math.max(kvs.length - 1, 0)
          };
        }
      }
    });

    // AST, (AST -> Maybe AST) -> AST
    //   Performs a transforming pass
    var pass = function pass(ast, fn) {
      var F = function F(_ref15, S) {
        var t = _ref15.term,
            s = _ref15.size;

        var transformed = fn({ term: t, size: s });
        if (transformed) {
          return F(transformed, S);
        } else {
          switch (t[0]) {
            case _App:
              return { size: s, term: [_App, F(t[1], S), t[2].map(function (x) {
                  return F(x, S);
                })] };
            case _Lam:
              return { size: s, term: [_Lam, t[1], F(t[2], S)] };
            case _Var:
              var match = find(function (_ref16) {
                var _ref17 = _slicedToArray(_ref16, 2),
                    name = _ref17[0],
                    val = _ref17[1];

                return name === t[1];
              }, S);
              return match ? match[1] : { size: s, term: [_Var, t[1]] };
            case _Ref:
              return { size: s, term: [_Ref, t[1]] };
            case _Let:
              return { size: s, term: [_Let, t[1].map(function (_ref18) {
                  var _ref19 = _slicedToArray(_ref18, 2),
                      k = _ref19[0],
                      v = _ref19[1];

                  return [k, F(v, S)];
                }), F(t[2], S)] };
            case _Fix:
              return { size: s, term: [_Fix, t[1], F(t[2], S)] };
            case _Pri:
              return { size: s, term: [_Pri, t[1], t[2].map(function (x) {
                  return F(x, S);
                })] };
            case _Num:
              return { size: s, term: [_Num, t[1]] };
            case _Str:
              return { size: s, term: [_Str, t[1]] };
            case _Map:
              return { size: s, term: [_Map, t[1].map(function (_ref20) {
                  var _ref21 = _slicedToArray(_ref20, 2),
                      k = _ref21[0],
                      v = _ref21[1];

                  return [k, F(v, S)];
                })] };
            case Arr:
              return { size: s, term: [Arr, t[1].map(function (v) {
                  return F(v, S);
                })] };
            case Blk:
              return { size: s, term: [Blk, F(t[1], S)] };
            case Lif:
              return { size: s, term: [Lif, F(t[1], S)] };
            case Sub:
              return F({ term: t[3].term, size: s }, [[t[1], F(t[2], S)], S]);
          }
        };
      };
      return F(ast, null);
    };

    // Recovers bang-notation from code without it
    var monadicAst = pass(ast, function (_ref22) {
      var t = _ref22.term,
          s = _ref22.size;

      // (App f [(Lam [v] b)]) -> (Blk b[(Lif f)/v]) {iff v is linear}
      // TODO: this assumes variables starting with "_" are linear. This is
      // enforced on MoonJS, but isn't part of the specs. Implement properly.
      if (t[0] === _App && t[2][0].term[0] === _Lam && t[2][0].term[1][0][0] === "_") {
        var caller = {
          term: [Lif, t[1]],
          size: t[1].size + 1 // f -> <f
        };
        var block = {
          term: [Sub, t[2][0].term[1][0], caller, t[2][0].term[2]],
          size: t[2][0].term[2].size - t[2][0].term[1][0].length + caller.size
        };
        return {
          term: [Blk, block],
          size: 2 + block.size // f...x... -> f | ...<x...
        };
      }
    });

    // Removes redundant blocks
    var shortMonadicAst = pass(monadicAst, function (_ref23) {
      var t = _ref23.term,
          s = _ref23.size;

      // (Let [...] (Blk b)) -> (Let [...] b)
      // (Lam [...] (Blk b)) -> (Lam [...] b)
      // (Fix [...] (Blk b)) -> (Fix [...] b)
      if ((t[0] === _Let || t[0] === _Lam || t[0] === _Fix) && t[2].term[0] === Blk) {
        return {
          term: [t[0], t[1], t[2].term[1]],
          size: s - 2
        };
      }
      // (Blk (Blk b)) -> (Blk b)
      if (t[0] === Blk && t[1].term[0] === Blk) {
        return t[1];
      };
    });

    // Compacts single-arg lets, lams and apps into multi-arg forms
    var finalAst = pass(shortMonadicAst, function (_ref24) {
      var t = _ref24.term,
          s = _ref24.size;

      // (Let [[k0 v0] ...] [Let [[k1 v1]] t]) -> (Let [[k0 v0] ... [k1 v1]] t)
      if (t[0] === _Let && t[2].term[0] === _Let && t[2].term[1].length === 1) {
        return {
          term: [_Let, t[1].concat(t[2].term[1]), t[2].term[2]],
          size: s
        };
      }
      // (Let [[k0 v0] ...] [Let [[k1 v1]] t]) -> (Let [[k0 v0] ... [k1 v1]] t)
      if (t[0] === _Let && t[2].term[0] === _Let && t[2].term[1].length === 1) {
        return {
          term: [_Let, t[1].concat(t[2].term[1]), t[2].term[2]],
          size: s
        };
      }
      // (Lam [v0 ...] [Lam [v1] t]) -> (Lam [v0 ... v1] t)
      if (t[0] === _Lam && t[2].term[0] === _Lam && t[2].term[1].length === 1) {
        return {
          term: [_Lam, t[1].concat(t[2].term[1]), t[2].term[2]],
          size: s
        };
      }
      // (App [App f [x]] [... y]) -> (App f [x ... y])
      if (t[0] === _App && t[1].term[0] === _App && t[1].term[2].length === 1) {
        return {
          term: [_App, t[1].term[1], t[1].term[2].concat(t[2])],
          size: s - 2 // ((a b) c) -> (a b c)
        };
      }
    });

    // Formats without indentation
    var stringifyFlat = function stringifyFlat(_ref25) {
      var term = _ref25.term,
          size = _ref25.size;

      var go = function go(_ref26) {
        var term = _ref26.term,
            size = _ref26.size;

        var joinMany = function joinMany(terms) {
          return D.Many(terms.map(function (term, i) {
            return D.Many([D.Text(i > 0 ? " " : ""), go(term)]);
          }));
        };
        switch (term[0]) {
          case _App:
            return D.Many([D.Text("("), go(term[1]), D.Text(" "), joinMany(term[2]), D.Text(")")]);
          case _Lam:
            return D.Many([D.Many(term[1].map(function (v) {
              return D.Many([D.Var(v), D.Text(" =>"), D.Text(" ")]);
            })), go(term[2])]);
          case _Var:
            return D.Var(term[1]);
          case _Ref:
            return D.Ref(term[1]);
          case _Let:
            return D.Many([D.Many(term[1].map(function (_ref27) {
              var _ref28 = _slicedToArray(_ref27, 2),
                  k = _ref28[0],
                  v = _ref28[1];

              if (k === "_" && v.term[0] === Lif) {
                return go({
                  term: [Seq, v.term[1]],
                  size: v.term[1].size + 2
                });
              } else {
                return D.Many([D.Var(k), D.Text(" = "), go(v), D.Text(" ")]);
              }
            })), go(term[2])]);
          case _Fix:
            return D.Many([term[1], D.Text("@"), D.Text(" "), go(term[2])]);
          case _Pri:
            return D.Many([D.Text("("), D.Pri(term[1]), D.Text(" "), joinMany(term[2]), D.Text(")")]);
          case _Num:
            return D.Num(String(term[1]));
          case _Str:
            return D.Str(D.Many([D.Text('"'), term[1], D.Text('"')]));
          case _Map:
            return D.Many([D.Text("{"), D.Many(term[1].map(function (_ref29, i) {
              var _ref30 = _slicedToArray(_ref29, 2),
                  k = _ref30[0],
                  v = _ref30[1];

              return D.Many([D.Text(i > 0 ? " " : ""), D.Key(k), D.Text(":"), go(v)]);
            })), D.Text("}")]);
          case Arr:
            return D.Many([D.Text("["), joinMany(term[1]), D.Text("]")]);
          case Blk:
            return D.Many([D.Text("| "), go(term[1])]);
          case Lif:
            return D.Many([D.Text("<"), go(term[1])]);
          case Seq:
            return D.Many([go(term[1]), D.Text("> ")]);
        }
      };
      return go({ term: term, size: size });
    };

    // Formats with indentation
    var stringify = function stringify(_ref31) {
      var term = _ref31.term,
          size = _ref31.size;

      var tabs = 0;
      var prep = null;
      var prepSize = 0;
      var lines = [];
      var limit = D.maxCols || 80;
      var prepend = function prepend(str, size) {
        return prep = str, prepSize = size;
      };
      var tab = function tab() {
        return ++tabs;
      };
      var untab = function untab() {
        return --tabs;
      };
      var push = function push(str) {
        return lines.push(D.Line(tabs, D.Many([prep, str]))), prep = null;
      };
      var fits = function fits(size) {
        return tabs * 2 + prepSize + size <= limit;
      };
      var go = function go(_ref32) {
        var term = _ref32.term,
            size = _ref32.size;

        if (fits(size)) {
          push(stringifyFlat({ term: term, size: size }));
        } else {
          switch (term[0]) {
            case _App:
              if (fits(1 + term[1].size)) {
                push(D.Many([D.Text("("), stringifyFlat(term[1]), D.Text(" ")]));
                tab();
                term[2].forEach(go);
                untab();
                push(D.Text(")"));
              } else {
                push(D.Text("("));
                tab();
                go(term[1]);
                term[2].forEach(go);
                untab();
                push(D.Text(")"));
              }
              break;
            case _Lam:
              push(D.Many(term[1].map(function (v) {
                return D.Many([D.Var(v), D.Text(" => ")]);
              })));
              tab();
              go(term[2]);
              untab();
              break;
            case _Let:
              for (var i = 0; i < term[1].length; ++i) {
                var assignment = D.Many([D.Var(term[1][i][0]), " = "]);
                if (term[1][i][0] === "_" && term[1][i][1].term[0] === Lif) {
                  go({
                    term: [Seq, term[1][i][1].term[1]],
                    size: term[1][i][1].term[1].size + 2
                  });
                } else if (term[1][i][1].term[0] === _Let) {
                  push(assignment);
                  tab();
                  go(term[1][i][1]);
                  untab();
                } else {
                  prepend(assignment, term[1][i][0].length + 2);
                  go(term[1][i][1]);
                }
              }
              go(term[2]);
              break;
            case _Var:
              push(D.Var(term[1]));
              break;
            case _Ref:
              push(D.Ref(term[1]));
              break;
            case _Fix:
              push(D.Many([term[1], D.Text("@"), D.Text(" ")]));
              tab();
              go(term[2]);
              untab();
              break;
            case _Pri:
              var inlineFor = false;
              if (term[1] === "for") {
                var forLam = term[2][term[2].length - 1];
                if (forLam.term[0] === _Lam) {
                  var forArgs = term[2].slice(0, -1);
                  var forSize = 4 + forArgs.reduce(function (s, arg) {
                    return s + arg.size + 1;
                  }, 0) + forLam.size - forLam.term[2].size;
                  inlineFor = fits(forSize);
                }
              }
              var inlineIf = false;
              if (term[1] === "if") {
                inlineIf = fits(3 + term[2][0].size);
              }
              if (inlineFor) {
                push(D.Many([D.Text("("), D.Pri(term[1]), D.Text(" "), stringifyFlat(term[2][0]), D.Text(" "), stringifyFlat(term[2][1]), D.Text(" "), stringifyFlat(term[2][2]), D.Text(" "), D.Many(forLam.term[1].map(function (v) {
                  return D.Many([D.Var(v), D.Text(" => ")]);
                }))]));
                tab();
                go(forLam.term[2]);
                untab();
                push(D.Text(")"));
              } else if (inlineIf) {
                push(D.Many([D.Text("("), D.Pri(term[1]), D.Text(" "), stringifyFlat(term[2][0])]));
                tab();
                term[2].slice(1).forEach(go);
                untab();
                push(D.Text(")"));
              } else {
                push(D.Many([D.Text("("), D.Pri(term[1])]));
                tab();
                term[2].forEach(go);
                untab();
                push(D.Text(")"));
              }
              break;
            case _Num:
              push(D.Num(String(term[1])));
              break;
            case _Str:
              push(D.Str('"' + term[1] + '"'));
              break;
            case _Map:
              push(D.Text("{"));
              tab();
              for (var i = 0; i < term[1].length; ++i) {
                var key = D.Many([D.Key(term[1][i][0]), D.Text(":"), D.Text(" ")]);
                if (term[1][i][1].term[0] === _Let) {
                  push(key);
                  tab();
                  go(term[1][i][1]);
                  untab();
                } else {
                  prepend(key, term[1][i][0].length + 2);
                  go(term[1][i][1]);
                }
              }
              untab();
              push(D.Text("}"));
              break;
            case Arr:
              push(D.Text("["));
              tab();
              for (var i = 0; i < term[1].length; ++i) {
                go(term[1][i]);
              }
              untab();
              push(D.Text("]"));
              break;
            case Blk:
              push(D.Text("| "));
              tab();
              go(term[1]);
              untab();
              break;
            case Lif:
              push(D.Text("<"));
              go(term[1]);
              break;
            case Seq:
              go(term[1]);
              push(D.Text(">"));
              break;
          }
        }
      };
      go({ term: term, size: size });
      return D.Many(lines);
    };

    return D.indent ? stringify(finalAst) : stringifyFlat(finalAst);
  };
};

var termToString = function termToString(term) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var repeat = function repeat(n, str) {
    return n === 0 ? "" : str + repeat(n - 1, str);
  };
  var spaces = opts.indent === undefined ? 2 : opts.indent;
  return termFormatter({
    indent: spaces > 0,
    maxCols: opts.maxCols,
    Many: function Many(terms) {
      return terms.join("");
    },
    Text: function Text(text) {
      return text;
    },
    Var: function Var(name) {
      return name;
    },
    Ref: function Ref(name) {
      return name;
    },
    Pri: function Pri(name) {
      return name;
    },
    Key: function Key(name) {
      return name;
    },
    Num: function Num(name) {
      return name;
    },
    Str: function Str(name) {
      return name;
    },
    Line: function Line(tabs, line) {
      return repeat(spaces * tabs, " ") + line + "\n";
    }
  })(term);
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
  "for": 4,
  "len": 1,
  "and": 2,
  "or": 2,
  "xor": 2
};

module.exports = {
  termFromString: termFromString,
  termToString: termToString,
  termFormatter: termFormatter
};