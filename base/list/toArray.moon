-- turns list into array

this :
  ((a -> b -> b) -> b -> b) -> Array a

this =
  list =>
    (gen val => end => (list
      x => xs => i => (val (nts i) x (xs (add i 1)))
      i => (val "length" i end)
      0))

-- EXAMPLES --

(this end) == []
(this (val 1 (val 2 end))) == [1, 2]