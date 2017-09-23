-- pattern match on scott list
this :
     (list a b = (a -> b -> b) -> b -> list a b)
  -> {val: a -> b -> b, end: b}
  -> b

this =
  xs => -- list
  cases => -- map
    (xs
      (get cases "val")
      (get cases "end"))

-- EXAMPLES --

plus = {val: add end: 0}
this end plus == 0
this (val 2 end) plus == 2