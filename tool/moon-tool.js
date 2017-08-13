#!/usr/bin/env node --harmony-tailcalls

var ethUrl = "https://ropsten.infura.io/sE0I5J1gO2jugs9LndHR";
var swarmUrl = "http://swarm-gateways.net";
var contractInfo = require("./moon-contract.json");
var Lazy = (value,cache) => () => (cache || (cache = value()));
var LazyAsync = (value,cache) => async () => (cache || (cache = await value()));
var beautify = Lazy(() => require("js-beautify").js_beautify);
var fs = Lazy(() => require("fs"));
var net = Lazy(() => require('net'))
var path = Lazy(() => require("path"));
var moon = Lazy(() => require("moon-lang"));
var nodejsIO = Lazy(() => require("moon-lang/lib/moon-io-node.js"));
var Eth = Lazy(() => require("eth-lib"));
var eth = Lazy(() => Eth().Api(SignerEthereumProvider(ethUrl, userAccount()))); // <- TODO I made this public. Remember talk to the Infura guys.
var swarm = Lazy(() => require("swarm-js").at(swarmUrl));
var book = Lazy(() => eth().contract(userAccount().address, contractInfo.testnetAddress, contractInfo.interface));
var packageJson = Lazy(() => require("./package.json"));

// Gets the user account from the system
var userAccount = Lazy(() => {
  var homePath = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  var moonKeyPath = path().join(homePath, ".moon-key");
  if (!fs().existsSync(moonKeyPath))
    fs().writeFileSync(moonKeyPath, Eth().Account.create().privateKey)
  var userPrivate = fs().readFileSync(moonKeyPath, "utf8");
  var account = Eth().Account.fromPrivate(userPrivate);
  account.path = moonKeyPath;
  return account;
});

// Creates an EthereumProvider which auto-signs for this account
var SignerEthereumProvider = (ethereumUrl, account) => {
  var eth = Eth().Api(Eth().Provider(ethereumUrl));
  return Eth().Provider(ethereumUrl, (method, params) => {
    switch (method) {
      case "eth_accounts":
        return Promise.resolve([account.address]);
      case "eth_sendTransaction":
        if (params[0].from === account.address) {
          return eth.addTransactionDefaults(params[0])
            .then(tx => Eth().Account.signTransaction(tx, account.privateKey))
            .then(rawTx => eth.sendRawTransaction(rawTx));
        }
    }
  });
}

// Converts an ASCII name its EVM Bytes32 representation
var nameToBytes32 = name =>
  Eth().Bytes.padRight(32, Eth().Bytes.fromAscii(name));

// Publishes a code on the Ethereum / Swarm network
var publishCode = async (name, code) => {
  try {

    // 1. If name is already taken, abort
    var published = await moon().book(name, {noLocal: true});
    if (published) {
      console.log("- The name `" + name + "` is taken! " + published);
      return null;
    }

    // 2. Publish code to Swarm
    console.log("- Publishing `" + name + "` to Swarm...");
    var swarmHash = await swarm().upload(new Buffer(code));
    console.log("- Done! SwarmHash: " + swarmHash);

    // 3. Publish SwarmHash on Ethereum with the chosen name
    console.log("- Publishing SwarmHash to Ethereum...");
    var txHash = await book().set_txHash(nameToBytes32(name), "0x" + swarmHash);
    console.log("- Done! TxHash: ", txHash);

    // 4. Waits for the transaction to confirm
    console.log("- Waiting transaction confirmation (may take about 1 min)...");
    published = await moon().book(name, {noLocal: true});
    while (!published) {
      console.log("-- Not Yet. Waiting...");
      published = await moon().book(name);
      await new Promise((r,_) => setTimeout(r, 1000));
    }
    console.log("- Transaction confirmed!");
    console.log("- Now everyone can use your term under the name: `" + name + "`.");

    // 5. Success!
    return true;

  } catch (e) {
    console.log(e);
    return false;
  }
};

