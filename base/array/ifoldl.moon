snoc => nil => array =>
  length = (get array "length")
  (for 0 length nil i => result =>
    (snoc result i (get array (nts i))))
