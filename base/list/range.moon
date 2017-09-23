-- creates a sequence of numbers
this :
  Int -> Int -> ((Int -> b -> b) -> b -> b)

this =
  from => til =>
    val => end =>
      (for from til end i =>
        (val (sub (add from til) (add i 1))))

-- EXAMPLES --

(this 1 1) == end
(this 1 3) == (val 1 (val 2 (val 3 end)))