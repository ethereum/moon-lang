const M = require("./../moon-lang/moon-lang");

// Moon is aware of V8's tail-call optimization. As such, you can
// express recursive functions using the famous Lisp style.
const sum = M.parse(`
  tailSum: rec@ s. n.
    (if (eql n 0) s (rec (add s n) (sub n 1)))
  (tailSum 0)
`, {fast:true});

console.log(sum(10000000));

// I don't recommend doing it, though, because recursive functions don't have a
// normal form. As such, you can't optimize them with `#`, you can't fuse code
// that uses them, you can't stringify them and so on. Moon has a primitive for
// fixed-length loops. It is very similar to a normal "for", but pure. It
// receives 4 arguments: I, J, S, F. It then performs this computation:
//   var result = S;
//   for (var i = I; i < J; ++i)
//     result = F(i)(result);
//   return result;
// Example:

const betterSum = M.parse(`n.
  (for 0 (add n 1) 0 index. result.
    (add index result))
`, {fast:true});

console.log(betterSum(10000000));

// Despite looking "flat", `for` is powerful enough to express any recursive
// algorithm, as long as it has a bounded depth! For example, let's implement
// `2^n` by creating a binary tree of depth `n` and then counting the leaves.

const pow2 = M.parse(`n.
  tree: branch. leaf.
    (for 0 n leaf i. rec.
      (branch rec rec))
  (tree (add) 1)
`, {fast:true});

console.log(pow2(8));

// No need for recursion!