// Gets the command line arguments
var args = [].slice.call(process.argv, 2);

// Gets the code that the user wants to run
var getCode = () => {
  var code = args[args.length - 1] || '"oOthing"';
  if (code.slice(-5) === ".moon")
    code = code.slice(0,-5);
  return moon().doImportBook(code);
}

(async () => {

  try {

    switch ((args[0]||"").toLowerCase()) {
      case "run":
        console.log(moon().run(await getCode()));
        break;

      case "runio":
        console.log(moon().stringify(await moon().performIO(moon().parse(moon().run(await getCode())))));
        break;

      case "pack":
        console.log(moon().pack(await getCode()));
        break;

      case "runpack":
        console.log(moon().pack(moon().run(await getCode())));
        break;

      case "unpack":
        console.log(moon().unpack(args[args.length - 1]));
        break;

      case "book":
        console.log(await moon().book(args[args.length - 1]));
        break;

      case "compile":
        console.log(beautify()(moon().compile(await getCode())));
        break;

      case "address":
        console.log(userAccount().address);
        break;

      case "keypath":
        console.log(userAccount().path);
        break;

      case "balance":
        console.log(Eth().Nat.toEther(await eth().getBalance(userAccount().address, "latest")) + " ETH");
        break;
        
      case "publish":
        var codeName = args[1];
        var codePath = path().join(process.cwd(), codeName+".moon");
        if (fs().existsSync(codePath)) {
          console.log("Publishing " + codeName + ".");
          var code = fs().readFileSync(codePath, "utf8");
          await publishCode(codeName, code);
        } else {    
          console.log("Error: " + codeName + ".moon not found.");
        }
        break;

      case "version":
        console.log(packageJson().version);
        break;

      default:
        console.log("Moon-Lang ☾");
        console.log("");
        console.log("Commands:");
        console.log("");
        console.log("  moon run <expr>     -- runs an expression/file");
        console.log("  moon pack <expr>    -- packs an expression/file");
        console.log("  moon runpack <expr> -- same as above, but runs it before packing");
        console.log("  moon unpack <hex>   -- unpacks a packed expression/file");
        console.log("  moon book name      -- gets the Ethereum/Swarm definition for `name`");
        console.log("  moon compile <expr> -- compiles an expression/file to JavaScript");
        console.log("  moon address        -- prints the address of this Moon CLI");
        console.log("  moon keypath        -- prints the path for the key of this Moon CLI");
        console.log("  moon balance        -- prints the balance of this Moon CLI");
        console.log("  moon publish <file> -- publishes `file.moon` to Ethereum/Swarm");
        console.log("  moon version        -- displays the version");
        console.log("");
        console.log("Examples:");
        console.log("");
        console.log("  Inline execution:");
        console.log("    moon run '(add 1 2)'         -- output: 3");
        console.log("    moon run 'x:4 y:2 [x,y]'     -- output: [4,7]");
        console.log("    moon run '(for 1 5 1 (mul))' -- output: 24");
        console.log("    moon run '(a.b.[a,b] 1)'     -- output: a.[1,a]");
        console.log("");
        console.log("  Local file execution:");
        console.log("    echo '\"Hello\"' >> hi.moon");
        console.log("    moon run hi                  -- output: \"Hello\"");  
        console.log("");
        console.log("  Importing from Ethereum/Swarm:");
        console.log("    moon run '(add answer 1)'    -- output: 43 <answer auto-imported>"); 
        console.log("    moon runIO demoIOApp         -- <runs a demo app, auto-imported>"); 
        console.log("");
        console.log("  Publishing to Ethereum/Swarm:");
        console.log("    moon balance                 -- must have a few ETHs to publish");
        console.log("    moon address                 -- if not, send some >>cents<< here");
        console.log("    moon publish helloWorld      -- publishes helloWorld.moon");
        console.log("");
    }

  } catch (e) {
    console.log(e);
  }

})();
