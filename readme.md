## Moon: an universal code-interchange format

Moon is an universal code-interchange format. It was designed to be:

- **Portable:** the entire language (parser, optimizer and compiler) is just a [12kb JS file](moon-lang/dist/moon-lang.min.js) (gzipped).

- **Fast:** Moon is highly optimized and can run [5-100x faster](moon-demo/demo-performance.js) than popular FP libs (Ramda, Lodash, Undersore, etc.).

- **Safe:** since Moon is 100% pure and side-effect free, you can safely run code from untrusted sources.

- **Lightweight:** thanks to its [compact binary format](https://tromp.github.io/cl/LC.pdf), Moon bundles are much smaller than JS bundles.

- **Decentralized:** you can publish and import code from [Ethereum](https://www.ethereum.org), a censure-resistant computer network.

In essence, Moon is a minimal subset of JS with just enough things to be fast, safe and powerful. Its main use-case is to pass code around and run user-submitted, untrusted code safely. Think of it as JSON for algorithms.

## Usage

1. **Inside JavaScript:**

    Install:

    ```bash
    npm install moon-lang
    ```

    And import/use:

    ```javascript
    const M = require("moon-lang");

    // User-submitted algorithms
    const userAlgos = M.parse(`{
      "successor": x. (add x 1),
      "square": x. (mul x x),
      "factorial": x. (for 1 (add 1 x) 1 (mul))
    }`);

    // Since they were parsed by Moon, you can run them safely!
    console.log(userAlgos.factorial(4)); // output: 24
    ```


2. **Command line:**

    Make sure you're using Node.js 8.0+, and install `moon-tool`:

    ```bash
    npm install -g moon-tool
    ```

    Then just use it:

    ```bash
    moon                                      # shows the help
    echo '"Hello World!"' >> hello.moon       # creates a hello world file
    moon run hello                            # prints a hello world!
    moon run "[hello, hello]"                 # prints two hello worlds!
    moon run "(for 0 8 hello i.r.(con r r))"  # prints many hellos!
    moon address                              # shows the Ethereum address of this Moon CLI
    moon balance                              # checks its balance
    moon publish hello                        # publishes your hello world to Ethereum/Swarm
    rm hello.moon                             # removes it from the local system
    moon run "[hello, hello]"                 # imports it back from Ethereum/Swarm
    moon runIO whatsMyBMI                     # runs a demo CLI-DApp from Ethereum/Swarm
    moon book whatsMyBMI                      # shows its code
    ```


## Articles

- [Ethereum + Swarm + λ = Moon, an universal code-interchange format](https://medium.com/@maiavictor/moon-a-decentralized-programming-language-282ba6c92e7a)

## Demos

- [Language overview ("learn Moon in Y minutes")](moon-demo/demo-language-overview.js)

- [Optimizing functional JavaScript code by 5-100x](moon-demo/demo-performance.js)

- [Tail calls and pure fors](moon-demo/demo-tail-calls-vs-pure-fors.js)

- [Lightweight monadic notation as a generalization of async/await](moon-demo/demo-monadic-notation.js)

- [Custom importers](moon-demo/demo-importers.md)


## Soon

- Build/publish Ethereum DApps with `moon dapp myDapp.moon` and [Inferno](https://infernojs.org).

- [ENS](https://ens.domains) used on Moon's contract for proper namespacing.

- System-F based type inferencer / checker?

- Better syntax?

## Disclaimers

1. Moon is in experimental stage, wasn't audited and **certainly** has nasty bugs. Don't use it in production yet.

2. Sorry for creating a new programming language.

3. [be kind]
