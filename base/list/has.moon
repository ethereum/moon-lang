-- returns 1 if any element satisfies condition
this :
     ((a -> b -> b) -> b -> b)
  -> (a -> Int)
  -> Int

this =
  cond => list =>
    (list
      x => xs => i =>
        (if (cond x)
          1
          (xs (add i 1)))
      i => 0
      0)

-- EXAMPLES --

(has (eqv 3) (val 2 end)) == 0
(has (eqv 3) (val 3 end)) == 1