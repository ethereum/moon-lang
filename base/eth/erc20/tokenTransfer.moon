transfer = zb2rhnYLv2N5CgeqVAkeo1ZhGK2cTHxbGAkifdGQAFYw418ra
etherToHex = zb2rhY6HWXrifEvYtcMTHV6xH3mjJNk3x4U2No6Pwkh9ziX9Z
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX
big = zb2rhnKgZ66iwb9AGyxTMP6zPbkwxe5jKxrKYTofJqisdhfJU
tokenBySymbol = zb2rhb4KscE2DRZWkawhtkvrdDSnLR78SckuPyi657Z5QfDqJ

to => value => symbol =>
  token = (tokenBySymbol symbol)
  tokenName = (get token "name")
  tokenAddress = (get token "address")
  valueHex = (etherToHex value)
  (if (cmp tokenName "Ethereum")
    (do "eth" ["sendTransaction" {to:to value:valueHex}])
    (transfer to (big valueHex) tokenAddress))
