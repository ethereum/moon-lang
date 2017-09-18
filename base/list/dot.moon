sum = zb2rhoMMnNH7etHbYEKmm2LVJJpuzSPUMfsy4R3jSpJtb5kiY
map2 = zb2rhiMYfSiFzn1dACqJz3cxS3oPCnRhDpoGAoiHrph7mkD6o

-- vector dot product
this :
  list = a => b => 
    ((a -> b -> b) -> b -> b)
     
  (list a b) -> (list a c) -> int

this =
  # a => b =>
    (sum
      (map2 (mul) a b))

-- EXAMPLES --

(this (val 2 end) end) == 0
(this end (val 2 end)) == 0
(this (val 3 (val 4 end)) (val 4 (val 3 end))) == 24