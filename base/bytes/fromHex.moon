hex =>
  (if (mod (len hex) 2)
    (con "0x0" (slc hex 2 (len hex)))
    hex)
