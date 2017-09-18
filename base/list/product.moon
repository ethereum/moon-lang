-- product of list
this :
  ((a -> b -> b) -> b -> b) -> Int

this =
  xs =>
    (xs (mul) 1)

-- EXAMPLES --

(this end) == 1
(this (val 2 (val 3 end))) == 6