// This is a complete overview of the Moon language.
// It is essentially a subset of JS with a simpler syntax.

const Moon = require("./../moon-lang");


// 1. Data types
//    - Moon uses [pure] JSON as the main type for data.
//    - Commas are always optional.

const data = Moon.parse(`{
  "number": 137.01
  "string": "hello world"
  "array": [1 2 3]
  "map": {"x": 1, "y": 2}
}`);

console.log(data.map.x); // output: 1




// 2. Primitive operations
//    - Thesis: this is roughly the minimum necessary to do everything JS can without losing performance.
//    - Also: check `demo-tail-calls-and-pure-fors.js` for more about the immutable for-loop primitive.

const ops = Moon.parse(`{
  "add": (add 3 2) // A + B
  "sub": (sub 3 2) // A - B
  "mul": (mul 3 2) // A * B
  "div": (div 3 2) // A / B
  "mod": (mod 3 2) // A % B
  "pow": (pow 3 2) // A ^ B
  "log": (log 3 2) // Math.log(A) / Math.log(B)
  "ltn": (ltn 3 2) // A < B ? 1 : 0
  "gtn": (gtn 3 2) // A > B ? 1 : 0
  "eql": (eql 3 2) // A === B ? 1 : 0
  "flr": (flr 3.14) // Math.floor(A)
  "sin": (sin 3.14) // Math.sin(A)
  "cos": (cos 3.14) // Math.cos(A)
  "tan": (tan 3.14) // Math.tan(A)
  "asn": (asn 0.5) // Math.asin(A)
  "acs": (acs 0.5) // Math.acos(A)
  "atn": (atn 0.5) // Math.atan(A)
  "con": (con "foo" "bar") // A + B
  "slc": (slc "abcdef" 1 3) // A.slice(B,c)
  "cmp": (cmp "foo" "bar") // A === B ? 1 : 0
  "nts": (nts 10) // String(A)
  "stn": (stn "10") // Number(A)
  "gen": (gen put.map.(put "a" 1 (put "b" 2 (put "c" 3 map)))) // generates a map programatically
  "get": (get {"x": 1, "y": 2} "x") // A[B]
  "for": (for 0 4 "a" index. result. (con result result)) // s = C; for (var i = A; i < B; ++i) s = D(i)(C); return s
  "ops": 27
}`);

console.log(ops); // output: (too long)




// 3. Variable assignments
//    - They're very lightweight expressions.
//    - The syntax is just `name: value expression`.
//    - May look confusing at first.

const vars0 = Moon.parse(`
  x: 100
  y: 200
  (add x y)
`);

console.log(vars0); // output: 300

const vars1 = Moon.parse(`{
  "name": first: "Trolland" last: "Dump" (con first last)
  "age": x:7 y:(z:10 (add z z)) (add x y)
}`);

console.log(vars1); // output: { name: 'TrollandDump', age: 27 }




// 4. Functions
//    - Also lightweight expressions.
//    - The syntax for `(x) => x` is just `x. x`.
//    - May also look confusing at first.

const triple = Moon.parse(`x. (mul x 3)`);

console.log(triple(7)); // output: 21

const sum = Moon.parse(`n.
  (for 0 n 0 i. result.
    (add i result))
`);

console.log(sum(10)); // ouput: 45

const join = Moon.parse(`strings.
  len: (get strings "length")
  (for 0 len "" i. result.
    str: (get strings (nts i))
    (con result str))
`);

console.log(join(["Many", "Strings", "Together"])); // output: "ManyStringsTogether"

const partial = Moon.parse(`a. b.
  [1, 2, 3, (mul a a), (mul b b)]
`);

// Moon can stringify partially applied functions!
console.log(Moon.stringify(partial(3))); // output: a. [1, 2, 3, 9, (mul a a)]




// 5. Monadic sugar
//    - Same functionality of async/await.
//    - Works for other monadic computations.
//    - Check `demo-monadic-notation.js` for more.

const asyncAwait = Moon.parse(`isFamilyAround.
  request: url. callback. (callback (con "<div>" (con url "</div>"))) // simulates HTTP request

  // <(value) allows us to use async values like normal vars!
  // Callbacks are placed where the pipe (i.e., |) is.
  | {
    "socialNetwork": (if isFamilyAround
      <(request "reddit.com")
      <(request "4chan.com"))
    "searcher": (if isFamilyAround
      <(request "google.com")
      <(request "bing.com"))
  }
`);

console.log(asyncAwait(1)); // output: {socialNetwork: '<div>reddit.com</div>', searcher:'<div>google.com</div>'}

const stateMonad = Moon.run(`
  inc: f. st. (f (add st 1) (add st 1))
  dec: f. st. (f (sub st 1) (sub st 1))
  get: f. st. (f st st)
  ret: x. st. x

  // The same idea can be used to simulate Haskell's monadic do-notation!
  // Here, (value)> is like <(value), but discarding the callback result.
  run:
    | x: <get
      inc>
      inc>
      inc>
      y: <get
      dec>
      dec>
      z: <get
      (ret [x y z])
  (run 0)
`);

console.log(stateMonad); // output: [0, 3, 1]




// 6. Recursion
//    - Recursive functions (ex: fibonacci, quicksort...).
//    - Infinite lazy data structures.
//    - Sadly, can't be optimized, stringified...
//    - Cool, but avoid it.

const allEvenNumbers = Moon.parse(`
  // Lazy infinite list with all even numbers
  (rec@ n. cons. (cons n (rec (add n 2))) 0)
`);

const nthElement = Moon.parse(`list. nth.
  head: list. (list h.t.h)
  tail: list. (list h.t.t)
  (head
    (for 0 nth list i. result.
      (tail result)))
`);

console.log(nthElement(allEvenNumbers)(4))




// 7. Optimization
//    - The magic `#` operator expands a term at compile-time.
//    - Church-encoded data structures give great asymptotics.
//    - If you don't need M.stringify, parse with M.parse(..., {fast:true}).

const fn = Moon.compile(`
  // A very slow way to add 2 numbers
  slowAdd: a. b. (for 0 a b i.r.(add 1 r))

  // A very slow way to mul 2 numbers
  slowMul: a. b. (for 0 b 0 i.r.(slowAdd a r))

  // Implements a^4 with two function calls
  pow2: a. (mul a a)
  pow4: a. (mul (pow2 a) (pow2 a))

  // Using the functions above with and without #
  x. {
    "slowPow4": (pow4 a),
    "fastPow4": #(pow4 a),
    "slowConst": (slowMul 100 100),
    "fastConst": #(slowMul 100 100)
  }
`);

console.log(require("js-beautify").js_beautify(fn));

// As can be seen on the output, the
// program above is compiled to:

// _x => ({
//    slowPow4: _pow4(_a),
//    fastPow4: ((_a * _a) * (_a * _a)),
//    slowConst: _slowMul(100)(100),
//    fastConst: 10000
// })

// Notice how # enabled us to push computation to compile time.
// On the `fastPow4` case, it allowed us to remove intermediate
// function calls. On the `fastConst` case, it allowed us to
// fully evaluate a constant at compile time. Clever use of
// # can optimize considerably certain parts of your code.
