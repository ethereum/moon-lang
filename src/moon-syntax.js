// Comments: https://github.com/MaiaVictor/moon-lang/issues/23

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
        var lamb = 0;
        var args = [];
        args.push(parse(vs,li,0,1));
        while (true) {
          while (invalid.test(source[index]||"")) ++index;
          if(source[index+1] == "_") {
            ++index;
            args.push(E => T => T.Var("_" + lamb++))
          }
          else if ((next = parse(vs,li,0,0)) !== null) {
            args.push(next);
          }
          else break;
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
            while(lamb-- > 0) curried = T.Lam("_" + lamb, app);
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
            while(lamb-- > 0) app = T.Lam("_" + lamb, app);
            return app;
          }
        };

      // String
      } else if (/"/.test(source[index]) || (isKey && !/[}\]]/.test(source[index]))) {
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
              switch (source[index++]) {
                case "b": string += "\b"; break;
                case "f": string += "\f"; break;
                case "n": string += "\n"; break;
                case "r": string += "\r"; break;
                case "t": string += "\t"; break;
                case "\\": string += "\\"; break;
                case "/": string += "/"; break;
                case '"': string += '"'; break;
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
          } else if (bind[1] === "_rec") {
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
        var name = "_" + nextName++;
        li.push([name, parsed]);
        var rest = parse(vs,li,isKey,isPri);
        return E => T => T.Let("_", T.Var(name), rest(E)(T));
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

const termFormatter = decorations => term => {
  const D = decorations;

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

  const App = 0  , Lam = 1   , Var = 2  , Ref = 3  ,
        Let = 4  , Fix = 5   , Pri = 6  , Num = 7  ,
        Str = 8  , Map = 9   , Arr = 10 , Blk = 11 ,
        Lif = 12 , Seq = 13  , Sub = 14;

  // AST
  //   Builds a formattable AST from a Moon AST
  const ast = term({
    App: (f, x) => ({
      term: [App, f, [x]],
      size: 3 + f.size + x.size // fx -> (f x)
    }),
    Lam: (name, body) => ({
      term: [Lam, [name], body],
      size: 4 + name.length + body.size, // xt -> x => t
    }),
    Var: name => ({
      term: [Var, name],
      size: name.length
    }),
    Ref: name => ({
      term: [Ref, name],
      size: name.length
    }),
    Let: (name, term, body) => ({
      term: [Let, [[name,term]], body],
      size: 4 + name.length + term.size + body.size, // kvt -> k = v t
    }),
    Fix: (name, body) => ({
      term: [Fix, name, body],
      size: 2 + name.length + body.size // xt -> x@ t
    }),
    Pri: (name, args) => ({
      term: [Pri, name, args],
      size: 2 + name.length + args.reduce((size,arg) => size + 1 + arg.size, 0) // oabc -> (o a b c)
    }),
    Num: num => ({
      term: [Num, num],
      size: String(num).length
    }),
    Str: str => ({
      term: [Str, str],
      size: 2 + str.length
    }),
    Map: kvs => {
      var isArray = false;
      for (var i = 0; i < kvs.length; ++i)
        if (kvs[i][0] === "length")
          isArray = true;
      if (isArray) {
        var vals = kvs.filter(([k,v]) => k !== "length").map(([k,v]) => v);
        return {
          term: [Arr, vals],
          size: 2 + vals.reduce((size,v) => size + v.size, 0) + Math.max(vals.length - 1, 0)
        }
      } else {
        return {
          term: [Map, kvs.map(([k,v]) => [k,v])],
          size: 2 + kvs.reduce((size,[k,v]) => size + k.length + 1 + v.size, 0) + Math.max(kvs.length - 1, 0)
        }
      }
    }
  });

  // AST, (AST -> Maybe AST) -> AST
  //   Performs a transforming pass
  const pass = (ast, fn) => {
    const F = ({term:t,size:s},S) => {
      const transformed = fn({term:t,size:s});
      if (transformed) {
        return F(transformed,S);
      } else {
        switch (t[0]) {
          case App: return {size:s, term:[App, F(t[1],S), t[2].map(x => F(x,S))]};
          case Lam: return {size:s, term:[Lam, t[1], F(t[2],S)]};
          case Var:
            const match = find(([name,val]) => name === t[1], S);
            return match ? match[1] : {size:s, term:[Var, t[1]]};
          case Ref: return {size:s, term:[Ref, t[1]]};
          case Let: return {size:s, term:[Let, t[1].map(([k,v]) => [k, F(v,S)]), F(t[2],S)]};
          case Fix: return {size:s, term:[Fix, t[1], F(t[2],S)]};
          case Pri: return {size:s, term:[Pri, t[1], t[2].map(x => F(x,S))]};
          case Num: return {size:s, term:[Num, t[1]]};
          case Str: return {size:s, term:[Str, t[1]]};
          case Map: return {size:s, term:[Map, t[1].map(([k,v]) => [k, F(v,S)])]};
          case Arr: return {size:s, term:[Arr, t[1].map(v => F(v,S))]};
          case Blk: return {size:s, term:[Blk, F(t[1],S)]};
          case Lif: return {size:s, term:[Lif, F(t[1],S)]};
          case Sub: return F({term:t[3].term,size:s},[[t[1],F(t[2],S)],S]);
        }
      };
    };
    return F(ast, null);
  };

  // Recovers bang-notation from code without it
  const monadicAst = pass(ast, ({term:t, size:s}) => {
    // (App f [(Lam [v] b)]) -> (Blk b[(Lif f)/v]) {iff v is linear}
    // TODO: this assumes variables starting with "_" are linear. This is
    // enforced on MoonJS, but isn't part of the specs. Implement properly.
    if (t[0] === App && t[2][0].term[0] === Lam && t[2][0].term[1][0][0] === "_") {
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
  const shortMonadicAst = pass(monadicAst, ({term:t, size:s}) => {
    // (Let [...] (Blk b)) -> (Let [...] b)
    // (Lam [...] (Blk b)) -> (Lam [...] b)
    // (Fix [...] (Blk b)) -> (Fix [...] b)
    if ((t[0] === Let || t[0] === Lam || t[0] === Fix) && t[2].term[0] === Blk) {
      return {
        term: [t[0], t[1], t[2].term[1]],
        size: s - 2
      };
    }
    // (Blk (Blk b)) -> (Blk b)
    if (t[0] === Blk && t[1].term[0] === Blk) {
      return t[1];
    };
  });

  // Compacts single-arg lets, lams and apps into multi-arg forms
  const finalAst = pass(shortMonadicAst, ({term:t, size:s}) => {
    // (Let [[k0 v0] ...] [Let [[k1 v1]] t]) -> (Let [[k0 v0] ... [k1 v1]] t)
    if (t[0] === Let && t[2].term[0] === Let && t[2].term[1].length === 1) {
      return {
        term: [Let, t[1].concat(t[2].term[1]), t[2].term[2]],
        size: s
      }
    }
    // (Let [[k0 v0] ...] [Let [[k1 v1]] t]) -> (Let [[k0 v0] ... [k1 v1]] t)
    if (t[0] === Let && t[2].term[0] === Let && t[2].term[1].length === 1) {
      return {
        term: [Let, t[1].concat(t[2].term[1]), t[2].term[2]],
        size: s
      }
    }
    // (Lam [v0 ...] [Lam [v1] t]) -> (Lam [v0 ... v1] t)
    if (t[0] === Lam && t[2].term[0] === Lam && t[2].term[1].length === 1) {
      return {
        term: [Lam, t[1].concat(t[2].term[1]), t[2].term[2]],
        size: s
      }
    }
    // (App [App f [x]] [... y]) -> (App f [x ... y])
    if (t[0] === App && t[1].term[0] === App && t[1].term[2].length === 1) {
      return {
        term: [App, t[1].term[1], t[1].term[2].concat(t[2])],
        size: s - 2 // ((a b) c) -> (a b c)
      }
    }
  });

  // Formats without indentation
  const stringifyFlat = ({term,size}) => {
    const go = ({term,size}) => {
      const joinMany = terms =>
        D.Many(
          terms.map((term,i) =>
            D.Many([
              D.Text(i > 0 ? " " : ""),
              go(term)])));
      switch (term[0]) {
        case App:
          return D.Many([
            D.Text("("),
            go(term[1]),
            D.Text(" "),
            joinMany(term[2]),
            D.Text(")")]);
        case Lam:
          return D.Many([
            D.Many(term[1].map(v =>
              D.Many([
                D.Var(v),
                D.Text(" "),
                D.Text("=>"),
                D.Text(" ")]))),
            go(term[2])
          ]);
        case Var:
          return D.Var(term[1]);
        case Ref:
          return D.Ref(term[1]);
        case Let:
          return D.Many([
            D.Many(term[1].map(([k,v]) => {
              if (k === "_" && v.term[0] === Lif) {
                return go({
                  term: [Seq, v.term[1]],
                  size: v.term[1].size + 2
                });
              } else {
                return D.Many([
                  D.Var(k),
                  D.Text(" "),
                  D.Text("="),
                  D.Text(" "),
                  go(v),
                  D.Text(" ")
                ]);
              }
            })),
            go(term[2])]);
        case Fix:
          return D.Many([
            term[1],
            D.Text("@"),
            D.Text(" "),
            go(term[2])]);
        case Pri:
          return D.Many([
            D.Text("("),
            D.Pri(term[1]),
            D.Text(" "),
            joinMany(term[2]),
            D.Text(")")]);
        case Num:
          return D.Num(String(term[1]));
        case Str:
          return D.Str(D.Many([
            D.Text(JSON.stringify(term[1]))]));
        case Map:
          return D.Many([
            D.Text("{"),
            D.Many(term[1].map(([k,v], i) =>
              D.Many([
                D.Text(i > 0 ? " " : ""),
                D.Key(k),
                D.Text(":"),
                go(v)]))),
            D.Text("}")]);
        case Arr:
          return D.Many([
            D.Text("["),
            joinMany(term[1]),
            D.Text("]")]);
        case Blk:
          return D.Many([
            D.Text("| "),
            go(term[1])]);
        case Lif:
          return D.Many([
            D.Text("<"),
            go(term[1])]);
        case Seq:
          return D.Many([
            go(term[1]),
            D.Text("> ")]);
      }
    };
    return go({term,size});
  };

  // Formats with indentation
  const stringify = ({term,size}) => {
    var tabs = 0;
    var prep = null;
    var prepSize = 0;
    var lines = [];
    const limit = D.maxCols || 80;
    const prepend = (str, size) => (prep = str, prepSize = size);
    const tab = () => ++tabs;
    const untab = () => --tabs;
    const push = str => (lines.push(D.Line(tabs, D.Many([prep, str]))), prep = null);
    const fits = size => tabs * 2 + prepSize + size <= limit;
    const go = ({term,size}) => {
      if (fits(size)) {
        push(stringifyFlat({term,size}));
      } else {
        switch (term[0]) {
          case App:
            if (fits(1 + term[1].size)) {
              push(D.Many([
                D.Text("("),
                stringifyFlat(term[1]),
                D.Text(" ")]));
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
          case Lam:
            push(
              D.Many(term[1].map(v =>
                D.Many([
                  D.Var(v),
                  D.Text(" "),
                  D.Text("=>"),
                  D.Text(" ")]))));
            tab();
            go(term[2]);
            untab();
            break;
          case Let:
            for (var i = 0; i < term[1].length; ++i) {
              const assignment = D.Many([D.Var(term[1][i][0]), D.Text(" "), D.Text("="), D.Text(" ")]);
              if (term[1][i][0] === "_" && term[1][i][1].term[0] === Lif) {
                go({
                  term: [Seq, term[1][i][1].term[1]],
                  size: term[1][i][1].term[1].size + 2
                });
              } else if (term[1][i][1].term[0] === Let) {
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
          case Var:
            push(D.Var(term[1]));
            break;
          case Ref:
            push(D.Ref(term[1]));
            break;
          case Fix:
            push(
              D.Many([
                term[1],
                D.Text("@"),
                D.Text(" ")]));
            tab();
            go(term[2]);
            untab();
            break;
          case Pri:
            var inlineFor = false;
            if (term[1] === "for") {
              var forLam = term[2][term[2].length - 1];
              if (forLam.term[0] === Lam) {
                var forArgs = term[2].slice(0, -1);
                var forSize = 4
                  + forArgs.reduce((s,arg) => s + arg.size + 1, 0)
                  + forLam.size - forLam.term[2].size;
                inlineFor = fits(forSize);
              }
            }
            var inlineIf = false;
            if (term[1] === "if") {
              inlineIf = fits(3 + term[2][0].size);
            }
            if (inlineFor) {
              push(D.Many([
                D.Text("("),
                D.Pri(term[1]),
                D.Text(" "),
                stringifyFlat(term[2][0]),
                D.Text(" "),
                stringifyFlat(term[2][1]),
                D.Text(" "),
                stringifyFlat(term[2][2]),
                D.Text(" "),
                D.Many(forLam.term[1].map(v =>
                  D.Many([
                    D.Var(v),
                    D.Text(" "),
                    D.Text("=>"),
                    D.Text(" ")])))]));
              tab();
              go(forLam.term[2]);
              untab();
              push(D.Text(")"));
            } else if (inlineIf) {
              push(D.Many([
                D.Text("("),
                D.Pri(term[1]),
                D.Text(" "),
                stringifyFlat(term[2][0])]));
              tab();
              term[2].slice(1).forEach(go);
              untab();
              push(D.Text(")"));
            } else {
              push(D.Many([
                D.Text("("),
                D.Pri(term[1])
              ]));
              tab();
              term[2].forEach(go);
              untab();
              push(D.Text(")"));
            }
            break;
          case Num:
            push(D.Num(String(term[1])));
            break;
          case Str:
            push(D.Str(JSON.stringify(term[1])));
            break;
          case Map:
            push(D.Text("{"));
            tab();
            for (var i = 0; i < term[1].length; ++i) {
              const key = D.Many([
                D.Key(term[1][i][0]),
                D.Text(":"),
                D.Text(" ")]);
              if (term[1][i][1].term[0] === Let) {
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
    }
    go({term,size});
    return D.Many(lines);
  };

  return D.indent
    ? stringify(finalAst)
    : stringifyFlat(finalAst);
};

const termToString = (term, opts = {}) => {
  const repeat = (n, str) => n === 0 ? "" : str + repeat(n - 1, str);
  const spaces = opts.indent === undefined ? 2 : opts.indent;
  return termFormatter({
    indent: spaces > 0,
    maxCols: opts.maxCols,
    Many: terms => terms.join(""),
    Text: text => text,
    Var: name => name,
    Ref: name => name,
    Pri: name => name,
    Key: name => name,
    Num: name => name,
    Str: name => name,
    Line: (tabs, line) => repeat(spaces * tabs, " ") + line + "\n"
  })(term);
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
  "for": 4,
  "len": 1,
  "and": 2,
  "or": 2,
  "xor": 2
};

module.exports = {
  termFromString,
  termToString,
  termFormatter
}
