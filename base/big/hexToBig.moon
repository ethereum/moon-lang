nibToNum = zb2rhadpYJs36VGcrbN1TPXkXiwZL2LLPMRL6uwSD2fki3cho

getU4 = hex => n => m =>
  start = (sub (mod (add (len hex) 1) 4) 1)
  i = (add (add start (mul n 4)) (sub 3 m))
  (nibToNum (slc hex i (add i 1)))

getU16 = hex => n =>
  a = (mul (getU4 hex n 0) 1)
  b = (mul (getU4 hex n 1) 16)
  c = (mul (getU4 hex n 2) 256)
  d = (mul (getU4 hex n 3) 4096)
  (add a (add b (add c (add d 0))))
  
ceil = x =>
  f = (flr x)
  (if (eql x f) f (add f 1))

hex => cons => nil =>
  u16s = (ceil (div (sub (len hex) 2) 4))
  (for 0 u16s nil n =>
    (cons (getU16 hex n)))
