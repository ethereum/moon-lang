const Moon = require("./..");

(async () => {

// When you write something like:

console.log(Moon.stringify(Moon.parse("x. [(add x x), foo]")(7)));

// Moon will treat undefined variables as symbols.

// You can, though, import missing symbols by using `Moon.parseBook` instead:

console.log((await Moon.parseBook("x. (listMul (listRange 1 x))"))(6));

// Moon looks for missing definitions on the local dir and globally (Ethereum).

// You can use custom importers. For that, you need either an object mapping
// names to definitions, or a function that receives a name and returns its
// definition. Moon will then use the importer to lookup for missing variables.

// Specify a importer with some dependencies
const importer = {
  sqr: `x. (mul x x)`,
  hyp: `a. b. (add (sqr a) (sqr b))`
};

// Parse with that importer
const result = Moon.parseWith(importer, `(hyp 3 4)`);

// Moon recursively imports missing variables (hyp, sqr).
console.log(result);

// You can also have async imports with Moon.parseWithAsync().

})();
