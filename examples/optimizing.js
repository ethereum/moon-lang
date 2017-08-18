const Moon = require("./..")();

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
