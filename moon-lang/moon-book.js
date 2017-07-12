// MoonBook gets term definitions from the Ethereum / Swarm network

var onBrowser = typeof window !== "undefined";
var Lazy = (value,cache) => () => (cache || (cache = value()));
var fs = Lazy(() => require("f"+"s"));
var path = Lazy(() => require("p"+"ath"));
var request = require("xhr-request-promise");

var config = {
  swarmUrl: "http://swarm-gateways.net",
  mainnet: {
    url: "https://mainnet.infura.io/sE0I5J1gO2jugs9LndHR",
    chainId: "0x1",
    contractAddress: ""
  },
  testnet: {
    url: "https://ropsten.infura.io/sE0I5J1gO2jugs9LndHR",
    chainId: "0x3",
    contractAddress: "0x6161782f7C60a5b6a57F29635d96fE0078E6D2C4"
  }
};

// String -> String
var asciiToBytes32 = ascii => {
  let hex = "0x";
  for (let i = 0; i < ascii.length; ++i)
    hex += ("00" + ascii.charCodeAt(i).toString(16)).slice(-2);
  while (hex.length < 66)
    hex += "0";
  return hex;
};

// String, MoonBookOptions -> Promise (Nullable String)
var resolve = async (termName, opts = {}) => {
  try {
    var termKey = asciiToBytes32(termName);
    var ethUrl = opts.ethUrl || config.testnet.url;
    var swarmUrl = opts.swarmUrl || config.swarmUrl;
    var chainId = opts.chainId || config.testnet.chainId;
    var debug = opts.debug;
    var noLocal = opts.noLocal;
    var contractAddress = config.testnet.contractAddress;
    var termId = "moon_" + contractAddress.slice(-8) + "_" + termKey.slice(2);

    // 1. Resolve locally if there is a termName.moon around
    if (!onBrowser && !opts.noLocal) {
      var paths = [
        path().join(process.cwd(), termName+".moon"),
        path().join(process.cwd(), "moon-base", termName+".moon"),
        path().join(path().dirname(process.cwd()), "moon-base", termName+".moon")
      ];
      for (var i = 0; i < paths.length; ++i) {
        if (fs().existsSync(paths[i]))
          return fs().readFileSync(paths[i], "utf8");
      }
    };

    // 2. If there is a global chache, return it
    if (!opts.disableCache) {
      if (onBrowser) {
        if (localStorage.getItem(termId)) {
          return Promise.resolve(localStorage.getItem(termId));
        }
      } else {
        var homePath = process.env[(process.platform == "win32") ? "USERPROFILE" : "HOME"];
        var moonBookPath = path().join(homePath, ".moon-base");
        var termPath = path().join(moonBookPath, termId);
        if (!fs().existsSync(moonBookPath))
          fs().mkdirSync(moonBookPath);
        if (fs().existsSync(termPath))
          return Promise.resolve(fs().readFileSync(termPath, "utf8"));
      };
    };

    // 2. If not, get the Swarm hash from Ethereum
    if (debug) console.log("- Couldn't resolve " + termName + " locally. Looking up on Ethereum / Swarm. This may take a while...");
    var swarmHashRequest = await request(ethUrl, {
      method: "POST",
      contentType: "application/json-rpc",
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "id": Math.random() * Math.pow(2,32) | 0,
        "method": "eth_call",
        "params": [{
          "from": "0x0000000000000000000000000000000000000000",
          "to": contractAddress,
          "value": "0x0",
          "data": "0x8eaa6ac0" + termKey.slice(2),
          "chainId": chainId,
          "gasPrice": "0x8a94af400",
          "nonce": "0x0",
          "gas": "0x6c9d"
        }, "latest"]
      })
    });
    var swarmHash = JSON.parse(swarmHashRequest).result.slice(2);
    if (swarmHash === "0000000000000000000000000000000000000000000000000000000000000000") {
      return null;
    }

    // 3. Get the term definition from Swarm
    var termSwarmUrl = swarmUrl + "/bzzr:/" + swarmHash;
    var termSource = await request(termSwarmUrl, {method: "GET"});
    if (termSource === "404 page not found\n") {
      return null;
    }

    // 4. Cache the result globally
    if (!opts.disableCache) {
      if (onBrowser) {
        localStorage.setItem(termId, termSource);
      } else {
        fs().writeFileSync(termPath, termSource);
      }
    }

    // 5. Return it
    return termSource;
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = resolve;
