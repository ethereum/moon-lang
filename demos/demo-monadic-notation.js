// Since Moon is a functional language, many things end up being expressed with
// callbacks. This leads to the famous callback hell, which greatly decreases
// code quality. To solve that, Moon's default syntax comes with bang-notations,
// which are a generalization of async/await for any "callbacky" code (not just
// Promises). Here is how it works:

const Moon = require("./..");
const nodejsIO = require("./../src/moon-io-node.js");

(async () => {

// This is the same example from demo-io.js, but now flattened out.
const demoIO_a = await Moon.parseBook(`
  (io |
    name: <(ioAsk "prompt" "What is your name?")
    (ioAsk "print" (con "Hi, " name))>
    (ioEnd "Bye"))
`);

// What is going on here is that:
// 1. <(foo ...) calls a function and returns the result of its callback.
// 2. (foo ...)> calls a function and returns the following expression.
// 3. Calls are placed on the nearest lambda `f.x`, let `a:x y` or pipe `|`.

// Let's try it:
console.log(await Moon.performIO(demoIO_a, nodejsIO));

// Confusing at first, but extremelly useful when it clicks!

// Note this syntax isn't restricted to IO, it can be used for arbitrary
// monadic DSLs. Here, for example, is it applied to non-deterministic dialect;
// i.e., computations where terms can have many values simultaneously:

const sentences = await Moon.parseBook(`
  subj: <(fork ["My dog", "Satoshi Nakamoto", "Donald Trump"])
  verb: <(fork ["ate", "invented", "fired"])
  noun: <(fork ["my homework", "Bitcoin", "the FBI director"])
  [(arrayJoin " " [subj verb noun])]
`);

console.log(sentences);

// Here, `subj`, `verb` and `noun` are variables with 3 simultaneous values "at
// the same time". Thus, when concatenating them, you get all the possible
// permutations.

})();
