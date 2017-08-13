"use strict";

// Standard side-effects on browser

module.exports = {
  print: function print(text) {
    return function (cont) {
      return alert(text), cont(null);
    };
  },
  prompt: function (_prompt) {
    function prompt(_x) {
      return _prompt.apply(this, arguments);
    }

    prompt.toString = function () {
      return _prompt.toString();
    };

    return prompt;
  }(function (question) {
    return function (cont) {
      return cont(prompt(question));
    };
  }),
  log: function log(text) {
    return function (cont) {
      return alert(text), cont(null);
    };
  }
};