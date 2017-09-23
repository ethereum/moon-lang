-- creates a list with one element

this :
  a -> ((a -> b -> b) -> b -> b)

this =
  x => val => 
    end => (val x end)

-- EXAMPLES --

(this 1) == (val 1 end)