abi = zb2rhbCf7LRDYaGXNxJ6vGRNXjnPaxWm7dVS6RWeVoszDkbxK
big = zb2rhnKgZ66iwb9AGyxTMP6zPbkwxe5jKxrKYTofJqisdhfJU
fromAscii = zb2rhoav2oVBSU3zQ3Yu1yZqUPcDFwLzxw2bG8NZqKWf4RVUj

{
  a:
    (abi "decode" "(bytes32[],bytes32[])"
      (abi "encode" "(bytes32[],bytes32[])" 
        [["0x1234","0x1111"],["0xabcd","0x777777"]]))
  b: 
    (abi "encodeCall" "sam(bytes,bool,uint256[])"
      [(fromAscii "dave") (big "1") [(big "1") (big "2") (big "3")]])
}
