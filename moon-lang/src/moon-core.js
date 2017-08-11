// Welcome to Moon's reference implementation. Since there is no formal spec
// of the language yet, here is a brief informal but pretty much complete one.
// Moon is, in essence, the lambda-calculus plus JSON and pure JSON-operations.
// Its core language has just 9 constructors.
//
// data MoonTerm
//   = App MoonTerm MoonTerm
//   | Lam String MoonTerm
//   | Var String
//   | Let String MoonTerm MoonTerm
//   | Fix String MoonTerm
//   | Pri String [MoonTerm]
//   | Num Number
//   | Str String
//   | Map [[String, MoonTerm]]
// 
// App, Lam, Var, Let and Fix do what you expect from the FP literature.
// Pri encodes a primitive operation. Num, Str and Map hold JSON data.
// There are 27 primitive operations:
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
// the value of a key in a map, and may return null. `for` receives an initial
// index, an exclusive limit, an initial state, a function (that receives the
// index and the current state and returns the next state), and then it returns
// the last state of the loop.
//
// Moon's syntax is equally simple. This is the base syntax:
//
// APP: (f x)
// LAM: varName. body
// VAR: varName
// LET: varName: varValue body
// FIX: varName@ body
// PRI: (add x y)
// NUM: 100.75e-32       -- same as JSON numbers
// STR: "I'm a string"   -- same as JSON strings
// MAP: {"x": 1, "y": 2} -- same as JSON objects
//
// There are also some syntax sugars:
//
// Array syntax:
//   This:
//     [0, 1, 2]
//   Desugars to:
//     {"0": 0, "1": 1, "2": 2, "length": 3}
//  
// Monadic notation:
//   This:
//     | ["aaa", <(f x), "bbb", (f y)> "ccc", "ddd"]
//   Desugars to this:
//     (f x A. (f y B. ["aaa", A, "bbb", B, "ccc", "ddd"]))
//   It works very similarly to Idris's bang-notation.
// 
// Finally, there is the "expand-at-compile-time" annotation (`#`) which causes the
// term next to it to be fully normalized at compiled time. This is very useful for 
// optimizing inner loops, vectorial code, fusing list algorithms, etc., since those
// optimizations often can't be performed by the underlying JIT engine.
//
// And that pretty much describes it all! The rest is mostly implementation details.

const find = (fn, list) =>
  list === null ? null
  : fn(list[0]) ? list[0]
  : find(fn, list[1]);

