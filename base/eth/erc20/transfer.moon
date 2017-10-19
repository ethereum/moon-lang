do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
abi = zb2rhbCf7LRDYaGXNxJ6vGRNXjnPaxWm7dVS6RWeVoszDkbxK

to => value => contractAddress =>
  tx = {
    to: contractAddress
    data: (abi "encodeCall" "transfer(address,uint256)" [to value])
  }
  (do "eth" ["sendTransaction" [tx]])
