arrayLength = zb2rhj31DmWEQi2c9stdR1r8wfFboPeFCEdXNysWKikEx3QHy
arrayMap = zb2rhgW1F8GpBDCtoXjEcqDBFXNiCDaPNt1fekX2Po8uHWiEV
arrayGet = zb2rhjfCUgfysNDVs2pTuMw9Um8hRbGyYdsjKCaMTceKAGDSG
arraySlice = zb2rhiPF8JLJ2JFUKR3MGk8HvdjSSa6oAY7KmVpXzZfcD65zu
arrayAny = zb2rhgMZj9zo2uedSAd59429jtEuTVESMmwYkZesbpH8d2S92
arrayGenerate = zb2rhchsqGDzj5UBppkaEa9wm1H5n6VvVgQkHq6ryvFdKXWh8
arrayLast = zb2rhZhvZBAVJUaubWovcJQ3nY3BfqkXeSwyuQgfihH4BiAzo
arrayInit = zb2rhdmABYWjjPKYdUzzsSyt7tqhUfVHfcCWUPiBx9AEyTa8Z

strFilter = zb2rhnhgfZ8ynnFW7WtAuQvU23Z6Bt5UxYCVx8usrjt1m8VSu
strSplit = zb2rheqi4ntPSJQnoW8aCC7x9ydG5WBAM2dtDsQ9fDjkp36ek
strIndexOf = zb2rhbxRScabKQaihsvikS7VLMrqwVmG5xTiV8dhpmoycAHcV

bytesLength = zb2rhbRAVvyLUE9tCysrnWvP7guviTgXQWzcK41KocGrhnvnH
bytesConcat = zb2rhd8xzKmJPH4H4D8SABF547bcJy2P5ze7hmPEHJz2Pnp7N
bytesPad = zb2rharxQTRobPCL5Qhy6LaWTWo7LsYJ63rVzqjDrk3hArS8T
bytesFromHex = zb2rhnRAXG8KJ9FAwVTmW7qrfcMuWVJcnKNb5qSBe3sp2r9JS
bytesSlice = zb2rhg1FpG1nrxVEGvjp1gfU2tCP9sRmXXL77HjL2qnCfjUmv
bytesFromAscii = zb2rhoav2oVBSU3zQ3Yu1yZqUPcDFwLzxw2bG8NZqKWf4RVUj

u16ToBig = zb2rhYRhv5qo5sPoXSkH34uT4tRxpFDnNkc6G5BDW6pDEk3TW
bigToHex = zb2rhZFXk2vLZmHXnJ3VCsZfRXjDfSEi3o2fUT6g2iC7wecGU
hexToBig = zb2rhndxjNzRFG1YPHe8xK9S9nwGQKm3ChEBxovm8R2EC56F1
bigToNum = zb2rhhuEY9zoiu9rsJK7Mi3UGrQbRYTTyfFwiGyxdx1SP9raW

keccak256 = zb2rhkcDyioJbNcAMUAD4rBxi1pp5g5qFzAkGvQiKPu6MJcVu

isDynamic = isDynamic @ type =>
  name = (get type "name")
  (if (cmp name "tuple")
    (arrayAny (eql 1) 
      (arrayMap isDynamic (get type "typs")))
    dims = (get type "dims")
    (arrayAny (eql 1) [
      (cmp name "bytes")
      (cmp name "string")
      (arrayAny (eql 0) dims)
    ]))

type = type @ str =>
  (if (cmp (slc str 0 1) "(")
    types = (strSplit "," (slc str 1 (sub (len str) 1)))
    {
      name: "tuple"
      typs: (arrayMap type types)
    }
    
    strs = (strSplit "[" (strFilter c => (sub 1 (cmp c "]")) str))
    name = (get strs "0")
    dims = (arrayMap (stn) (arraySlice strs 1 (arrayLength strs)))
    {
      name: name
      dims: dims
    })

