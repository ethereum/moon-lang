list =>
  (gen val => end => (list
    x => xs => i => (val (nts i) x (xs (add i 1)))
    i => (val "length" i end)
    0))
