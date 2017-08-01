// Moon-lang's main API
//   = moon-core (parser, compiler, optimizer)
//   + moon-book (Ethereum / Swarm imports).

const core = require("./moon-core.js");
const book = require("./moon-book.js");

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
const parse = (code, opts = {}) => {
  const term = (opts||{}).unsafe ? core.termFromString(code) : core.termFromStringSafe(code)
  const jsValue = (opts||{}).fast ? core.termCompileFast(term) : core.termCompileFull(term);
  return eval(jsValue)();
}

// String [, Opts] -> Promise Native
//   Same as `parse`.
//   Imports missing variables from the Ethereum / Swarm network.
const parseth = (code, opts) =>
  parseWithAsync(book, code, opts);

// Importer, String [, Opts] -> Native
//   Same as `parse`.
//   Imports undefined variables with the specified importer.
const parseWith = (importer, code, opts) =>
  parse(doImport(importer, code), opts); 

// AsyncImporter, String [, Opts] -> Promise Native
//   Same as `parseWith`, but with asynchronous imports.
const parseWithAsync = (resolver, code, opts) =>
  doImportAsync(resolver, code).then(code => parse(code, opts));

// Native [, Opts] -> String
//   Stringifies a native value / function back to Moon.
const stringify = (value, opts) =>
  core.termToString(core.termDecompileFull(value), (opts||{}).spaces || 0);

// String [, Opts] -> String
//   Runs Moon code and returns the resulting Moon code.
//   Uses fast mode if possible.
//   Doesn't import undefined variables. 
const run = (code, opts) => {
  const term = (opts||{}).unsafe ? core.termFromString(code) : core.termFromStringSafe(code);
  return core.termToString(core.termReduce(term), (opts||{}).space);
}

// String [, Opts] -> String
//   Same as `run`.
//   Imports missing variables from the Ethereum / Swarm network.
const runeth = (code, opts) =>
  runWithAsync(book, code, (opts||{}));

// Importer, String [, Opts] -> String
//   Runs Moon code and returns the resulting Moon code.
//   Uses fast mode if possible.
//   Imports undefined variables with the specified importer.
const runWith = (importer, code, opts) =>
  run(doImport(importer, code), opts);

// Importer, String [, Opts] -> String
//   Same as `runWith`, but with asynchronous imports.
const runWithAsync = (importer, code, opts) =>
  doImportAsync(importer, code).then(code => run(code, opts));

// String-> String
//   Returns a packed representation of a term.
const pack = code =>
  "0x" + core.termToBytes(core.termFromString(code));

// String -> Promise String
const packeth = code =>
  packWithAsync(book, importer);

// Importer, String -> String
const packWith = (importer, code) =>
  pack(doImport(importer, code));

// Importer, String -> Promise String
const packWithAsync = (importer, code) =>
  doImportAsync(importer, code).then(code => pack(code));

// String [, Opts] -> String
//   Unpacks a packed representation of a term. 
const unpack = bytes =>
  core.termToString(core.termFromBytes(bytes.slice(2)));

// String -> String
//   Compiles Moon code to JavaScript code.
const compile = code =>
  core.termCompileFast(core.termFromString(code));

// String -> Promise String
const compileth = code =>
  packWithAsync(book, importer);

// Importer, String -> String
const compileWith = (importer, code) =>
  compile(doImport(importer, code));

// Importer, String -> Promise String
const compileWithAsync = (importer, code) =>
  doImportAsync(importer, code).then(code => compile(code));
  
// Either (Map String String) (String -> String) -> (String -> String)
const makeImporter = importer =>
  typeof importer === "object"
    ? (name => importer[name])
    : importer;

// Importer, String -> String
//   Adds imports to Moon code with the specified importer.
const doImport = (eitherImporter, code) => {
  let importer = makeImporter(eitherImporter);
  let imports = [];
  let imported = {};
  let result = "";
  let go = (name, code) => {
    if (!imported[name]) {
      imported[name] = true;
      if (code) {
        core.termFromStringWithDeps(code).deps.forEach(dep => go(dep, importer(dep)));
        result = result + "\n" + name + ": " + code;
        imported[name] = Promise.resolve(null);
      }
    }
  }
  go("main", code);
  return result + "\nmain";
}

// AsyncImporter, String -> Promise String
//   Same as `doImport`, but asynchronous.
const doImportAsync = (eitherImporter, code) => {
  let importer = makeImporter(eitherImporter);
  let imports = [];
  let imported = {};
  let result = "";
  let go = (name, code) => {
    if (!imported[name]) {
      if (code) {
        let codeDeps = core.termFromStringWithDeps(code).deps;
        let depsProm = Promise.all(codeDeps.map(dep => importer(dep).then(code => go(dep, code))));
        imported[name] = depsProm.then(() => result = result + "\n" + name + ": " + code);
      } else {
        imported[name] = Promise.resolve(null);
      }
    }
    return imported[name];
  }
  return go("main", code).then(() => result + "\nmain");
}

// String -> Promise String
//   Same as `doImport
const doImporteth = code =>
  doImportAsync(book, code);

module.exports = {
  book,
  parse,
  parseth,
  parseWith,
  parseWithAsync,
  stringify,
  run,
  runeth,
  runWith,
  runWithAsync,
  pack,
  packeth,
  packWith,
  packWithAsync,
  unpack,
  compile,
  compileth,
  compileWith,
  compileWithAsync,
  doImport,
  doImportAsync,
  doImporteth
};
