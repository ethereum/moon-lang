pragma solidity ^0.4.6;

contract Map { 
  function Map() {}

  mapping (bytes32 => bytes32) map;

  // set(key,val) registers either an space or a value. To register a(n):
  // - space: call set("spaceName", "0x1234...")
  // - value: call set("spaceName/valueName", "0x1234...")
  // Where each key is a base64 (AB...YZab...yz01..89_/) name, encoded as a
  // bytes256, with the rightmost byte defining the leftmost char. Note the
  // difference between registering a space and a value is the presence of the
  // slash ("/") on the key. When you register a space, you become its owner,
  // and only you will be able to register values starting with "yourSpace/".
  // Values on the empty namespace ("/foo", "/bar") can be registered by
  // anyone. A value can only be overwritten when it starts with a lowcase
  // letter. Versioning can be done outside the contract by registering
  // different names ending with _x_y_z.
  function register(bytes32 key, bytes32 val) {
    assembly {
      let str = key
      let space := 0
      getSpace:
        jumpi(end, or(eq(str, 0)), eq(mod(str, 64), 63))
        space := add(mul(space, 64), mod(str, 64))
        str := div(str, 64)
        jump(getSpace)
      end:

      jumpi(eq(mod(str, 64), 63), registerName)
      sstore(space, val)
      jump(stop)

      registerName:
      jumpi(stop, not(or(eq(space,0), eq(sload(space), origin))))
      jumpi(stop, lt(div(str, 64), 33))
      sstore(key, val)

      stop:
    }
  }

  key: 0000HGFE/DCBA
  spc: 0000000000000
  nam: 0000000000000


  function lookup(bytes32 key) constant returns (val bytes32) {
    assembly {
      val := sload(key)
    }
  }
}

abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_/
