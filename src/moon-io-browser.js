// Standard side-effects on browser

module.exports = {
  prompt: text => Promise.resolve(prompt(text)),
  print: text => Promise.resolve(alert(text), null),
  log: text => Promise.resolve(console.log(text), null)
};
