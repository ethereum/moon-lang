num =>
  (for 0 16 "" i => str =>
    dig = (mod (flr (mul num (pow 10 (sub i 7)))) 10)
    dot = (if (eql i 8) "." "")
    hid = (and (ltn i 7) (or (eql i 0) (cmp (slc str (sub i 1) i) " ")))
    chr = (if (and (eql dig 0) hid) " " (nts dig)) 
    (con str (con dot chr)))
