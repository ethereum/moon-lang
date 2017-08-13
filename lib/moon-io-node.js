"use strict";

// Standard side-effects on Node.js

var rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

module.exports = {
  prompt: function prompt(text) {
    return new Promise(function (resolve, reject) {
      return rl.question(text, resolve);
    });
  },
  print: function print(text) {
    return Promise.resolve(console.log(text), null);
  },
  log: function log(text) {
    return Promise.resolve(console.log(text), null);
  }
};