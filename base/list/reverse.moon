-- reverses a list

this :
     ((a -> b -> b) -> b -> b)
  -> ((a -> b -> b) -> b -> b)

this =
  list =>
    (list
      x => xs => c => n => (xs c (c x n))
      cons => nil => nil)

-- EXAMPLES --

(this end) == end
(this (val 1 (val 2 end))) == (val 2 (val 1 end))