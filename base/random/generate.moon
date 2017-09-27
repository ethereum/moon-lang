get = zb2rhaybqbxakAWqTWG8qL5vN3BjCV4qq5gGnASiP4esLgynp

n => f => cont =>
  (gen val => stop =>
    init = cont => (cont (val "length" n stop))
    getter = (for 0 n init i => res => cont => 
      r =< get
      arr =< res
      j = (sub (sub n i) 1)
      (cont (val (nts j) (f j r) arr)))
    (getter cont))
