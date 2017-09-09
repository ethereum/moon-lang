numToNib = zb2rhbWCYXz8UCecHPTry55w8vBzhE4iu87iwVXqmfTddWzRe

u16ToHex = u16 =>
  (for 0 4 "" i =>
    num = (mod (flr (div u16 (pow 16 i))) 16)
    (con (numToNib num)))

big =>
  chars = (big u16 => hex => (con hex (u16ToHex u16)) "")
  res = (for 0 (len chars) "0x" i => res0 =>
    char = (slc chars i (add i 1))
    res1 = (con res0 char)
    (if (cmp res1 "0x0") "0x" res1))
  (if (cmp res "0x") "0x0" res)
