array =>
  length = (get array "length")
  (gen put => end =>
    result = (put "length" length end)
    (for 0 length result i => result =>
      val = (get array (nts i))
      idx = (sub (sub length i) 1)
      (put (nts idx) val result)))
