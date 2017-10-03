bytes => from => til =>
  (con "0x" (slc bytes 
    (add 2 (mul from 2))
    (add 2 (mul til 2))))
