"use strict";

// Standard side-effects on browser

module.exports = {
  prompt: function (_prompt) {
    function prompt(_x) {
      return _prompt.apply(this, arguments);
    }

    prompt.toString = function () {
      return _prompt.toString();
    };

    return prompt;
  }(function (text) {
    return Promise.resolve(prompt(text));
  }),
  print: function print(text) {
    return Promise.resolve(alert(text), null);
  },
  log: function log(text) {
    return Promise.resolve(console.log(text), null);
  }
};