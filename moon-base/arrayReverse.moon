array.
  len: (get array "length")
  (gen put.end.
    result: (put "length" len end)
    (for 0 len result i.result.
      val: (get array (nts i))
      idx: (sub (sub len i) 1)
      (put (nts idx) val result)))
