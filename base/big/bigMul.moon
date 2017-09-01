bigAdd = zb2rhepNmCQ442JvTsGa9C6dhtHU3kzfwDJuMEC8LCc7nNNT8

// (ay B + ax) * (by B + bx) = (ay by B B + ay bx B + ax by B + ax bx) 
mulU32 = a => b =>
  md = (pow 2 16)
  ax = (mod a md)
  bx = (mod b md)
  ay = (flr (div a md))
  by = (flr (div b md))
  yx = (mul ay bx)
  xy = (mul ax by)
  v0 = c => n => (c 0 (c (mul ay by) n))
  v1 = c => n => (c (mul (mod yx md) md) (c (flr (div yx md)) n))
  v2 = c => n => (c (mul (mod xy md) md) (c (flr (div xy md)) n))
  v3 = c => n => (c (mul ax bx) n)
  (bigAdd (bigAdd v0 v1) (bigAdd v2 v3))

shift = v => c => n =>
  (c 0 (v c n))

zero = c => n =>
  (c 0 n)

a => b =>
  (a
    x => xs => xf =>
      (bigAdd
        (b
          y => ys => yf =>
            (bigAdd
              (xf (yf (mulU32 x y)))
              (ys v => (shift (yf v))))
          yf => zero
          v => v)
        (xs v => (shift (xf v))))
    xf => zero
    v => v)
