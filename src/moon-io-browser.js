// Standard side-effects on browser

module.exports = {
  print: text => cont => (alert(text), cont(null)),
  prompt: question => cont => cont(prompt(question)),
  log: text => cont => (alert(text), cont(null))
};