encodeType = encode @ type => term =>

  encodeBytes32 = hex =>
    (bytesPad 1 32 "0x00" (bytesFromHex hex))

  encodeAddress = hex =>
    (bytesPad 0 32 "0x00" (bytesFromHex hex))

  encodeUint256 = big =>
    (bytesPad 0 32 "0x00" (bytesFromHex (bigToHex big)))

  encodeBytes = bytes =>
    length = (bytesLength bytes)
    nextMul32 = (mul (add (flr (div (sub length 1) 32)) 1) 32)
    lengthEncoded = (encodeUint256 (u16ToBig length))
    bytesEncoded = (bytesPad 1 nextMul32 "0x00" bytes)
    (bytesConcat lengthEncoded bytesEncoded)

  encodeTuple = types => terms =>
    size = (arrayLength types)
    state = {head:"0x" tail:"0x"}
    encoded = (for 0 size state i => state => 
      head = (get state "head")
      tail = (get state "tail")
      type = (arrayGet types i)
      term = (arrayGet terms i)
      (if (isDynamic type)
        {
          head:
            tailPos = (add (mul size 32) (bytesLength tail))
            (bytesConcat head (encodeUint256 (u16ToBig tailPos)))
          tail:
            (bytesConcat tail (encode type term))
        }
        {
          head: (bytesConcat head (encode type term))
          tail: tail
        }))
      (bytesConcat
        (get encoded "head")
        (get encoded "tail"))

  encodeArray = type => terms =>
    name = (get type "name")
    dims = (get type "dims")
    lastDim = (arrayLast dims)
    size = (arrayLength terms)
    elementType = {
      name: name
      dims: (arrayInit dims)
    }
    tupleType = {
      name: "tuple"
      typs: (arrayMap term => elementType terms)
    }
    encodedSize = (if (eql lastDim 0) (encodeUint256 (u16ToBig size)) "0")
    encodedTuple = (encode tupleType terms)
    (bytesConcat
      encodedSize
      encodedTuple)

  name = (get type "name")

  (if (cmp name "tuple")
    (encodeTuple (get type "typs") term)

  (if (arrayLength (get type "dims"))
    (encodeArray type term)

  (if (cmp name "bytes32")
    (encodeBytes32 term)

  (if (cmp name "address")
    (encodeAddress term)

  (if (cmp name "uint256")
    (encodeUint256 term)

  (if (cmp name "bool")
    (encodeUint256 term)

  (if (cmp name "bytes")
    (encodeBytes term)

    (con "0xunsupported_type_" name))))))))

encodeCall = method => params =>
  parensIndex = (strIndexOf "(" method)
  methodName = (slc method 0 parensIndex)
  methodType = (slc method parensIndex (len method))
  sig = (bytesSlice (keccak256 (bytesFromAscii (con methodName methodType))) 0 4)
  dat = (encodeType (type methodType) params)
  (bytesConcat sig dat)

decodeType = type => bytes =>
  decode = decode @ type => bytes => i =>
    decodeUint256 = i =>
      {
        idx: (add i 32)
        val: (hexToBig (bytesSlice bytes i (add i 32)))
      }

    decodeBytes32 = i =>
      {
        idx: (add i 32)
        val: (bytesSlice bytes i (add i 32))
      }

    decodeAddress = i =>
      {
        idx: (add i 32)
        val: (bytesSlice bytes 12 (add i 32))
      }

    decodeBytes = i =>
      decodedSize = (decodeUint256 i)
      size = (bigToNum (get decodedSize "val"))
      j = (get decodedSize "idx")
      {
        idx: (add j size)
        val: (bytesSlice bytes j (add j size))
      }

    decodeArray = type => i =>
      name = (get type "name")
      dims = (get type "dims")
      lastDim = (arrayLast dims)
      size = (if (eql lastDim 0) (bigToNum (get (decodeUint256 i) "val")) lastDim)
      j = (if (eql lastDim 0) (add i 32) i)
      elementType = {
        name: name
        dims: (arrayInit dims)
      }
      tupleType = {
        name: "tuple"
        typs: (arrayGenerate 0 size n => elementType)
      }
      (decode tupleType bytes j)

    decodeTuple = types => i =>
      size = (arrayLength types)
      decodeds = (arrayGenerate 0 size n =>
        type = (arrayGet types n)
        j = (add i (mul n 32))
        k = (if (isDynamic type) (add i (bigToNum (get (decodeUint256 j) "val"))) j)
        (decode type bytes k))
      {
        idx: (get (arrayLast decodeds) "idx")
        val: (arrayMap decoded => (get decoded "val") decodeds)
      }

    name = (get type "name")

    result =
      (if (cmp name "tuple")
        (decodeTuple (get type "typs") i)

      (if (arrayLength (get type "dims"))
        (decodeArray type i)

      (if (cmp name "bytes32")
        (decodeBytes32 i)

      (if (cmp name "address")
        (decodeAddress i)

      (if (cmp name "uint256")
        (decodeUint256 i)

      (if (cmp name "bool")
        (decodeUint256 i)

      (if (cmp name "bytes")
        (decodeBytes i)

        (con "unsupported_type_" name))))))))

    result

  (get (decode type bytes 0) "val")

(get {
  encode: typeStr => (encodeType (type typeStr))
  decode: typeStr => (decodeType (type typeStr))
  encodeCall: encodeCall
})
