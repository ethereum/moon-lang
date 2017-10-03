cons => nil => array =>
  length = (get array "length")
  (for 0 length nil i => result =>
    idx = (sub (sub length i) 1)
    val = (get array (nts idx))
    (cons idx val result))
