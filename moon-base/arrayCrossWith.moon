cons. nil. matrix.
  w: (get matrix "length")
  h: (get (get matrix "0") "length")
  (arrayGenerate 0 h i.
    (for 0 w nil j. 
      (cons (get (get matrix (nts j)) (nts i)))))
