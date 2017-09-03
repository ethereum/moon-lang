f => xs => ys =>
  cons => nil =>
    (xs
      x => xs => c => (c x xs)
      c => nil
      (ys
        y => ys => x => xs => (cons (f x y) (xs ys))
        x => xs => nil))
