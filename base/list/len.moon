-- length of fiven list
this :
  ((a -> b -> b) -> b -> b) -> Int

this =
  xs =>
    (xs h => (add 1) 0)

-- EXAMPLES --

(len end) == 0
(len (val 1 (val 2 end))) == 2