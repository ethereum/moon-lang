side => length => chr => str =>
  (for 0 (sub length (len str)) str i => str =>
    (if side
      (con str chr)
      (con chr str)))
