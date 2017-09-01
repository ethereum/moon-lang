numToC16 = zb2rhbWCYXz8UCecHPTry55w8vBzhE4iu87iwVXqmfTddWzRe

u32ToHex = u32 =>
  (for 0 8 "" i =>
    num = (mod (flr (div u32 (pow 16 i))) 16)
    (con (numToC16 num)))

big => (big u32 => hex => (con hex (u32ToHex u32)) "0x")

