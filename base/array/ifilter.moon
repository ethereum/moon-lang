cond => array =>
  len = (get array "length")
  (gen append => empty =>
    res = (for 0 len {len:0 arr:empty} i => state => 
      len = (get state "len")
      arr = (get state "arr")
      val = (get array (nts i))
      (if (cond i val)
        {
          len: (add len 1)
          arr: (append (nts len) val arr)
        }
        {
          len: len
          arr: arr
        }
      )
    )
    (append "length" 
      (get res "len")
      (get res "arr"))
  )
