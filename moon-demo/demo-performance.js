// Since Moon is pure, it can perform some optimizations that JS engines can't.
// As such, it is able to help them and make certain kinds of code very fast;
// often 5-100x faster than "identical" code written with libraries such as
// Ramda, Underscore, Lodash and Immutable.js. That is specially true for
// highly functional styles. In some cases, though - huge arrays, many in-place
// mutations, etc. - Moon's purity makes it much worse. As any tool, when used
// correctly it can be a great addition to your codebase.
// 
// There are 3 specific tricks that can make Moon fast:
// 
// 1. The `#` operator, which fully normalizes the term after it. This is very
//    useful for inner loops, vectorial code, etc., since it leaves only the
//    bare computation, removing layers that JIT engines often can't. It is
//    also useful to perform deforesting (fusion) when using highly functional
//    styles (many maps/filters/reduces chained together).
// 
// 2. Support for church-encoded data structures on the base-lib, which often
//    provide asymptotical advantages over algorithms using usual structures.
//    Note this could be implemented in JS itself!
//
// 3. Use of `M.parseFast(code)`, which creates functions that are faster, but
//    that can't be stringified with `M.stringify(func)`. 
// 
// Run this file to perform a few micro benchmarks. On my machine, Moon outperforms
// all other libs by 5-100x for most tests other than reverse.
//
// ## N-dimensional dot-product
// 
//  Benchmarking Lodash
//  - Result: 26999986500007800000
//  - Time: 3.614s
//
//  Benchmarking Underscore
//  - Result: 26999986500007800000
//  - Time: 4.416s
//
//  Benchmarking Ramda
//  - Result: 26999986500007800000
//  - Time: 1.087s
//
//  Benchmarking Moon
//  - Result: 26999986500007800000
//  - Time: 0.147s
//
//
//## Sum huge matrix
//
//  Benchmarking Underscore
//  - Result: 511360000
//  - Time: 9.746s
//
//  Benchmarking Lodash
//  - Result: 511360000
//  - Time: 4.319s
//
//  Benchmarking Ramda
//  - Result: 511360000
//  - Time: 1.708s
//
//  Benchmarking Moon
//  - Result: 511360000
//  - Time: 0.061s
//
//
//## Many maps
//
//  Benchmarking Underscore
//  - Result: 125127750000
//  - Time: 3.411s
//
//  Benchmarking Lodash
//  - Result: 125127750000
//  - Time: 3.413s
//
//  Benchmarking Ramda
//  - Result: 125127750000
//  - Time: 1.654s
//
//  Benchmarking Moon
//  - Result: 125127750000
//  - Time: 0.074s
//
//
//## Many reverses
//
//  Benchmarking Lodash
//  - Result: 4498500
//  - Time: 0.09s
//
//  Benchmarking Ramda
//  - Result: 4498500
//  - Time: 0.022s
//
//  Benchmarking Moon
//  - Result: 4498500
//  - Time: 2.707s
//
//
//## Fibonacci
//
//  Benchmarking Moon
//  - Result: 102334155
//  - Time: 1.328s
//
//  Benchmarking JavaScript
//  - Result: 102334155
//  - Time: 1.284s
//   
// Note those benchmarks are very crude and unscientific. Also note that most
// of the slow algos could be manually optimized and be much faster! In any
// case, better benchmarks would be needed to draw conclusions.

