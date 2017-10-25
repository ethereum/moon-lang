balanceOf = zb2rhmFmNwJL6wR8UyofxPK9XtUvBsbzjdyRx7HsTH6J3r7y8
hexToEther = zb2rhn4gzprHnkT6RUfid2wKjR964PTnER3ysMU9tuKDAqVnu
tokenBySymbol = zb2rhcY3Vu3icAijtDd57HFtHhwu5cBNBzzLJVAPoDxsz6Epe
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX

address => symbol => return =>
  token = (tokenBySymbol symbol)
  tokenName = (get token "name")
  tokenAddress = (get token "address")
  balance = <(if (cmp tokenName "Ether")
    (do "eth" ["getBalance" [address "latest"]])
    (balanceOf address tokenAddress))
  (return (hexToEther balance))
