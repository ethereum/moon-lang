const M = require(".");
const testLib = require("./moon-test-lib");
const testLibAsync = name => Promise.resolve(testLib[name]);
const assert = require("assert");
const assertAsync = async x => assert(await x());

// Tests primitive operations on the core language (fast mode)
assert(M.run(`(add 3 2)`) === `5`);
assert(M.run(`(sub 3 2)`) === `1`);
assert(M.run(`(mul 3 2)`) === `6`);
assert(M.run(`(div 3 2)`) === `1.5`);
assert(M.run(`(mod 3 2)`) === `1`);
assert(M.run(`(pow 3 2)`) === `9`);
assert(M.run(`(log 2 8)`) === `3`);
assert(M.run(`(ltn 1 2)`) === `1`);
assert(M.run(`(gtn 1 2)`) === `0`);
assert(M.run(`(eql 1 1)`) === `1`);
assert(M.run(`(eql 1 2)`) === `0`);
assert(M.run(`s:(sin 2) c:(cos 2) (add (mul s s) (mul c c))`) === `1`);
assert(M.run(`(con "foo" "bar")`) === `"foobar"`);
assert(M.run(`(slc "foobar" 2 5)`) === `"oba"`);
assert(M.run(`(cmp "foo" "foo")`) === `1`);
assert(M.run(`(cmp "foo" "bar")`) === `0`);
assert(M.run(`(nts 3)`) === `"3"`);
assert(M.run(`(stn "3")`) === `3`);
assert(M.run(`(gen a.b.(a "x" 1 (a "y" 2 b)))`) === `{"y":2,"x":1}`);
assert(M.run(`(get {"x":[1,2],"y":2} "x")`) === `[1,2]`);
assert(M.run(`(for 0 10 0 (add))`) === `45`);
assert(M.run(`this:x.c.(c x) | [<(this 1), (this 7)> 2, <(this 3)]`) === `[1,2,3]`); // identity monad
assert(M.run(`l:r@t.(t 1 r) (l a.b.b a.b.b a.b.b a.b.a)`) === `1`); // infinite list
try {
  assert(M.run(`s:r@n.x.(if (eql n 0) x (r (sub n 1) (add n x))) (s 100000 0)`) === `5000050000`);
} catch (e) {
  console.log("Warning: no tail-call optimization. Are you using an old version of Node?");
}

// Tests primitive operations on the core language (full mode)
assert(M.run(`a.(add 3 2)`) === `a.5`);
assert(M.run(`a.(sub 3 2)`) === `a.1`);
assert(M.run(`a.(mul 3 2)`) === `a.6`);
assert(M.run(`a.(div 3 2)`) === `a.1.5`);
assert(M.run(`a.(mod 3 2)`) === `a.1`);
assert(M.run(`a.(pow 3 2)`) === `a.9`);
assert(M.run(`a.(log 2 8)`) === `a.3`);
assert(M.run(`a.(ltn 1 2)`) === `a.1`);
assert(M.run(`a.(gtn 1 2)`) === `a.0`);
assert(M.run(`a.(eql 1 1)`) === `a.1`);
assert(M.run(`a.(eql 1 2)`) === `a.0`);
assert(M.run(`a.(s:(sin 2) c:(cos 2) (add (mul s s) (mul c c)))`) === `a.1`);
assert(M.run(`a.(con "foo" "bar")`) === `a."foobar"`);
assert(M.run(`a.(slc "foobar" 2 5)`) === `a."oba"`);
assert(M.run(`a.(cmp "foo" "foo")`) === `a.1`);
assert(M.run(`a.(cmp "foo" "bar")`) === `a.0`);
assert(M.run(`a.(nts 3)`) === `a."3"`);
assert(M.run(`a.(stn "3")`) === `a.3`);
assert(M.run(`a.(gen a.b.(a "x" 1 (a "y" 2 b)))`) === `a.{"y":2,"x":1}`);
assert(M.run(`a.(get {"x":[1,2],"y":2} "x")`) === `a.[1,2]`);
assert(M.run(`a.(for 0 10 0 (add))`) === `a.45`);
assert(M.run(`a.(this:x.c.(c x) | [<(this 1), (this 7)> 2, <(this 3)])`) === `a.[1,2,3]`);
assert(M.run(`l:r@t.(t 1 r) (l a.b.b a.b.b a.b.b a.b.a)`) === `1`);
assert(M.run(`(f.x.(f (f x)) f.x.(f (f x)))`) === `a.b.(a (a (a (a b))))`); // church number exponentiation
try {
  assert(M.run(`t.(s:r@n.x.(if (eql n 0) x (r (sub n 1) (add n x))) (s 100000 0))`) === `a.5000050000`);
} catch (e) {
  console.log("Warning: no tail-call optimization. Are you using an old version of Node?");
}

// Testing the main API
assert(M.runWith(testLib, `(arrayMap (mul 2) [1,2,3])`) === `[2,4,6]`);
assertAsync(async () => await M.runWithAsync(testLibAsync, `(arrayMap (mul 2) [1,2,3])`) === `[2,4,6]`)
assert((() => {
  const sum = M.parseWith(testLib, `n.(listSum (listRange 0 n))`);
  return sum(10) === 45;
})());
assertAsync(async () => {
  const sum = await M.parseWithAsync(testLibAsync, `n.(listSum (listRange 0 n))`);
  return sum(10) === 45;
});

// tests if pack(code) === pack(unpack(pack(code)))
[ 'a.a',
  'a.b.a',
  'x.y.z.(x z (y z))',
  '(f.x.(f (x x)) f.x.(f (x x)))',
  'f.x.(f (f x))',
  'a.b.c.d.e.(b f.g.h.(h f g) f.e (c f.g.h.i.(d (a h f) (i g)) f.g.e))"',
  't.(t 1 2 "foo" [1,2,3] {"bar": [1,$2,3]})',
  '(f.x.(f (f (f (f (f (f (f (f (f (f x)))))))))) f.x.(f (f (f (f (f (f (f (f (f (f x)))))))))))',
  'a.b.c.d.(for a b d e. (c (sub (add a b) (add e 1))))',
  'a. b. c. (gen d. e. (d "a" (sub b a) (for a b e f. (d (nts (sub (add a b) (add f 1))) (c (sub (add a b) (add f 1)))))))',
  'a. b. (gen c. d. (c "a" (sub (add (get a "a") (get b "a")) 0) (for 0 (add (get a "a") (get b "a")) d e. (c (nts (sub (add 0 (add (get a "a") (get b "a"))) (add e 1))) (if (ltn (sub (add 0 (add (get a "a") (get b "a"))) (add e 1)) (get a "a")) (get a (nts (sub (add 0 (add (get a "a") (get b "a"))) (add e 1)))) (get b (nts (sub (sub (add 0 (add (get a "a") (get b "a"))) (add e 1)) (get a "a")))))))))',
  '"abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"',
  '| a: <(a.b.(b a) 1) b: <(a.b.(b a) 2) (add a b)'
].forEach(code => {
  var packed = M.pack(code);
  var unpacked = M.unpack(packed);
  var repacked = M.pack(unpacked);
  assert(packed === repacked);
});

console.log("All tests pass.");