(async () => {
const R = require("ramda");
const L = require("lodash");
const U = require("underscore");
const M = require("moon-lang");
const testLib = require("moon-lang/moon-test-lib");

function benchmark(name,fn) {
  console.log("  Benchmarking " + name);
  const startTime = Date.now();
  console.log("  - Result: " + fn());
  console.log("  - Time: " + (Date.now() - startTime) / 1000 + "s\n");
}




// ## N-dimensional dot-product
// A very elegant way to define N-dimensional dot products is by using a
// combination of `sum` and `zipWith`. Below, I implement it that way in
// different libs, and then compute the dot product of a ton of 3D vectors.
// Moon is fast here because of the `#` removing all abstraction layers from
// the dot-product. It is very useful for that kind of number-crunching code.

console.log("## N-dimensional dot-product\n");

benchmark("Lodash", () => {
  const dots = limit => { 
    const dot = (a,b) => L.sum(L.zipWith(a, b, (a,b) => a* b));
    var total = 0;
    for (var i = 0; i < limit; ++i)
      total += dot([i,i,i], [i,i,i]);
    return total;
  };
  return dots(3000000);
});

benchmark("Underscore", () => {
  const dots = limit => { 
    const dot = (a,b) =>
      U.reduce(U.map(U.zip(a, b), ([a,b]) => a * b), (a,b) => a + b);
    var total = 0;
    for (var i = 0; i < limit; ++i)
      total += dot([i,i,i], [i,i,i]);
    return total;
  };
  return dots(3000000);
});

benchmark("Ramda", () => {
  const dots = limit => {
    const dot = (a, b) => R.sum(R.zipWith((a,b) => a*b, a, b));
    var total = 0;
    for (var i = 0; i < limit; ++i)
      total += dot([i,i,i], [i,i,i]);
    return total;
  };
  return dots(3000000);
});

benchmark("Moon", () => {
  const dots = M.parseWith(testLib, `limit.
    dot: a. b. (arraySum (arrayZipWith (mul) a b))
    total: 0
    (for 0 limit total #i.total.
      (add total (dot [i i i] [i i i])))
  `, {fast: true});
  return dots(3000000);
});




//// ## Huge matrix sum
//// Here, I just create a huge square matrix and sum it by flattening,
//// with reduce and concat. Moon is fast here because church-encoded 
//// lists have O(1) concatenation.

console.log("\n## Sum huge matrix\n")

benchmark("Underscore", () => {
  const sumMatrix = width => {
    const buildMatrix = (width) => {
      const buildRow = i =>
        U.map(U.range(0, width), x => x + i);
      return U.map(U.range(0, width), buildRow);
    }
    const sumMatrix = (mat) => {
      return U.reduce(U.reduce(mat, (a,b)=>L.flatten([a,b]), []), (a,b) => a+b, 0);
    }
    return sumMatrix(buildMatrix(width));
  }
  return sumMatrix(800);
});

benchmark("Lodash", () => {
  const sumMatrix = width => {
    const buildMatrix = (width) => {
      const buildRow = i =>
        L.map(L.range(0, width), x => x + i);
      return L.map(L.range(0, width), buildRow);
    }
    const sumMatrix = (mat) => {
      return L.sum(L.reduce(mat, (a,b)=>L.concat(a,b), []));
    }
    return sumMatrix(buildMatrix(width));
  }
  return sumMatrix(800);
});

benchmark("Ramda", () => {
  const sumMatrix = width => {
    const buildMatrix = (width) => {
      const buildRow = i =>
        R.map(x => x + i, R.range(0, width));
      return R.map(buildRow, R.range(0, width));
    }
    const sumMatrix = (mat) =>
      R.sum(R.reduce(R.concat, [], mat));
    return sumMatrix(buildMatrix(width));
  }
  return sumMatrix(800);
});

benchmark("Moon", () => {
  const sumMatrix = M.parseWith(testLib, `width.
    buildMatrix: width.
      buildRow: i.
        (listMap (add i) (listRange 0 width))
      (listMap buildRow (listRange 0 width))
    sumMatrix: mat.
      (listSum (listFoldr listConcat listNil mat))
    (sumMatrix (buildMatrix width))
  `, {fast:true});
  return sumMatrix(800);
});




// ## Map and sum
// Applies `map` many times to a huge list. Moon is fast here because of
// fusion: all maps are applied in a single pass, no intermediate data
// structure is allocated. This optimization happens whenever you chain a lot
// of maps, reduces, filters etc. with church-encoded lists. That is why it is
// a great idea to, whenever doing those things with arrays, to first convert
// them to lists, then apply list-algorithms, then convert to arrays back. Ex:
// (arrayToList (map F (map G (map H (listToArray arr)))))

console.log("\n## Many maps\n");

benchmark("Underscore", () => {
  const f = size => {
    let list = U.range(0, size);
    for (var i = 0; i < 256; ++i) {
      list = U.map(list, x => x + 1);
    }
    return U.reduce(list, (a,b) => a + b, 0);
  };
  return f(500000);
});


benchmark("Lodash", () => {
  const f = size => {
    let list = L.range(0, size);
    for (var i = 0; i < 256; ++i) {
      list = L.map(list, x => x + 1);
    }
    return L.sum(list);
  };
  return f(500000);
});


benchmark("Ramda", () => {
  const f = size => {
    let list = R.range(0, size);
    for (var i = 0; i < 256; ++i) {
      list = R.map(x => x + 1, list);
    }
    return R.sum(list);
  };
  return f(500000);
});

benchmark("Moon", () => {
  const f = M.parseWith(testLib, `size.
    list: (listRange 0 size)
    #(listSum
      (for 0 256 list i.list.
        (listMap (add 1) list)))
  `, {fast:true});
  return f(500000);
});



// ## Many reverses
// Applies reverse a ton of times.
// This is one of those cases where Moon suffers: there is no fast reverse for
// church-lists (afaik), and allocating huge arrays on Moon is currently slow.
// I'm currently wondering whether a `set` primitive could fix that, but for
// that primitive to work, Moon would need to perform some kind of linearity
// analysis to determine when it is safe to mutate a map in-place. That would
// probably make this (and similar things) faster than the JS libs. For now, I
// wonder if there any implementation of reverse on church-lists that isn't
// awful. Perhaps it would be faster with non-strict evaluators?

console.log("\n## Many reverses\n");

benchmark("Lodash", () => {
  const f = size => {
    let list = L.range(0, size);
    for (var i = 0; i < size; ++i) {
      list = L.reverse(L.clone(list)); // Lodash's reverse mutates the array!
    }
    return L.sum(list);
  };
  return f(3000);
});


benchmark("Ramda", () => {
  const f = size => {
    let list = R.range(0, size);
    for (var i = 0; i < size; ++i) {
      list = R.reverse(list);
    }
    return R.sum(list);
  };
  return f(3000);
});

benchmark("Moon", () => {
  const f = M.parseWith(testLib, `size.
    list: (listRange 0 size)
    (listSum
      (for 0 size list #i.list.
        (listReverse list)))
  `);
  return f(3000);
});



// ## Fibonacci
// Just a simple benchmark against JS itself. Both have essentially the same
// performance on this case. Nothing to see here.

console.log("\n## Fibonacci\n");

benchmark("Moon", () => {
  const fib = M.parse(`rec@ n.
    (if (gtn n 1)
      (add (rec (sub n 1)) (rec (sub n 2)))
      n)
  `, {fast:true});
  return fib(40);
});

benchmark("JavaScript", () => {
  const fib = n =>
    n > 1
      ? fib(n - 1) + fib(n - 2)
      : n;
  return fib(40);
});



// ## TODO: more benchmarks

})();
