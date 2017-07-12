snoc. nil. array.
  len: (get array "length")
  (for 0 len nil i.result.
    (snoc result i (arrayGet array i)))
