bigNor = zb2rhmDFWSSNMJAE7vNzAkaP1bKj4q89SFQqW4N1pybSWwqFy

a => b =>
  md = (pow 2 16)
  al = (a (u16 => (add 1)) 0)
  bl = (b (u16 => (add 1)) 0)
  xs = (if (gtn al bl) a b)
  ys = (if (gtn al bl) b a (y => ys => c => n => (c y ys)) (c => n => n))
  res = val => end =>
    (xs
      x => xst => ys => c =>
        y   = (ys y => ys => y 0)
        yst = (ys y => ys => ys c => n => n)
        sum = (add x (add y c))
        num = (mod sum md)
        cur = (flr (div sum md))
        (val num (xst yst cur))
      ys => c =>
        (if (gtn c 0) (val c end) end)
      ys
      0)
  (bigNor res)
