do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
abi = zb2rhbCf7LRDYaGXNxJ6vGRNXjnPaxWm7dVS6RWeVoszDkbxK

to => value => contractAddress =>
  tx = {
    to: contractAddress
    data: (abi "encodeCall" "transfer(address,uint256)" [to value])
  }
  (do "eth" ["sendTransaction" [tx]])

//0x
//a9059cbb
//000000000000000000000000c7fe03ce5fb8d188554e19e64d34522e77c4e6d4
//00000000000000000000000000000000000000000000000000038d7ea4c68000
