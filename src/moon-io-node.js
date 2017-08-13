// Standard side-effects on Node.js

const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

module.exports = {
  prompt: text => new Promise((resolve, reject) => rl.question(text, resolve)),
  print: text => Promise.resolve(console.log(text), null),
  log: text => Promise.resolve(console.log(text), null)
};
