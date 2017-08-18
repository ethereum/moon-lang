const Moon = require("./..")();

(async () => {

  const cid = await Moon.save("x => (mul x 2)");
  console.log(cid);

  const double = Moon.parse(await Moon.imports(cid));
  console.log(double(7));
  
})();
