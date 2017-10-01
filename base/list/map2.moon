f => xs => ys =>
  val => end =>
    (xs
      x => xs => c => (c x xs)
      c => end
      (ys
        y => ys => x => xs => (val (f x y) (xs ys))
        x => xs => end))
