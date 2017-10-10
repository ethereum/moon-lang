withoutPrefix = zb2rhWtPgKPHnaZTzFV1YVoAnKyziyiu3FNbfvunH1edEzkzA
all = zb2rhXnM3SsJw8v6BUsuLqouqBQvWGFyKAMRon9MttXDTEuvm
isHex = zb2rhgsueifqpEy1JPm883FuKUeQxdKpDwLFcVPt23SrzT9L3
stringToArray = zb2rheU6sxw6S9Ustj4F6EYgP8niDse1ukopDWfrH88xcrAA2
stringMap = zb2rhmQjnKBxzgPfx2PygzpLkVfQfKitv24swc78whYXvAwJz
toUpperCase = zb2rhXLdXCLBwuN3DX46hAcJxNGHXLsojopDGM1bhcG7KDZJm
toLowerCase = zb2rhZycd8oM9ciVJ8D7mHCww5RzeCEXWi4BRbgU6UomyP2G8
isChecksum = zb2rhgTfh2fo9AmE7xmkDnn3Vtm7DFQopSopYeKiDS35wWtZW

address =>
  addrNoPrefix = (stringMap toLowerCase (withoutPrefix address))
  isValidHex = (all isHex (stringToArray addrNoPrefix))        
  isHexPrefixed = (cmp (slc address 0 2) "0x")
  isValidLength = (eql (len address) 42)
  isAllLower = (cmp address (stringMap toUpperCase address))
  isAllUpper = (cmp address (stringMap toLowerCase address))
  isAllSameCase = (or isAllLower isAllUpper)
  isValidated = (or (isChecksum address) isAllSameCase)
  (all (eql 1) [
    isHexPrefixed
    isValidHex
    isValidLength
    isValidated
  ])
