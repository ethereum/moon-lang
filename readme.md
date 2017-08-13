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
    const Moon = require(".");

    // Parse user-submitted algorithm
    const untrustedFactorial = Moon.parse(`x. (for 1 x 1 (mul))`);

    // Run it safely
    console.log(untrustedFactorial(10000000)); // output: infinity (too large to fit a double)
    ```

    You can do a lot!


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

## Learning

The best way to learn right now is looking at the examples on [demos](demos). Tutorials and documentations are being developed.
