const Moon = require("./..")();

const pair = Moon.parse("a => b => [a b]");

console.log(Moon.stringify(pair(1)));
