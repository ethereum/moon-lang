listMatch = zb2rhoexKPhLaQGMSVjrSsRaz56U8RZYkUBUJKPDPNLqYWHw8

a => b =>
  (a
    x => xs =>
      b => c => r =>
        y   = (b y => ys => y 0)
        ys  = (b y => ys => ys c => n => n)
        dif = (sub (sub x y) c)
        val = (if (ltn dif 0) (add dif (pow 2 16)) dif)
        car = (if (ltn dif 0) 1 0)
        res = c => n => (r c (c val n))
        (xs ys car res)
    b => c => r =>
      (b
        y => ys => c => n => n
        (if (gtn c 0)
          c => n => (c 0 n)
          r))
    (listMatch b)
    0
    c => n => n)
