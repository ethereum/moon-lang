keccak256 = zb2rhkcDyioJbNcAMUAD4rBxi1pp5g5qFzAkGvQiKPu6MJcVu
bytesSlice = zb2rhg1FpG1nrxVEGvjp1gfU2tCP9sRmXXL77HjL2qnCfjUmv
bytesConcat = zb2rhd8xzKmJPH4H4D8SABF547bcJy2P5ze7hmPEHJz2Pnp7N
abi = zb2rheJKYA9tUu9qTHFTqk3vwJaXTFyK6hJxVXzNdayG9Ctfc

f = methodName => methodType => params =>
  kek = (keccak256 (con methodName methodType))
  sig = (bytesSlice kek 0 4)
  sig

(f "foo" "(bytes32)" ["0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"])
