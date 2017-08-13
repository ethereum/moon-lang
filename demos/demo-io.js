// Q: If Moon is a pure language, how can we do real-world things?
// A: *describe* side-effective computations purely!
// Here is how it works:

const Moon = require("./..");
const nodejsIO = require("./../src/moon-io-node.js");

(async () => {

const demoIO_a = await Moon.parseBook(`
  (io
    (ioAsk "prompt" "What is your name?" name.
      (ioAsk "print" (con "Hi, " name) x.
        (ioEnd "Bye"))))
`);

// `io`, `ioAsk` and `ioEnd` are part of the base libs. They arrange your
// program in a convenient tree form which can be used by the host language to
// actually execute the requested effects in order. Let's do it:

console.log(await Moon.performIO(demoIO_a, nodejsIO));

// Simple, no? Here, nodejsIO is an object explicitly specifying effects such
// as printing to the console. You could use your own objects to have arbitrary
// effects: HTTP requests, disk writes, threads, Ethereum calls, etc.
      
// Note that, since this interface is based on callbacks, it gets ugly fast.
// Check out demo-monadic-notation.js to learn how to improve the code above.

})();