const termFromStringWithDeps = (source) => {
  const parse = (source) => {
    var index = 0;
    var deps = [];
    var nextName = 0;
    var lift = [];
    var lifted = (lift, term) => E => T =>
      lift.reduceRight((rest,[name,term]) =>
        T.App(term(E)(T), T.Lam(name, rest)),
        term(E)(T));
    function parseTerm(vs,li,isKey,isPri) {
      var invalid = /[^a-zA-Z0-9\(\)_{}\[\]\"#\|\/\-<>$]/;

      // Skip spacing
      while (invalid.test(source[index]||""))
        ++index;
        
      // Application
      if (source[index] === "(") {
        var startIndex = index;
        ++index;
        var args = [];
        args.push(parse(vs,li,0,1));
        while (source[index] !== ")") {
          args.push(parse(vs,li,0,0));
          while (invalid.test(source[index]||""))
            ++index;
          if (source[index] === undefined)
            throw "No parse.";
        }
        ++index;
        var endIndex = index;
        return E => T => {
          var name = args[0];
          if (pri.hasOwnProperty(name)) {
            var len = args.length - 1;
            var arity = pri[name][1];
            var priArgs = [];
            for (var i = 0; i < arity; ++i) {
              priArgs.push(i < len ? args[i+1](E)(T) : T.Var("x" + (i - len)));
            }
            var curried = T.Pri(name, priArgs);
            for (var i = 0; i < arity - len; ++i) {
              curried = T.Lam("x" + (arity - 1 - len - i), curried);
            }
            for (var i = 0; i < len - arity; ++i) {
              curried = T.App(curried, args[arity + 1 + i]);
            }
            return curried;
          } else {
            var app = name(E)(T);
            for (var i = 1; i < args.length; ++i) {
              app = T.App(app,args[i](E)(T));
            }
          }
          return app;
        };

      // Number
      } else if (/[0-9\-]/.test(source[index])) {
        var number = "";
        if (source[index] === "-")
          number = source[index++];
        while (/[0-9]/.test(source[index]))
          number += source[index++];
        if (source[index] === ".") {
          number += source[index++];
          while (/[0-9]/.test(source[index]))
            number += source[index++];
        }
        if (/^[eE]/.test(source[index])) {
          number += source[index++];
          if (/[+\-]/.test(source[index]))
            number += source[index++];
          while (/[0-9]/.test(source[index]))
            number += source[index++];
        }
        return E => T => T.Num(Number(number));

      // String
      } else if (/"/.test(source[index])) {
        ++index;
        var string = "";
        while (!/"/.test(source[index])) {
          if (source[index] === undefined)
            throw "";
          if (source[index] !== "\\") {
            string += source[index++];
          } else {
            ++index;
            if (/[\\"\/bfnrt]/.test(source[index])) {
              switch (source[index]) {
                case "b": string += "\b"; break;
                case "f": string += "\f"; break;
                case "n": string += "\n"; break;
                case "r": string += "\r"; break;
                case "t": string += "\t"; break;
                case "\\": string += "\\"; break;
                case "/": string += "/"; break;
                case '"': string += ''; break;
                default: throw "Bad string literal: " + string;
              }
            } else if (/u/.test(source[index])) {
              ++index;
              var hex
                = string[index++] + string[index++]
                + string[index++] + string[index++];
              if (/[0-9a-fA-F]{4}/.test(hex)) {
                string += JSON.parse("\\u"+hex);
              } else {
                throw "Bad string literal: " + string;
              }
            }
          }
          if (source[index] === undefined)
            throw "No parse.";
        }
        ++index;
        return E => T => T.Str(string);

      // Map/Array notation (syntax sugar)
      } else if (/\{/.test(source[index]) || /\[/.test(source[index])) {
        var isArray = /\[/.test(source[index++]);
        var end = isArray ? /\]/ : /\}/;
        var kvs = [];
        var len = 0;
        while (!end.test(source[index])) {
          var key = isArray ? String(len++) : parse(vs,li,1,0)()({Str:s=>s}); // TODO: expectString param
          var val = parse(vs,li,0,0);
          kvs.push([key,val]);
          while (invalid.test(source[index]))
            ++index;
          if (!source[index])
            throw "No parse.";
        }
        if (isArray)
          kvs.push(["length", E => T => T.Num(len)]);
        ++index;
        return E => T =>
          T.Map(kvs.map(([k,v]) => [k,v(E)(T)]));

      // Bang
      } else if (/</.test(source[index])) {
        ++index;
        var body = parse(vs,li,0,0);
        var name = "_" + nextName++;
        li.push([name,body]);
        return E => T => T.Var(name);

      // Expand at compile time
      } else if (/#/.test(source[index])) {
        ++index;
        var body = parse(vs,li,0,0);
        return E => T => T.Nor(T => body(1)(T));

      // Comment
      } else if (source.slice(index,index+2) === "//") {
        var i = index;
        while (source[index] && source[index++] !== "\n" && index !== source.length) {}
        return parse(vs,li,isKey,isPri);

      // Binder-related
      } else {
        var binder = "";

        while (/[a-zA-Z0-9_$]/.test(source[index]) && index !== source.length)
          binder += source[index++];

        // Lambda
        if (source[index] === ".") {
          var lift = [];
          var body = parse([[binder,null],vs],lift,0,0);
          return E => T =>
            T.Lam(binder, lifted(lift, body)(E)(T));

        // Let
        } else if (source[index] === ":" && !isKey) {
          var subs = parse([[binder,"_rec"],vs],li,0,0);
          var lift = [];
          var body = parse([[binder,subs],vs],lift,0,0);
          return E => T =>
            T.Let(binder,
              subs(E)(T),
              lifted(lift, body)(E)(T));

        // Block
        } else if (/\|/.test(source[index])) {
          ++index;
          var lift = [];
          var body = parse(vs,lift,0,0);
          return E => T => lifted(lift, body)(E)(T);

        // Fix
        } else if (source[index] === "@") {
          var lift = [];
          var body = parse([[binder,null],vs],lift);
          return E => T =>
            T.Fix(binder, lifted(lift,body,0,0)(E)(T));

        // Variable
        } else {
          if (isPri && pri.hasOwnProperty(binder))
            return binder;
          var bind = find(v => v[0] === binder, vs);
          if (!bind) {
            deps.push(binder);
            return E => T => T.Var(binder);
          } else if (bind[0] === "_rec") {
            throw "Recursive let not allowed: check variable '" + binder +"'";
          } else {
            return E => T =>
              E && bind[1]
                ? bind[1](1)(T)
                : T.Var(bind[0]);
          }
        }
      }
    }
    function parse(vs,li,isKey,isPri) {
      var parsed = parseTerm(vs,li,isKey,isPri);
      if (/>/.test(source[index])) {
        ++index;
        li.push(["_", parsed]);
        return parse(vs,li,isKey,isPri);
      }
      return parsed;
    }
    var parsed = parse(null,lift,0,0);
    return {
      term: lifted(lift,parsed)(0),
      deps: deps
    };
  };
  const finalize = (term, scope) => term({
    App: (f, x) => S => T => T.App(f(S)(T), x(S)(T)),
    Lam: (name, body) => S => T => T.Lam(name, body([name,S])(T)),
    Var: name => S => T => (find(n => n === name, S) ? T.Var : T.Dep)(name),
    Let: (name, term, body) => S => T => T.Let(name, term(S)(T), body([name,S])(T)),
    Fix: (name, body) => S => T => T.Fix(name, body([name,S])(T)),
    Pri: (name, args) => S => T => T.Pri(name, args.map(arg => arg(S)(T))),
    Num: num => S => T => T.Num(num),
    Str: str => S => T => T.Str(str),
    Map: kvs => S => T => T.Map(kvs.map(([k,v]) => [k,v(S)(T)])),
    Nor: term => S => T => finalize(termReduceFull(finalize(term,null)),S)(T)
  })(scope, 0);
  const parsed = parse(source);
  return {
    term: finalize(parsed.term,null),
    deps: parsed.deps
  };
};

const termFromStringSafe = string => {
  const parsed = termFromStringWithDeps(string);
  if (parsed.deps.length > 0) {
    throw ("Moon term has free variables: " + parsed.deps.join(", "));
  }
  return parsed.term;
}

const termFromString = string =>
  termFromStringWithDeps(string).term;

const termCompileFast = term => {
  const toJS = term => term({
    App: (f, x) => _ => f() + "(" + x() + ")",
    Lam: (name, body) => self => {
      return self
        ? "(function _"+self+"(_"+name+"){return "+body()+"})"
        : "(_"+name+"=>"+body()+")";
    },
    Var: name => _ => "_"+name,
    Let: (name, term, body) => _ => {
      var t = term();
      var b = body();
      if (/^\(\(\)=>{/.test(b)) {
        return "(()=>{var _"+name+"="+t+";"+b.slice(6);
      } else {
        return "(()=>{var _"+name+"="+t+";return "+b+"})()";
      }
    },
    Fix: (name, body) => _ => body(name),
    Pri: (name, args) => _ => pri[name][3](...(args.map(a => a()))),
    Num: num => _ => JSON.stringify(num),
    Str: str => _ => JSON.stringify(str),
    Map: kvs => _ => "({"+kvs.map(([k,v]) => k+":"+v()).join(",")+"})",
    Dep: name => _ => "_"+name,
  })();
  return "(()=>{"
    + "\"use strict\";"
    + "var "+commonLib.join(",")+";"
    + "return "+toJS(term)
    + "})";
};

const termDecompileFast = func => {
  try {
    const fromJS = (value) => {
      if (typeof value === "object") {
        return T => {
          var kvs = [];
          for (var key in value)
            kvs.push([key, fromJS(value[key])(T)]);
          return T.Map(kvs);
        }
      } else if (typeof value === "string") {
        return T => T.Str(value)
      } else if (typeof value === "number") {
        return T => T.Num(value);
      }
    }
    return fromJS(func);
  } catch (e) {
    throw new Error("Couldn't reduce term on fast mode.");
  }
}

const termReduceFast = term =>
  termDecompileFast(eval(termCompileFast(term))());

const termCompileFull = term => {
  const toJS = term => term({
    App: (f, x) => "$A("+f+","+x+")",
    Lam: (name, body) => "(_"+name+"=>"+body+")",
    Var: (name) => "_"+name,
    Let: (name, term, body) => /^\(\(\)=>{/.test(body)
      ? "(()=>{var _"+name+"="+term+";"+body.slice(6)
      : "(()=>{var _"+name+"="+term+";return "+body+"})()",
    Fix: (name, body) => "(_"+name+"=>(_"+name+"="+body+",_"+name+"))()",
    Pri: (name, xs) => "$"+pri[name][0]+"("+xs.map((o,i)=>pri[name][0]==="if"&&i?"()=>"+o:o).join(",")+")",
    Num: n => JSON.stringify(n),
    Str: s => JSON.stringify(s),
    Map: map => "({"+map.map(([k,v]) => k+":"+v).join(",")+"})",
    Dep: name => "$D('"+name+"')",
  });
  var compiled = "(()=>{"
    + "\"use strict\";"
    + "var $P=((a)=>(a.__=1,a));"
    + "var $D=(a)=>$P(['dep',a]);"
    + "var $A=(a,b)=>typeof a==='function'?a(b):$P(['app',a,b]);"
    + "var "+commonLib.join(",")+","
    + pris.map(pri => "$"+pri[0]+"="+pri[2]).join(",")+";"
    + "return "+toJS(term)+"})";
  return compiled;
};

const termDecompileFull = func => (function fromJS(value){
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const name = n => n > 26 ? chars[n % 26] + name(n / 26 | 0) : chars[n];
  return (function nf(value, depth){
    const App = x => (x.isApp = true, x);
    const app = f => App(x => x === null ? f : app(d => T => T.App(f(d)(T), nf(x,d)(T))));
    if (value.isApp) {
      return value(null)(depth);
    } else if (typeof value === "number") {
      return T => T.Num(value);
    } else if (typeof value === "string") {
      return T => T.Str(value);
    } else if (typeof value === "function") {
      return T => T.Lam(name(depth), nf(value(app(d => T => T.Var(name(depth)))), depth+1)(T));
    } else if (value[0] === "dep") {
      return T => T.Var(value[1]);
    } else if (value[0] === "app") {
      return T => T.App(nf(value[1],depth)(T),nf(value[2],depth)(T));
    } else if (pri.hasOwnProperty(value[0])) {
      return T => T.Pri(value[0], value.slice(1).map(value => nf(value, depth)(T)));
    } else if (typeof value === "object") {
      return T => {
        var kvs = [];
        for (var key in value)
          kvs.push([key, nf(value[key], depth)(T)]);
        return T.Map(kvs);
      };
    } else {
      return value;
    }
  })(value, 0);
})(func);

const termReduceFull = term =>
  termDecompileFull(eval(termCompileFull(term))());

const termReduce = term => T => {
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

const termToString = (term, spaces) => {
  const tree = term({
    App: (f, x) => ["App", f, x],
    Lam: (name, body) => ["Lam", name, body],
    Var: (name) => ["Var", name],
    Let: (name, term, body) => ["Let", name, term, body],
    Fix: (name, body) => ["Fix", name, body],
    Pri: (name, args) => ["Pri", name, args],
    Num: num => ["Num", num],
    Str: str => ["Str", str],
    Map: kvs => ["Map", kvs],
    Dep: (name) => ["Var", name]
  });
  var lvl = 0;
  const str = ([type,a,b,c], k, s) => {
    const nl = (add) => (!s && spaces > 0 ? " \n" : "") + sp((lvl += add, lvl) * (s ? 0 : spaces || 0));
    const wp = (add) => (add > 0 ? nl(add) : add < 0 ? up(add) : "");
    const up = (add) => (lvl += add, "");
    const sp = (n) => n === 0 ? "" : (spaces ? " " : "") + sp(n - 1);
    const w = k === 1 && type !== "Lam" || (k === 2 && type !== "Num" && type !== "Str" && type !== "Map") ? 1 : 0;
    switch (type) {
      case "App":
        const fnStr = str(a,0,s);
        const fnApp = fnStr[0]=== "(" && fnStr[fnStr.length - 1] === ")";
        const fnCln = fnApp ? fnStr.slice(1,-1) : fnStr;
        return wp(w) + "(" + fnCln + " " + str(b,0,1) + ")" + wp(-w);
      case "Lam": return wp(w) + a + "." + (spaces ? " " : "") + str(b,1,s) + wp(-w);
      case "Var": return wp(w) + a + wp(-w);
      case "Let": return wp(w) + a + ":" + (spaces ? " " : "") + str(b,0,s) + " " + nl(0) + str(c,0,s) + wp(-w);
      case "Fix": return wp(w) + a + "@" + str(b,0,s) + wp(-w);
      case "Pri" : return wp(w) + "(" + a + " " + b.map(x => str(x,0,s)).join(" ") + ")" + wp(-w);
      case "Num": return wp(w) + a + wp(-w);
      case "Str": return wp(w) + '"'+a+'"' + wp(-w);
      case "Map":
        var lenIdx = a.reduce((i, [k,v], j) => k === "length" ? j : i, null);
        if (lenIdx !== null) {
          var len = Number(a[lenIdx][1][1]);
          var arr = a.filter(([k,v]) => k !== "length").map(([k,v]) => v);
          var inn = arr.map((v,i) => up(1) + str(v,0,s) + up(-1) + (i < len - 1 ? "," + nl(0) : "")).join("");
          return wp(w) + "[" + nl(1) + inn + nl(-1) + "]" + wp(-w);
        } else {
          var inn = a.map(([k,v],i) => '"' + k + '":' + sp(1) + str(v,2,s) + (i < a.length - 1 ? "," + nl(0) : "")).join("");
          return wp(w) + "{" + nl(1) + inn + nl(-1) + "}" + wp(-w);
        }
      }
  };
  return str(tree,0,0);
};

const termToBinary = term => {
  //App 01
  //Lam 10
  //Var 00
  //Let 1100
  //Fix 11100
  //Pri 1101 + XXXXX
  //Num 11101
  //Str 11110
  //Map 11111
  const encodeStr = str =>
    encodeNat(str.length) + str.split("").map(c => encodeNat(c.charCodeAt(0))).join("");
  const encodeNat = (num) => {
    var str = "";
    for (var n = num + 1; n > 1; n = (n / 2) | 0)
      str = "1" + n % 2 + str;
    return str + "0";
  }
  const encodeDep = (str) => {
    
  }
  return term({
    App: (f, x) => S => "10" + f(S) + x(S),
    Lam: (name, body) => S => "01" + body([name,S]),
    Var: (name) => S => {
      var find = (S) => !S ? (()=>{throw ""})() : S[0] === name ? 0 : 1 + find(S[1]);
      return "00" + encodeNat(find(S));
    },
    Dep: (name) => S => {
      var num = Number(name.slice(1));
      if (name[0] !== "$" || isNaN(num))
        throw "Free var: " + name;
      var len = (S) => !S ? 0 : 1 + len(S[1]);
      return "00" + encodeNat(len(S) + num);
    },
    Let: (name, term, body) => S => "1100" + term(S) + body([name,S]),
    Fix: (name, term) => S => "11100" + term([name,S]),
    Pri: (name, args) => S => "1101" + pri[name][5] + args.map(arg => arg(S)).join(""),
    Num: (num) => S => "11101" + encodeNat(num),
    Str: (str) => S => "11110" + encodeStr(str),
    Map: (kvs) => S => "11111" + encodeNat(kvs.length) + kvs.map(([k,v]) => encodeStr(k) + v(S)).join("")
  })(null);
};

const termFromBinary = src => {
  var idx = 0;
  const parseStr = () => {
    var len = parseNat();
    var nats = [];
    for (var j = 0; j < len; ++j)
      nats.push(parseNat());
    return nats.map(n => String.fromCharCode(n)).join("");
  };
  const parseNat = () => {
    var num = 1;
    while (src[(idx+=2)-2] !== "0")
      num = num * 2 + Number(src[idx-1]);
    return (idx--, num - 1);
  };
  const head = (head) => {
    if (src.slice(idx, idx + head.length) === head) {
      idx += head.length;
      return true;
    }
    return false;
  }
  const parseTerm = (d) => {
    if (head("10")) {
      var f = parseTerm(d);
      var x = parseTerm(d);
      return T => T.App(f(T), x(T));
    } else if (head("01")) {
      var body = parseTerm(d+1);
      return T => T.Lam("v"+d, body(T));
    } else if (head("00")) {
      var i = parseNat();
      var k = d - i - 1;
      return T => T.Var(k < 0 ? "$"+(-k-1) : "v"+k);
    } else if (head("1100")) {
      var term = parseTerm( d);
      var body = parseTerm(d+1);
      return T => T.Let("v"+d, term(T), body(T));
    } else if (head("11100")) {
      var body = parseTerm(d+1);
      return T => T.Fix("v"+d, body(T));
    } else if (head("1101")) {
      var pri = pri2[src.slice(idx, idx += 5)];
      var args = [];
      for (var i = 0; i < pri[1]; ++i)
        args.push(parseTerm( d));
      return T => T.Pri(pri[0], args.map(a => a(T)));
    } else if (head("11101")) {
      var nat = parseNat();
      return T => T.Num(nat);
    } else if (head("11110")) {
      var str = parseStr();
      return T => T.Str(str);
    } else if (head("11111")) {
      var len = parseNat();
      var kvs = [];
      for (var i = 0; i < len; ++i)
        kvs.push([parseStr(d), parseTerm(d)]);
      return T => T.Map(kvs.map(([k,v]) => [k,v(T)]));
    }
  };
  return parseTerm(0);
};

const termToBytes = term => {
  var binary = termToBinary(term);
  var hex = "";
  for (var i = 0; i < binary.length; i += 4) {
    var bits = binary.slice(i,i+4);
    while (bits.length < 4)
      bits = bits + "0";
    hex += parseInt(bits, 2).toString(16);
  }
  if (hex.length % 2 !== 0)
    hex += "0";
  return hex;
};

const termFromBytes = bytes => {
  var binary = "";
  for (var i = 0; i < bytes.length; ++i)
    binary += ("0000"+parseInt(bytes[i], 16).toString(2)).slice(-4);
  return termFromBinary(binary);
};

const commonLib = [
  "$F=(a)=>typeof a===\"function\"?1:0",
  "$S=(a)=>typeof a===\"string\"?1:0",
  "$N=(a)=>typeof a===\"number\"?1:0",
  "$O=(a)=>typeof a===\"object\"&&!a.__?1:0",
  "$U=undefined",
  "$V=undefined"
];

const pris = [
  ["if" , 3, "(a,b,c)=>$N(a)?(a?b():c()):$P(['if',a,b(),c()])", (a,b,c)=>"("+a+"?"+b+":"+c+")", "000", "00000"],
  ["add", 2, "(a,b)=>$N(a)&&$N(b)?a+b:$P(['add',a,b])", (a,b)=>"("+a+"+"+b+")", "001", "00001"],
  ["sub", 2, "(a,b)=>$N(a)&&$N(b)?a-b:$P(['sub',a,b])", (a,b)=>"("+a+"-"+b+")", "002", "00010"],
  ["mul", 2, "(a,b)=>$N(a)&&$N(b)?a*b:$P(['mul',a,b])", (a,b)=>"("+a+"*"+b+")", "010", "00011"],
  ["div", 2, "(a,b)=>$N(a)&&$N(b)?a/b:$P(['div',a,b])", (a,b)=>"("+a+"/"+b+")", "011", "00100"],
  ["mod", 2, "(a,b)=>$N(a)&&$N(b)?a%b:$P(['mod',a,b])", (a,b)=>"("+a+"%"+b+")", "012", "00101"],
  ["pow", 2, "(a,b)=>$N(a)&&$N(b)?Math.pow(a,b):$P(['pow',a,b])", (a,b)=>"Math.pow("+a+","+b+")", "020", "00110"],
  ["log", 2, "(a,b)=>$N(a)&&$N(b)?Math.log(b)/Math.log(a):$P(['log',a,b])", (a,b)=>"Math.log("+b+")/Math.log("+a+")", "021", "00111"],
  ["ltn", 2, "(a,b)=>$N(a)&&$N(b)?(a<b?1:0):$P(['ltn',a,b])", (a,b)=>"("+a+"<"+b+"?1:0)", "022", "01000"],
  ["gtn", 2, "(a,b)=>$N(a)&&$N(b)?(a>b?1:0):$P(['gtn',a,b])", (a,b)=>"("+a+">"+b+"?1:0)", "100", "01001"],
  ["eql", 2, "(a,b)=>$N(a)&&$N(b)?(a===b?1:0):$P(['eql',a,b])", (a,b)=>"("+a+"==="+b+"?1:0)", "101", "01010"],
  ["flr", 1, "(a)=>$N(a)?Math.floor(a):$P(['flr',a])", (a)=>"Math.floor("+a+")", "102", "01011"],
  ["sin", 1, "(a)=>$N(a)?Math.sin(a):$P(['sin',a])", (a)=>"Math.sin("+a+")", "110", "01100"],
  ["cos", 1, "(a)=>$N(a)?Math.cos(a):$P(['cos',a])", (a)=>"Math.cos("+a+")", "111", "01101"],
  ["tan", 1, "(a)=>$N(a)?Math.tan(a):$P(['tan',a])", (a)=>"Math.tan("+a+")", "112", "01110"],
  ["asn", 1, "(a)=>$N(a)?Math.asin(a):$P(['asn',a])", (a)=>"Math.asin("+a+")", "120", "01111"],
  ["acs", 1, "(a)=>$N(a)?Math.acos(a):$P(['acs',a])", (a)=>"Math.acos("+a+")", "121", "10000"],
  ["atn", 1, "(a)=>$N(a)?Math.atan(a):$P(['atn',a])", (a)=>"Math.atan("+a+")", "122", "10001"],
  ["con", 2, "(a,b)=>$S(a)&&$S(b)?a+b:$P(['con',a,b])", (a,b)=>"("+a+"+"+b+")", "200", "10010"],
  ["slc", 3, "(a,b,c)=>$S(a)&&$N(b)&&$N(c)?a.slice(b,c):$P(['slc',a,b,c])", (a,b,c)=>a+".slice("+b+","+c+")", "201", "10011"],
  ["cmp", 2, "(a,b)=>$S(a)&&$S(b)?(a===b?1:0):$P(['cmp',a,b])", (a,b)=>a+"==="+b, "202", "10100"],
  ["nts", 1, "(a)=>$N(a)?String(a):$P(['nts',a])", (a)=>"String("+a+")", "210", "10101"],
  ["stn", 1, "(a)=>$S(a)?Number(a):$P(['stn',a])", (a)=>"Number("+a+")", "211", "10110"],
  ["gen", 1, "(f,_)=>f(k=>v=>a=>(!$S(k)||!$O(a)?$P(['gen',f]):(a[k]=v,a)))({})", (f)=>f+"(k=>v=>a=>(a[k]=v,a))({})", "212", "10111"],
  ["get", 2, "(a,k)=>$O(a)&&$S(k)?(($V=a[k])!==$U?$V:null):$P(['get',a,k])", (a,k,d)=>"(($V="+a+"["+k+"])!==$U?$V:"+d+")", "220", "11000"],
  ["for", 4, "(a,b,c,d)=>{if($N(a)&&$N(b)&&$F(d)){while(a<b)c=d(a++)(c);return c};return $P(['for',a,b,c,d]);}",
    (i,j,x,f)=>"((i,j,x,f)=>{f="+f+";x="+x+";for(i="+i+",j="+j+";i<j;++i){x=f(i)(x);};return x;})()", "222", "11010"]
];

const pri = pris.reduce((pris, pri) => (pris[pri[0]] = pri, pris), {});
const pri2 = pris.reduce((pris, pri) => (pris[pri[5]] = pri, pris), {});

module.exports = {
  termFromString,
  termFromStringSafe,
  termFromStringWithDeps,
  termToString,
  termCompileFast,
  termDecompileFast,
  termReduceFast,
  termCompileFull,
  termDecompileFull,
  termReduceFull,
  termReduce,
  termToBinary,
  termFromBinary,
  termToBytes,
  termFromBytes
};
