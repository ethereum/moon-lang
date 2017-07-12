cons. nil. array.
  len: (arrayLength array)
  (for 0 len nil i. result.
    idx: (sub (sub len i) 1)
    val: (arrayGet array idx)
    (cons idx val result))
