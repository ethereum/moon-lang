-- applies function to each element
this :
  List = a => b => 
    ((a -> b -> b) -> b -> b)

     (List a c)
  -> (a -> b)
  -> (List b c)

this =
  f => xs =>
    val => (xs end => (val (f end)))

-- EXAMPLES --

(map (add 1) end) == end
(map (add 1) (val 1 (val 2 (val 5 end)))) == (val 2 (val 3 (val 6 end)))