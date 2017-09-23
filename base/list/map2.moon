-- applies function to each element: (function elemOfList1 elemOfList2)

this :
  List = a => b => ((a -> b -> b) -> b -> b)

  (a -> b -> c) -> (List a x) -> (List b x) -> (List c x)

this = 
  f => xs => ys =>
    val => end =>
      (xs
        x => xs => c => (c x xs)
        c => end
        (ys
          y => ys => x => xs => (val (f x y) (xs ys))
          x => xs => end))

-- EXAMPLES --

(this add (val 2 end) (val 3 end)) == (val 6 end)
(this mul (val 2 (val 3 end)) (val 4 end)) == (val 8 end)