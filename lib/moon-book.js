"use strict";

// MoonBook gets term definitions from the Ethereum / Swarm network

var onBrowser = typeof window !== "undefined";
var req = function req(value, cache) {
  return function () {
    return cache || (cache = require(value));
  };
}; // temporary hack, TODO: use "browser" on package.json
var fs = req("fs");
var path = req("path");
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
var asciiToBytes32 = function asciiToBytes32(ascii) {
  var hex = "0x";
  for (var i = 0; i < ascii.length; ++i) {
    hex += ("00" + ascii.charCodeAt(i).toString(16)).slice(-2);
  }while (hex.length < 66) {
    hex += "0";
  }return hex;
};

// String, MoonBookOptions -> Promise (Nullable String)
var resolve = function resolve(termName) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return new Promise(function (resolve, reject) {
    var ethUrl = opts.ethUrl || config.testnet.url;
    var swarmUrl = opts.swarmUrl || config.swarmUrl;
    var chainId = opts.chainId || config.testnet.chainId;
    var noLocal = opts.noLocal;
    var isSwarmHash = /^[_]?[a-fA-F0-9]{64}$/.test(termName);
    termName = isSwarmHash ? termName.replace(/_/, "") : termName;

    // Resolve locally if there is a termName.moon around
    if (!onBrowser && !opts.noLocal) {
      var paths = [path().join(process.cwd(), termName + ".moon"), path().join(process.cwd(), "moon-base", termName + ".moon"), path().join(path().dirname(process.cwd()), "moon-base", termName + ".moon")];
      for (var i = 0; i < paths.length; ++i) {
        if (fs().existsSync(paths[i])) return resolve(fs().readFileSync(paths[i], "utf8"));
      }
    }

    // Converts `termName` to hex if it is ASCII
    var termKey = isSwarmHash ? termName : asciiToBytes32(termName);

    // If there is a chache (browser's localStore or disk), return it
    if (!opts.disableCache) {
      var termId = isSwarmHash ? "moon-base-swarm-" + termName : "moon-base-testnet-" + termName;
      if (onBrowser) {
        if (localStorage.getItem(termId)) {
          return resolve(Promise.resolve(localStorage.getItem(termId)));
        }
      } else {
        var homePath = process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"];
        var moonBookPath = path().join(homePath, ".moon-base");
        var termPath = path().join(moonBookPath, termId);
        if (!fs().existsSync(moonBookPath)) fs().mkdirSync(moonBookPath);
        if (fs().existsSync(termPath)) return resolve(Promise.resolve(fs().readFileSync(termPath, "utf8")));
      }
    }

    // When we get the result, cache and resolve
    var gotSource = function gotSource(source) {
      // Cache the result globally
      if (!opts.disableCache) {
        if (onBrowser) {
          localStorage.setItem(termId, source);
        } else {
          fs().writeFileSync(termPath, source);
        }
      }
      resolve(source);
    };

    // If termName is an Ethereum alias, resolve it
    if (!isSwarmHash) {
      var contractAddress = config.testnet.contractAddress;

      // Get it from Ethereum
      var swarmHashRequest = request(ethUrl, {
        method: "POST",
        contentType: "application/json-rpc",
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "id": Math.random() * Math.pow(2, 32) | 0,
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
      swarmHashRequest.then(function (swarmHashResult) {
        var swarmHash = JSON.parse(swarmHashResult).result.slice(2);
        if (swarmHash === "0000000000000000000000000000000000000000000000000000000000000000") {
          return resolve(null);
        } else {
          return gotSource(swarmHash);
        }
      });

      // If termName is a swarmHash, get its source
    } else {
      var termSwarmUrl = swarmUrl + "/bzzr:/" + termName;
      var termSource = request(termSwarmUrl, { method: "GET" });
      return termSource.then(function (termSource) {
        // TODO: better way to do this?
        var errors = ["error resolving " + termName + ": no contract code at given address\n", "404 page not found\n"];
        if (errors.indexOf(termSource) !== -1) {
          return resolve(null);
        } else {
          return gotSource(termSource);
        }
      });
    }
  }).catch(function () {
    return resolve(null);
  });
};

module.exports = resolve;