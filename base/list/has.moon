cond => list =>
  (list
    x => xs => i =>
      (if (cond x)
        1
        (xs (add i 1)))
    i => 0
    0)
