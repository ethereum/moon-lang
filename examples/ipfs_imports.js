const Moon = require("./..")(); 

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
