-- turns church list into scott list
this :
  List => a => b =>
    ((a -> b) -> ((List a b) -> b) -> b)

  ((a -> b -> b) -> b -> b) -> (List a b)

this =
  xs =>
    (xs
      x => xs => cons => nil => (cons x xs)
      cons => nil => nil)

-- EXAMPLES --

(this end) == end