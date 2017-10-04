char => string =>
  l = (len string)
  (for 0 l -1 i => idx =>
    (if (and (eql idx -1) (cmp (slc string i (add i 1)) char)) i idx))

