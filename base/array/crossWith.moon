generate = zb2rhgaF7EwthQmhaMMqTA5XZZJQyKbCzgRqKEKYHvC6ZXYJV
cons => nil => matrix =>
  w = (get matrix "length")
  h = (get (get matrix "0") "length")
  (generate 0 h i =>
    (for 0 w nil j =>
      (cons (get (get matrix (nts j)) (nts i)))))
