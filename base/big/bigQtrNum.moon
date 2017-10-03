listFold = zb2rhbksBjR3yFP98YrEGss6Yv7wVCgNbYtWiwz9nGRSAoiAa

// Big -> Uint16 -> Big
// QuotRem of a Bignum by a single-digit Uint16.
// This is *much* faster than long quotRem (for now).
a => b =>
  pw = (pow 2 16)
  (listFold a {
    val: digit => quoRem =>
      quo0 = (get quoRem "quo")
      rem0 = (get quoRem "rem")
      rem1 = (add digit (mul rem0 pw))
      digi = (flr (div rem1 b))
      quo1 = c => n => (c digi (quo0 c n))
      diff = (mul b digi)
      rem2 = (sub rem1 diff)
      {quo:quo1 rem:rem2}
    end: {quo:c=>n=>n rem:0}
  })
