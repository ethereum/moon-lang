shiftl = zb2rhd6DVDef1HudHiUoSefZysEkRDL8vdtRmta9KbgyoRw8n
shifts = zb2rhmZsP7XnVfxshfnYVoNwHHSW1QKbozBQVFUBguctN9sxV

seed =>
  a = (or (get seed "0") 0)
  b = (or (get seed "3") 0)
  t = (xor a (shiftl a 11))
  u = (xor (xor (xor b (shifts b 19)) t) (shifts t 8))
  s = [(or (get seed "1") 0) (or (get seed "2") 0) b u]
  r = (div u (pow 2 31))
  {seed:s rand:r}
