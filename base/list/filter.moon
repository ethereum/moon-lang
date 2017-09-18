-- removes all elements from list for which (f element) == 0
this :
  list = ((a -> b -> b) -> b -> b)
     (a -> int)
  -> list
  -> list

this =
  f => xs =>
    val => (xs x => xs => (if (f x) (val x xs) xs))

-- EXAMPLES --

(this (x => 1)) == (a => a)
(this (eqv 3) (val 2 (val 3 end))) == (val 2 end)