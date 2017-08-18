const Moon = require("./..")();

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
