"use strict";

// HexString -> [Uint8]
var hexToBytes = function hexToBytes(hex) {
  var bytes = [];
  for (var i = 2; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return bytes;
};

// [Uint8] -> HexString
var bytesToHex = function bytesToHex(bytes) {
  var hex = "";
  for (var i = 0; i < bytes.length; ++i) {
    var b = bytes[i].toString(16);
    hex += b.length === 1 ? "0" + b : b;
  }
  return "0x" + hex;
};

var find = function find(fn, list) {
  return list === null ? null : fn(list[0]) ? list[0] : find(fn, list[1]);
};

module.exports = {
  bytesToHex: bytesToHex,
  hexToBytes: hexToBytes,
  find: find
};