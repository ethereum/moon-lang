-- concatenates two lists
this :
  list = a => b => 
    ((a -> b -> b) -> b -> list a b)
  (list a b)
  -> (list a c)
  -> (list a c)

this =
  xs => -- list
  ys => -- list
    val => end => (xs val (ys val end))

-- EXAMPLES --

(this end end) == end
(this end (val 1 end)) == (val 1 end)
(this (val 1 end) end) == (val 1 end)
(this (val 1 end) (val 2 end)) == (val 1 (val 2 end))