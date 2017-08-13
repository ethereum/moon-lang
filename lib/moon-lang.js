"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Moon-lang's main API
//   = moon-core (parser, compiler, optimizer)
//   + moon-book (Ethereum / Swarm imports).

var core = require("./moon-core.js");
var book = require("./moon-book.js");

// type Importer       = Either (Map String String) (String -> String)
// type AsyncImporter  = String -> Promise String
// type Native         = <a native Function, String, Number or Object>
// type Opts           = {
//   fast: Bool,       -- builds a faster native term, but that can't be stringified
//   unsafe: Bool,     -- allows free variables to be compiled
//   spaces: String,   -- amount of indentation spaces when stringifying a term
//   opsLimit: Number, -- max limit of operations that compiled functions can perform (UNIMPLEMENTED - will be soon)
//   ethUrl: String,   -- URL of the Ethereum RPC API (UNIMPLEMENTED - only testnet for now!)
//   swarmUrl: String, -- URL of the Swarm RPC API (UNIMPLEMENTED - only swarm-gateways for now!)
// }

// String [, Opts] -> Native
//   Parses Moon code to a native value / function.
//   Doesn't import undefined variables.
var parse = function parse(code) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var term = (opts || {}).unsafe ? core.termFromString(code) : core.termFromString(code);
  var jsValue = (opts || {}).fast ? core.termCompileFast(term) : core.termCompileFull(term);
  return eval(jsValue)();
};

// String [, Opts] -> Promise Native
//   Same as `parse`.
//   Imports missing variables from the Ethereum / Swarm network.
var parseBook = function parseBook(code, opts) {
  return parseWithAsync(book, code, opts);
};

// Importer, String [, Opts] -> Native
//   Same as `parse`.
//   Imports undefined variables with the specified importer.
var parseWith = function parseWith(importer, code, opts) {
  return parse(doImport(importer, code), opts);
};

// AsyncImporter, String [, Opts] -> Promise Native
//   Same as `parseWith`, but with asynchronous imports.
var parseWithAsync = function parseWithAsync(resolver, code, opts) {
  return doImportAsync(resolver, code).then(function (code) {
    return parse(code, opts);
  });
};

// Native [, Opts] -> String
//   Stringifies a native value / function back to Moon.
var stringify = function stringify(value, opts) {
  return core.termToString(core.termDecompileFull(value), (opts || {}).spaces || 0);
};

// String [, Opts] -> String
//   Runs Moon code and returns the resulting Moon code.
//   Uses fast mode if possible.
//   Doesn't import undefined variables. 
var run = function run(code, opts) {
  var term = core.termFromString(code);
  return core.termToString(core.termReduce(term), (opts || {}).space);
};

// String [, Opts] -> String
//   Same as `run`.
//   Imports missing variables from the Ethereum / Swarm network.
var runBook = function runBook(code, opts) {
  return runWithAsync(book, code, opts || {});
};

// Importer, String [, Opts] -> String
//   Runs Moon code and returns the resulting Moon code.
//   Uses fast mode if possible.
//   Imports undefined variables with the specified importer.
var runWith = function runWith(importer, code, opts) {
  return run(doImport(importer, code), opts);
};

// Importer, String [, Opts] -> String
//   Same as `runWith`, but with asynchronous imports.
var runWithAsync = function runWithAsync(importer, code, opts) {
  return doImportAsync(importer, code).then(function (code) {
    return run(code, opts);
  });
};

// String-> String
//   Returns a packed representation of a term.
var pack = function pack(code) {
  return "0x" + core.termToBytes(core.termFromString(code));
};

// String -> Promise String
var packBook = function packBook(code) {
  return packWithAsync(book, importer);
};

// Importer, String -> String
var packWith = function packWith(importer, code) {
  return pack(doImport(importer, code));
};

// Importer, String -> Promise String
var packWithAsync = function packWithAsync(importer, code) {
  return doImportAsync(importer, code).then(function (code) {
    return pack(code);
  });
};

// String [, Opts] -> String
//   Unpacks a packed representation of a term. 
var unpack = function unpack(bytes) {
  return core.termToString(core.termFromBytes(bytes.slice(2)));
};

