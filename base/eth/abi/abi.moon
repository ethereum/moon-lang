arrayLength = zb2rhj31DmWEQi2c9stdR1r8wfFboPeFCEdXNysWKikEx3QHy
arrayMap = zb2rhgW1F8GpBDCtoXjEcqDBFXNiCDaPNt1fekX2Po8uHWiEV
arrayGet = zb2rhjfCUgfysNDVs2pTuMw9Um8hRbGyYdsjKCaMTceKAGDSG
arraySlice = zb2rhiPF8JLJ2JFUKR3MGk8HvdjSSa6oAY7KmVpXzZfcD65zu
arrayAny = zb2rhgMZj9zo2uedSAd59429jtEuTVESMmwYkZesbpH8d2S92

strFilter = zb2rhnhgfZ8ynnFW7WtAuQvU23Z6Bt5UxYCVx8usrjt1m8VSu
strSplit = zb2rheqi4ntPSJQnoW8aCC7x9ydG5WBAM2dtDsQ9fDjkp36ek

bytesLength = zb2rhbRAVvyLUE9tCysrnWvP7guviTgXQWzcK41KocGrhnvnH
bytesConcat = zb2rhd8xzKmJPH4H4D8SABF547bcJy2P5ze7hmPEHJz2Pnp7N
bytesPad = zb2rharxQTRobPCL5Qhy6LaWTWo7LsYJ63rVzqjDrk3hArS8T
bytesFromHex = zb2rhnRAXG8KJ9FAwVTmW7qrfcMuWVJcnKNb5qSBe3sp2r9JS

u16ToBig = zb2rhYRhv5qo5sPoXSkH34uT4tRxpFDnNkc6G5BDW6pDEk3TW
bigToHex = zb2rhZFXk2vLZmHXnJ3VCsZfRXjDfSEi3o2fUT6g2iC7wecGU

isDynamic = type =>
  name = (get type "name")
  dims = (get type "dims")
  (arrayAny (eql 1) [
    (cmp name "bytes")
    (cmp name "string")
    (arrayAny (eql 0) dims)
  ])

parseType = str =>
  notClosingBracket = char => (sub 1 (cmp char "]"))
  strs = (strSplit "[" (strFilter notClosingBracket str))
  name = (get strs "0")
  dims = (arrayMap (stn) (arraySlice strs 1 (arrayLength strs)))
  {
    name: name
    dims: dims
  }

// (isTuple : Bool) -> (if isTuple [(t : Type ** typeOf t)] (t : Type ** typeOf t)) -> Bytes
encode = encode @ isTuple => args =>

  encodeBytes32 = hex =>
    (bytesPad 0 32 "0x00" (bytesFromHex hex))

  encodeUint256 = big =>
    (encodeBytes32 (bigToHex big))

  encodeBytes = bytes =>
    length = (bytesLength bytes)
    nextMul32 = (mul (add (flr (div (sub length 1) 32)) 1) 32)
    lengthEncoded = (encodeUint256 (u16ToBig length))
    bytesEncoded = (bytesPad 1 nextMul32 "0x00" bytes)
    (bytesConcat lengthEncoded bytesEncoded)

  encodeTuple = tuple =>
    size = (arrayLength tuple)
    state = {head:"0x" tail:"0x"}
    result = (for 0 size state i => state => 
      head = (get state "head")
      tail = (get state "tail")
      pair = (arrayGet tuple i)
      type = (get pair "0")
      term = (get pair "1")
      (if (isDynamic type)
        {
          head:
            tailPos = (add (mul size 32) (bytesLength tail))
            (bytesConcat head (encodeUint256 (u16ToBig tailPos)))
          tail: (bytesConcat tail (encode 0 [type term]))
        }
        {
          head: (bytesConcat head (encode 0 [type term]))
          tail: tail
        }))
    (bytesConcat
      (get result "head")
      (get result "tail"))

  encodeTerm = type => term =>
    name = (get type "name")
    (if (cmp name "bytes32")
      (encodeBytes32 term)
      (if (cmp name "uint256")
        (encodeUint256 term)
        (if (cmp name "bytes")
          (encodeBytes term)
          "unsupported_type")))

  encodeArray = type => terms =>
    name = (get type "name")
    dims = (get type "dims")
    dim = (arrayGet dims (sub (arrayLength dims) 1))
    size = (if (eql dim 0) (arrayLength terms) dim)
    elementType = {
      name: name
      dims: (arraySlice dims 0 (sub (arrayLength dims) 1))
    }
    tuple = (arrayMap term => [elementType term]  terms)
    (if (eql dim 0)
      (bytesConcat
        (encodeUint256 (u16ToBig size))
        (encode 1 tuple))
      (encode 1 tuple))

  (if isTuple
    (encodeTuple args)
    type = (get args "0")
    term = (get args "1")
    dims = (get type "dims")
    (if (arrayLength dims)
      (encodeArray type term)
      (encodeTerm type term)))

(get {
  encode: encode
  parseType: parseType
})
