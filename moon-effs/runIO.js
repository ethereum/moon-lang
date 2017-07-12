const readline = require("readline");
const runIO = program => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const getLn = cont => () => {
    return new Promise((resolve, reject) => {
      rl.question("", function (line) {
        resolve(cont(line)());
      });
    });
  };
  const putLn = str => cont => () => {
    console.log(str);
    return cont();
  };
  const exit = () => process.exit();
  return program(getLn)(putLn)(exit)();
};

module.exports = runIO;
