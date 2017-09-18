concat = zb2rheicGSCKD9rQ8LghijJww9sjEGDgUMANMX9dBZJB5vgdb

-- concetanes lists in list
this :
  list = a => b => ((a -> b -> b) -> b -> b)

     (list (list a b) b)
  -> (list a b)

this =
  xs =>
    (xs concat val => end => end)

-- EXAMPLES --

(this (val (val 1 end) (val 2 end))) == (val 1 (val 2 end))