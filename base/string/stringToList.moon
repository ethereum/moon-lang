str => val => end =>
  (for 0 (len str) end n =>
    i = (sub (len str) (add n 1))
    (val (slc str i (add i 1))))
