## Moon

Moon is an minimal, JIT-compilable, portable and secure code-interchange format. It is:

- **Safe:** Moon isolates logic from side-effects, allowing you to securely run code from untrusted sources.

- **Fast:** when compiled to JS, it beats popular libs by [a large margin](benchmark/functional.js).

- **Compact:** Moon has a canonical binary format for very small bundles.

- **Decentralized:** Moon imports are hash-addressed, recursively resolved from [IPFS](https://ipfs.io/).

- **Small:** this entire implementation, for example, is a 7.5K JS file (gzipped).

Formally, Moon is just untyped λ-calculus extended with numbers, strings and maps.

## Usage / Examples

### Running code

To evaluate some code, simply use `Moon.run()`:

```javascript
const Moon = require("moon-lang")();

const program = `
  maximum = array =>
    (for 0 (get array "length") 0 index => result =>
      value = (get array (stn index))
      (if (gtn value result)
        value
        result))
  (maximum [1 7 6 9 5 2 8])
`;

console.log(Moon.run(program));
```

This is safe to do no matter the code contents, because Moon runs fully sandboxed.

### Compiling Moon to a native function

You can also JIT-compile it to fast native functions:

```javascript
const Moon = require("moon-lang")();

const factorial = Moon.parse(`n =>
  (for 1 (add n 1) 1 i => result =>
    (mul i result))
`);

console.log(factorial(4));
```

### Decompiling a native function to Moon

And the other way around:

```javascript
const Moon = require("moon-lang")();

const pair = Moon.parse("a => b => [a b]");

console.log(Moon.stringify(pair(1)));
```

### Loading code from IPFS

Moon can recursivelly import hash-addressed terms from IPFS:

```javascript
const Moon = require("moon-lang")(); 

(async () => {

  const sum = Moon.parse(await Moon.imports(`n =>
    // Imports array library from IPFS
    List = zb2rha9PW5Wnvhvz1n7pxXFZoMzeD3NxKYdZUHgxEsbhW8B4D
    reduce = (List "foldr")
    range = (List "range")

    (reduce (add) 0 (range 0 n))
  `));

  console.log(sum(5000000));

})();
```

### Saving code to IPFS

It can also easily publish those terms:

```javascript
const Moon = require("moon-lang")();

(async () => {

  const cid = await Moon.save("x => (mul x 2)");
  console.log(cid);

  const double = Moon.parse(await Moon.imports(cid));
  console.log(double(7));
  
})();
```

### Performing side-effects (IO)

Moon itself is pure, but it can perform side-effective computations by injecting the effects from the host language. To avoid the "callback-hell", you can use Moon's monadic notation:

```javascript
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX

askPowerLevel = loop@ lazy =>
  | power =< (do "prompt" "What is your power level? ")
    (if (gtn (stn power) 9000)
      | (do "print" "No, it is not.")>
        (loop 0)
      | (do "print" "Ah, that's cute!")>
        (do "stop"))

(askPowerLevel 0)
```

You can run the code above using [moon-tool](https://github.com/maiavictor/moon-tool):

```bash
moon runio zb2rhjR4sMEiMQ9m9bNCnavSUjEDzUvSrtAhuJStRWHcvNzb8
```

### Optimizing code

1. Use `#` to fully inline an expression.

2. Use `{fast:true}` option (faster, only tradeoff is it can't be decompiled).

3. Don't use recursive algorithms (map, reduce, etc.) directly on arrays; convert to churh-lists to enable fusion.

```javascript
(async () => {

// Notice the hash (#): it fully inlines an expression, making it 8x faster.
const dotCode = `# x0 => y0 => z0 => x1 => y1 => z1 =>
  Array = zb2rhYmsjmQuJivUtDRARcobLbApVQZE1CwqhfnbBxmYuGpXx
  a = [x0 y0 z0]
  b = [x1 y1 z1]
  (Array "sum" (Array "zipWith" (mul) a b))
`;

// Also, use {fast:true}
const dot = Moon.parse(await Moon.imports(dotCode), {fast:true});

// Call it a ton of times
var dots = 0;
for (var i = 0; i < 1000000; ++i) {
  dots += dot(1)(2)(3)(4)(5)(6);
}
console.log(dots);

// Check the difference on the output
console.log(Moon.compile(await Moon.imports(dotCode)));

})();
```

### Exporting Moon libs to npm

[See this repository.](https://github.com/MaiaVictor/moon-bignum)

## CLI

Check out [moon-tool](https://github.com/maiavictor/moon-tool).

## TODO

- Time limit option