// String -> String
//   Compiles Moon code to JavaScript code.
var compile = function compile(code) {
  return core.termCompileFast(core.termFromString(code));
};

// String -> Promise String
var compileBook = function compileBook(code) {
  return packWithAsync(book, importer);
};

// Importer, String -> String
var compileWith = function compileWith(importer, code) {
  return compile(doImport(importer, code));
};

// Importer, String -> Promise String
var compileWithAsync = function compileWithAsync(importer, code) {
  return doImportAsync(importer, code).then(function (code) {
    return compile(code);
  });
};

// Either (Map String String) (String -> String) -> (String -> String)
var makeImporter = function makeImporter(importer) {
  return (typeof importer === "undefined" ? "undefined" : _typeof(importer)) === "object" ? function (name) {
    return importer[name];
  } : importer;
};

// Term -> [String]
var termRefs = function termRefs(term) {
  var fvs = {};
  term({
    App: function App(f, x) {},
    Lam: function Lam(name, body) {},
    Var: function Var(name) {},
    Ref: function Ref(name) {
      return fvs[name] = 1;
    },
    Let: function Let(name, term, body) {},
    Fix: function Fix(name, term) {},
    Pri: function Pri(name, args) {},
    Num: function Num(num) {},
    Str: function Str(num) {},
    Map: function Map(kvs) {}
  });
  return Object.keys(fvs);
};

// Importer, String -> String
//   Adds imports to Moon code with the specified importer.
var doImport = function doImport(eitherImporter, code) {
  var importer = makeImporter(eitherImporter);
  var imports = [];
  var imported = {};
  var result = "";
  var go = function go(name, code) {
    if (!imported[name]) {
      imported[name] = true;
      if (code) {
        termRefs(core.termFromString(code)).forEach(function (ref) {
          return go(ref, importer(ref));
        });
        result = result + "\n" + name + ": " + code;
        imported[name] = Promise.resolve(null);
      }
    }
  };
  go("main", code);
  return result + "\nmain";
};

// AsyncImporter, String -> Promise String
//   Same as `doImport`, but asynchronous.
var doImportAsync = function doImportAsync(eitherImporter, code) {
  var importer = makeImporter(eitherImporter);
  var imports = [];
  var imported = {};
  var result = "";
  var go = function go(name, code) {
    if (!imported[name]) {
      if (code) {
        var codeRefs = termRefs(core.termFromString(code));
        var refsProm = Promise.all(codeRefs.map(function (ref) {
          return importer(ref).then(function (code) {
            return go(ref, code);
          });
        }));
        imported[name] = refsProm.then(function () {
          return result = result + "\n" + name + ": " + code;
        });
      } else {
        imported[name] = Promise.resolve(null);
      }
    }
    return imported[name];
  };
  return go("main", code).then(function () {
    return result + "\nmain";
  });
};

// String -> Promise String
//   Same as `doImport
var doImportBook = function doImportBook(code) {
  return doImportAsync(book, code);
};

// IOProgram a -> IOMethod -> Promise a
var performIO = function performIO(program, methods) {
  return program(function (method) {
    return function (args) {
      return function (cont) {
        if (!methods[method]) {
          throw "Unknown IO method: " + method;
        } else {
          return methods[method](args).then(cont);
        }
      };
    };
  })(function (result) {
    return Promise.resolve(result);
  });
};

module.exports = {
  book: book,
  parse: parse,
  parseBook: parseBook,
  parseWith: parseWith,
  parseWithAsync: parseWithAsync,
  stringify: stringify,
  run: run,
  runBook: runBook,
  runWith: runWith,
  runWithAsync: runWithAsync,
  pack: pack,
  packBook: packBook,
  packWith: packWith,
  packWithAsync: packWithAsync,
  unpack: unpack,
  compile: compile,
  compileBook: compileBook,
  compileWith: compileWith,
  compileWithAsync: compileWithAsync,
  doImport: doImport,
  doImportAsync: doImportAsync,
  doImportBook: doImportBook,
  performIO: performIO
};