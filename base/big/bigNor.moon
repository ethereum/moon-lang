listFold = zb2rhbksBjR3yFP98YrEGss6Yv7wVCgNbYtWiwz9nGRSAoiAa

big =>
  val => end =>
    res = (listFold big {
      val: digit => res =>
        cut = (mul (eql digit 0) (get res "cut"))
        big = (if cut (get res "big") (val digit (get res "big")))
        {cut:cut big:big}
      end: {cut:1 big:end}
    })
  (get res "big")
