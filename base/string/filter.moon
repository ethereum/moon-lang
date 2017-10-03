cond => str =>
  (for 0 (len str) "" i => result =>
    char = (slc str i (add i 1))
    (if (cond char)
      (con result char)
      result))
