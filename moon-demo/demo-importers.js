// You can use custom importers. For that, youn eed either an object mapping
// names to definitions, or a function that receives a name and returns its
// definition. Moon will then use the importer to lookup for missing variables.
// It can also be async. 
// type Importer         = String -> String
// type AsyncImporter    = String -> Promise String
// Moon.doImport           :: Importer, String -> String
// Moon.doImportAsync      :: ImporterAsync, String -> Promise String
// Moon.parseWith          :: Importer, String -> Native
// Moon.parseWithAsync     :: AsyncImporter, String -> Promise Native

const Moon = require("./../moon-lang/moon-lang");

// Specify a importer with some dependencies
const importer = {
  sqr: `x. (mul x x)`,
  hyp: `a. b. (add (sqr a) (sqr b))`
};

// Parse with that importer
const result = Moon.parseWith(importer, `(hyp 3 4)`);

// Moon auto-imports the missing variables
console.log(result);
