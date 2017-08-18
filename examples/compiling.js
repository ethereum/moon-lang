const Moon = require("./..")();

const factorial = Moon.parse(`n =>
  (for 1 (add n 1) 1 i => result =>
    (mul i result))
`);

console.log(factorial(4));
