listMatch = zb2rhoexKPhLaQGMSVjrSsRaz56U8RZYkUBUJKPDPNLqYWHw8

Gtn = g => e => l => g
Eql = g => e => l => e
Ltn = g => e => l => l

compare = x => y => c =>
  (if (gtn x y)
    Gtn
    (if (ltn x y)
      Ltn
      c))

a => b =>
  xs = a
  ys = (listMatch b)
  (xs
    x => xs => b => r =>
      y  = (b y => ys => y 0)
      ys = (b y => ys => ys c => n => n)
      (xs ys (compare x y r))
    b => r =>
      x = 0
      y = (b y => ys => y 0)
      (compare x y r)
    ys
    Eql)
