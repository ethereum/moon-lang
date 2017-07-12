fn. xs. ys.
  len: "length"
  (gen c.n.
    lim: (get xs len)
    ini: (c len lim n)
    (for 0 lim ini i.a.
      k: (nts i)
      g: a.(get a k)
      (c k (fn (g xs) (g ys)) a)))

