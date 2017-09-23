flatten = zb2rhnd69Yr18ULbCzFHiX34a7WgpWyKYNcx4BtDmxy9Dvo4E
map = zb2rhbZGnAoSDjNLe77j7pB6FjKzH3xMbqR2gzApdUypDiWEa

-- maps function over list, then flattens it
this :
    list = a => b => 
      ((a -> b -> b) -> b -> b)
     (a -> b)
  -> (list (list a c) c)
  -> (list b c)

this =
  f => xs =>
    (flatten (map f xs))

-- EXAMPLE --

(this (add 1) (val (val 1 end) (val (val 2 end)) end)) == (val 2 (val 3 end))