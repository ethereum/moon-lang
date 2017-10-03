fn => xs => ys =>
  (gen c => n =>
    lim = (get xs "length")
    ini = (c "length" lim n)
    (for 0 lim ini i => a =>
      k = (nts i)
      g = a => (get a k)
      (c k (fn (g xs) (g ys)) a)))
