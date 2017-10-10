stringMap = zb2rhmQjnKBxzgPfx2PygzpLkVfQfKitv24swc78whYXvAwJz
withoutPrefix = zb2rhWtPgKPHnaZTzFV1YVoAnKyziyiu3FNbfvunH1edEzkzA
toLowerCase = zb2rhZycd8oM9ciVJ8D7mHCww5RzeCEXWi4BRbgU6UomyP2G8
toUpperCase = zb2rhXLdXCLBwuN3DX46hAcJxNGHXLsojopDGM1bhcG7KDZJm
keccak = zb2rhhNUeNabC2amPnzJ8S5fzdn6XDYiTZ8H8EP8JD2oUFefr
charToNumber = zb2rhfBJs8FuBmPT9VjZLPpg2MS7H1jGSFc5MWSP9kKwYD5Pq

address =>
  addrNoPrefix = (withoutPrefix address)
  addrNoPrefixLower = (stringMap toLowerCase addrNoPrefix)
  addrHash = (withoutPrefix (keccak addrNoPrefixLower))
  shouldBeLower = char => (ltn (charToNumber char) 8)
  (for 0 (len addrNoPrefix) "0x" i => checksum => 
    char = (slc addrNoPrefix i (add i 1))
    charHash = (slc addrHash i (add i 1))
    correctCaseChar = (if (shouldBeLower charHash) (toLowerCase char) (toUpperCase char))
    (con checksum correctCaseChar))
