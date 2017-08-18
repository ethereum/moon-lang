cons => nil => array =>
  len = (get array "length")
  (for 0 len nil i => result =>
    idx = (sub (sub len i) 1)
    val = (get array (nts idx))
    (cons idx val result))
