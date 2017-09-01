c16ToNum = zb2rhadpYJs36VGcrbN1TPXkXiwZL2LLPMRL6uwSD2fki3cho

getU4 = hex => n => m =>
  start = (sub (mod (add (len hex) 5) 8) 5)
  i = (add (add start (mul n 8)) (sub 7 m))
  (c16ToNum (slc hex i (add i 1)))

getU32 = hex => n =>
  a = (mul (getU4 hex n 0) 1)
  b = (mul (getU4 hex n 1) 16)
  c = (mul (getU4 hex n 2) 256)
  d = (mul (getU4 hex n 3) 4096)
  e = (mul (getU4 hex n 4) 65536)
  f = (mul (getU4 hex n 5) 1048576)
  g = (mul (getU4 hex n 6) 16777216)
  h = (mul (getU4 hex n 7) 268435456)
  (add a (add b (add c (add d
  (add e (add f (add g (add h 0))))))))

ceil = x =>
  f = (flr x)
  (if (eql x f) f (add f 1))

hex => cons => nil =>
  u32s = (ceil (div (sub (len hex) 2) 8))
  (for 0 u32s nil n =>
    (cons (getU32 hex n)))
