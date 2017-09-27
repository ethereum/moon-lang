shiftl = zb2rhd6DVDef1HudHiUoSefZysEkRDL8vdtRmta9KbgyoRw8n

data =>
  (for 0 (get data "length") [0 0 0 0] i => seed =>
    m = (mod i 4)
    f = n =>
      (if (eql m n) 
        v = (get seed (nts m))
        (add
          (sub (shiftl v 5) v)
          (get data (nts i)))
        (get seed (nts n)))
    [(f 0) (f 1) (f 2) (f 3)])
