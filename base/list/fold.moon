-- reduces list with a given function
this :
     ((a -> b -> b) -> b -> b)
  -> {val : (a -> b -> b)  end : b}
  -> b

this =
  xs => cases =>
    (xs
      (get cases "val")
      (get cases "end"))

-- EXAMPLES --

plus = {val: add  end: 0}
(this plus end) == 0
(this plus (val 2 (val 3 end))) == 5