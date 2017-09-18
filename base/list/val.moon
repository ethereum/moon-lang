-- List constructor

this :
  a -> ((a -> b -> b) -> b -> b) -> ((a -> b -> b) -> b -> b)

this =
  x => xs =>
    val => end => (val x (xs val end))

-- EXAMPLES --

(val 1 end) == (one 1)