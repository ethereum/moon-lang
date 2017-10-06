do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
abi = zb2rhbCf7LRDYaGXNxJ6vGRNXjnPaxWm7dVS6RWeVoszDkbxK

address => contractAddress =>
  tx = {
    from: address
    to: contractAddress
    data: (abi "encodeCall" "balanceOf(address)" [address])
  }
  (do "eth" ["call" [tx "latest"]])
