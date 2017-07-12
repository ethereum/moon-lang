// You probably know very well about JavaScript's callback-hell. What you might
// not know is that it is very related to the problem of expressing monadic
// computations (side-effects, etc.) on functional languages. FP langs solved
// the problem with the `do-notation`. JavaScript solved it with `async/await`.
// The `do-notation` is more powerful (works for any monad), but `async/await`
// has simpler syntax. Moon has the !<> syntax, which combines the best of both.
// 
// Here is how it works: you can prefix any Moon expression with a pipe, `|`.
// That marks the beginning of a "scope". Inside that scope, you're able to use
// the *normal* Moon syntax, except you can annotate any expression with either
// `<F` or `F>`. The first means "execute the function `F` and place the result
// of its callback here". The second means "execute the function `F`, ignore
// the result of its callback, and place the next expression here". And that's
// it! With that, you're able to use async/monadic values like normal values in
// any part of the language's syntax, for any Monad! Cool, isn't it?
//
// Note: this was 96.3% borrowed from Idris's (aka best PL) bang-notation.

const M = require("./../moon-lang/moon-lang");
const moonBase = require("./../moon-base/moon-base");




// Async HTTP requests

const getSites = M.parse(`isFamilyAround.
  request: url. callback. (callback (con "<div>" (con url "</div>"))) // mock async HTTP request

  // Notice how we use async values like normal vars
  | {
    "socialNetwork": (if isFamilyAround
      <(request "reddit.com")
      <(request "4chan.com"))
    "searcher": (if isFamilyAround
      <(request "google.com")
      <(request "bing.com"))
  }
`);

console.log(getSites(1)); // Output: {socialNetwork: '<div>reddit.com</div>', searcher:'<div>google.com</div>'}




// Async DB calls

const sumItems = M.parse(`item0. item1.
  db: {
    "foo": 1,
    "bar": 2,
    "tic": 3,
    "tac": 4
  }

  getFromDB: key. callback. (callback (get db key)) // mock async DB access

  // Notice how we sum async values like normal vars
  | (add <(getFromDB item0) <(getFromDB item1))
`);

console.log(sumItems("foo")("tic")); // output: 4




// List monad

const truthSentences = M.parseWith(moonBase, `
  subj: <(fork ["My dog", "Satoshi Nakamoto", "Donald Trump"])
  verb: <(fork ["ate", "invented", "fired"])
  noun: <(fork ["my homework", "Bitcoin", "the FBI director"])
  [(arrayJoin " " [subj verb noun])]
`);

console.log(truthSentences);




// IO monad

const runIO = require("./../moon-effs/runIO");

const cli = `
  (ioProgram |

    (ioPutLine "Who are you?")>
    name: <ioGetLine

    (ioPutLine (con name ", what are you doing?"))>
    feedback: <ioGetLine

    (ioPutLine "Cool.")>

    ioExit)`;

runIO(M.parseWith(moonBase, cli));

// The trick for monads is that `ioPutLine` is the requivalent of
// `ioPutLine >>=` on Haskell. Since there is no typeclass system,
// you need to define the binding operation explicitly. Moon hides
// that under the variable name.

// Also note how we need runIO to print/read from the console. Moon
// is pure and couldn't do that natively, so we must "interpret" the
// monadic computation from the outside.
