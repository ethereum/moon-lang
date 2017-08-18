const find = require("./moon-util").find;
const termReduceFull = require("./moon-jit-compiler").termReduceFull;

const termFromString = (source) => {
  var error = "No parse.";
  const parse = (source) => {
    var index = 0;
    var nextName = 0;
    var lift = [];
    var lifted = (lift, term) => E => T =>
      lift.reduceRight((rest,[name,term]) =>
        T.App(term(E)(T), T.Lam(name, rest)),
        term(E)(T));
    function parseTerm(vs,li,isKey,isPri) {
      var invalid = /[^a-zA-Z0-9\(\)_{}\[\]\"#\|\/\-<>$=@]/;

      // Skip spacing
      while (invalid.test(source[index]||""))
        ++index;

      // Comment
      if (/(\/\/|--)/.test(source.slice(index,index+2))) {
        var i = index;
        while (source[index] && source[index++] !== "\n" && index !== source.length) {}
        return parse(vs,li,isKey,isPri);
        
      // Application
      } else if (source[index] === "(") {
        var startIndex = index;
        ++index;
        var next;
        var args = [];
        args.push(parse(vs,li,0,1));
        while ((next = parse(vs,li,0,0)) !== null) {
          args.push(next);
        }
        var endIndex = index;
        return E => T => {
          var name = args[0];
          if (priArity.hasOwnProperty(name)) {
            var len = args.length - 1;
            var arity = priArity[name];
            var priArgs = [];
            for (var i = 0; i < arity; ++i) {
              priArgs.push(i < len ? args[i+1](E)(T) : T.Var("v" + (i - len)));
            }
            var curried = T.Pri(name, priArgs);
            for (var i = 0; i < arity - len; ++i) {
              curried = T.Lam("v" + (arity - 1 - len - i), curried);
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

      // String
      } else if (/"/.test(source[index]) || (isKey && !/}/.test(source[index]))) {
        index += isKey ? 0 : 1;
        var string = "";
        while (!/"/.test(source[index]) && !(isKey && /:/.test(source[index]))) {
          if (source[index] === undefined)
            throw error;
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
                default: throw error;
              }
            } else if (/u/.test(source[index])) {
              ++index;
              var hex
                = string[index++] + string[index++]
                + string[index++] + string[index++];
              if (/[0-9a-fA-F]{4}/.test(hex)) {
                string += JSON.parse("\\u"+hex);
              } else {
                throw error;
              }
            }
          }
          if (source[index] === undefined)
            throw error;
        }
        ++index;
        return E => T => T.Str(string);

      // Number
      } else if (/[0-9\-]/.test(source[index]) && !/^[a-f0-9]{16}$/.test(source.slice(index,index+16))) {
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

      // Map/Array notation (syntax sugar)
      } else if (/\{/.test(source[index]) || /\[/.test(source[index])) {
        var isArray = /\[/.test(source[index++]);
        var kvs = [];
        var len = 0;
        var next;
        while ((next = parse(vs,li,isArray?0:1,0)) !== null) {
          var key = isArray ? String(len++) : next()({Str:s=>s}); // TODO: expectString param
          var val = isArray ? next : parse(vs,li,0,0);
          kvs.push([key,val]);
        }
        if (isArray)
          kvs.push(["length", E => T => T.Num(len)]);
        return E => T =>
          T.Map(kvs.map(([k,v]) => [k,v(E)(T)]));

      // End of Map/Array
      } else if (/(\}|\]|\))/.test(source[index]) || index >= source.length) {
        ++index;
        return null;

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

      // Binder-related
      } else {
        var binder = "";

        while (/[a-zA-Z0-9_$]/.test(source[index]) && index !== source.length)
          binder += source[index++];

        while (invalid.test(source[index]||""))
          ++index;

        // Lambda
        if (/(=>)/.test(source.slice(index, index + 2))) {
          index += 2;
          var lift = [];
          var body = parse([[binder,null],vs],lift,0,0);
          return E => T =>
            T.Lam(binder, lifted(lift, body)(E)(T));

        // Let
        } else if (/=/.test(source[index])) {
          ++index;
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
          ++index;
          var lift = [];
          var body = parse([[binder,null],vs],lift);
          return E => T =>
            T.Fix(binder, lifted(lift,body,0,0)(E)(T));

        // Variable
        } else {
          if (isPri && priArity.hasOwnProperty(binder))
            return binder;
          var bind = find(v => v[0] === binder, vs);
          if (!bind) {
            return E => T => T.Ref(binder);
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
      if (/>/.test(source[index]) && parsed !== null) {
        ++index;
        li.push(["_", parsed]);
        return parse(vs,li,isKey,isPri);
      }
      return parsed;
    }
    var parsed = parse(null,lift,0,0);
    return lifted(lift,parsed)(0);
  };
  const finalize = (term, scope) => term({
    App: (f, x) => S => T => T.App(f(S)(T), x(S)(T)),
    Lam: (name, body) => S => T => T.Lam(name, body([name,S])(T)),
    Var: name => S => T => (find(n => n === name, S) ? T.Var : T.Ref)(name),
    Ref: name => S => T => T.Ref(name),
    Let: (name, term, body) => S => T => T.Let(name, term(S)(T), body([name,S])(T)),
    Fix: (name, body) => S => T => T.Fix(name, body([name,S])(T)),
    Pri: (name, args) => S => T => T.Pri(name, args.map(arg => arg(S)(T))),
    Num: num => S => T => T.Num(num),
    Str: str => S => T => T.Str(str),
    Map: kvs => S => T => T.Map(kvs.map(([k,v]) => [k,v(S)(T)])),
    Nor: term => S => T => finalize(termReduceFull(finalize(term,null)),S)(T)
  })(scope, 0);
  const parsed = parse(source);
  return finalize(parsed, null);
};

const termToString = (term, spaces) => {
  const tree = term({
    App: (f, x) => ["App", f, x],
    Lam: (name, body) => ["Lam", name, body],
    Var: (name) => ["Var", name],
    Ref: (name) => ["Ref", name],
    Let: (name, term, body) => ["Let", name, term, body],
    Fix: (name, body) => ["Fix", name, body],
    Pri: (name, args) => ["Pri", name, args],
    Num: num => ["Num", num],
    Str: str => ["Str", str],
    Map: kvs => ["Map", kvs]
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
      case "Lam": return wp(w) + a + "=>" + (spaces ? " " : "") + str(b,1,s) + wp(-w);
      case "Var": return wp(w) + a + wp(-w);
      case "Ref": return wp(w) + a + wp(-w);
      case "Let": return wp(w) + a + "=" + (spaces ? " " : "") + str(b,0,s) + " " + nl(0) + str(c,0,s) + wp(-w);
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
          var inn = a.map(([k,v],i) => k + ':' + sp(1) + str(v,2,s) + (i < a.length - 1 ? "," + nl(0) : "")).join("");
          return wp(w) + "{" + nl(1) + inn + nl(-1) + "}" + wp(-w);
        }
      }
  };
  return str(tree,0,0);
};

const priArity = {
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
  termFromString,
  termToString,
}
