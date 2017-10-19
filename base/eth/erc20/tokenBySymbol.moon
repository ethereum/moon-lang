tokenList = zb2rhnh6h5iDikW8SNUFXRsrcLHDW8FYW4xRTXGzja1xicHxf
arrayFoldr = zb2rhbTuYiZm5fGUHUhd3sQNRDhEW6FVjXLp8UyWk5hE9nQ5F

symbol =>
  match = token => (cmp (get token "symbol") symbol)
  (arrayFoldr
    token => result => (if (match token) token result)
    (get tokenList "0")
    tokenList)
