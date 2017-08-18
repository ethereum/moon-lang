// Moon's high-level API.

module.exports = ipfsUrl => {
  const ipfs = require("nano-ipfs-store").at(ipfsUrl || "https://ipfs.infura.io:5001");
  const memo = require("nano-persistent-memoizer");
  const util = require("./moon-util.js");
  const comp = require("./moon-jit-compiler.js");
  const hexs = require("./moon-pack.js");
  const synt = require("./moon-syntax.js");

  // type Native = <a native JavaScript value>
  
  // type Opts = {
  //   maxCols: Number,  -- max cols when formatting terms
  //   indent: Number,   -- spaces when formatting terms (0 = no indent)
  //   fast: Bool,       -- builds a native term that runs faster but can't be stringified
  //   opsLimit: Number, -- max limit of operations that compiled functions can perform (UNIMPLEMENTED - will be soon)
  // }

  // String [, Opts] -> Native
  //   Parses Moon code to a native value / function.
  const parse = (code, opts = {}) => {
    const term = synt.termFromString(code);
    const jsValue = (opts||{}).fast ? comp.termCompileFast(term) : comp.termCompileFull(term);
    return eval(jsValue)();
  }

  // Native [, Opts] -> String
  //   Stringifies a native value / function back to Moon.
  const stringify = (value, opts = {}) =>
    synt.termToString(
      comp.termDecompileFull(value),
      opts.indent === undefined ? 2 : opts.indent,
      opts.maxCols || 80);

  // String [, Opts] -> String
  //   Stringifies Moon code without normalizing it.
  const format = (code, opts = {}) =>
    synt.termToString(
      synt.termFromString(code),
      opts.indent === undefined ? 2 : opts.indent,
      opts.maxCols || 80);

  // String [, Opts] -> String
  //   Runs Moon code and returns the resulting Moon code.
  //   Uses fast mode if possible.
  const run = (code, opts) => {
    const term = synt.termFromString(code);
    return synt.termToString(comp.termReduce(term));
  }

  // String-> String
  //   Returns the canonical binary representation of a term.
  const pack = code =>
    hexs.termToHex(synt.termFromString(code));

  // String [, Opts] -> String
  //   Unpacks the canonical binary representation of a term. 
  const unpack = hex =>
    synt.termToString(hexs.termFromHex(hex));

  // String -> String
  //   Compiles Moon code to JavaScript code.
  const compile = code =>
    comp.termCompileFast(synt.termFromString(code));

  // CID -> Promise String
  //   Stores a term on IPFS.
  const load = memo("moon-base").async(cid =>
    ipfs.get(cid)
      .then(bytes => unpack(util.bytesToHex(bytes)))
      .catch(() => Promise.reject("Couldn't resolve " + cid + ".")));

  // String -> Promise CID 
  //   Gets a term from IPFS.
  const save = code =>
    ipfs.add(util.hexToBytes(pack(code)));

  // String -> Promise CID
  //   Returns the CID of a term (without storing it).
  const cid = code =>
    ipfs.cid(util.hexToBytes(pack(code)));

  // Term -> [String]
  const termRefs = term => {
    var fvs = {};
    term({
      App: (f, x) => {},
      Lam: (name, body) => {},
      Var: (name) => {},
      Ref: (name) => fvs[name] = 1,
      Let: (name, term, body) => {},
      Fix: (name, term) => {},
      Pri: (name, args) => {},
      Num: (num) => {},
      Str: (num) => {},
      Map: (kvs) => {}
    });
    return Object.keys(fvs);
  };

  // (String -> Promise String), String -> Promise String
  //   Recursivelly imports missing variables with custom importer.
  const importsWith = (eitherImporter, code) => {
    const makeImporter = importer =>
      typeof importer === "object"
        ? (name => importer[name])
        : importer;
    let importer = makeImporter(eitherImporter);
    let imports = [];
    let imported = {};
    let result = "";
    let go = (name, code) => {
      if (imported[name]) {
        return imported[name];
      }
      if (code) {
        let codeRefs = termRefs(synt.termFromString(code));
        let refsProm = Promise
          .all(codeRefs.map(ref => importer(ref)
            .then(code => go(ref, code))));
        return imported[name] = refsProm
          .then(() => result = result + "\n" + name + " = " + code)
      } else {
        return Promise.resolve(null);
      }
    }
    return go("main", code).then(() => result + "\nmain");
  };

  // String -> Promise String
  //   Recursivelly imports missing variables from IPFS.
  const imports = code =>
    importsWith(load, code);

  // Native, Methods -> Promise result
  const performIO = (program, methods) => {
    return program(method => args => cont => {
      if (!methods[method]) {
        throw "Unknown IO method: " + method;
      } else {
        return methods[method](args).then(cont);
      }
    })(result => Promise.resolve(result));
  };

  return {
    parse,
    stringify,
    format,
    run,
    pack,
    unpack,
    compile,
    save,
    load,
    cid,
    importsWith,
    imports,
    performIO
  };
}
