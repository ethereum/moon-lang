shiftl = zb2rhd6DVDef1HudHiUoSefZysEkRDL8vdtRmta9KbgyoRw8n
shiftr = zb2rhjBmuz6CmkbbzwtndbiietAq4jzi8JAxFoy1fUGDcxZeT
shifts = zb2rhmZsP7XnVfxshfnYVoNwHHSW1QKbozBQVFUBguctN9sxV
arrayFlatten = zb2rhdVyAPEmxC6Bumn8E4fh9aRKftYqR3FV5XxMgBHDnsuXU

seed = data =>
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
        
rand = seed =>
  a = (get seed "0")
  b = (get seed "3")
  t = (xor a (shiftl a 11))
  u = (xor (xor (xor b (shifts b 19)) t) (shifts t 8))
  s = [(get seed "1") (get seed "2") b u]
  r = (div u (pow 2 31))
  {seed:s rand:r}
    
rnd = cont => rnd => end =>
  (rnd r => (cont r rnd end))

end = result => rnd => end =>
  (end result)

runRand = seedData => program =>
  (program
    cont => seed =>
      rs = (rand seed)
      (cont (get rs "rand") (get rs "seed"))
    result => seed =>
      result
    (seed seedData))

generateRands = n => f => cont =>
  (gen val => end =>
    init = cont => (cont (val "length" n end))
    getter = (for 0 n init i => res =>
      cont => (rnd r => (res arr => 
        j = (sub (sub n i) 1)
        (cont (val (nts j) (f j r) arr)))))
    (getter cont))

createColor = cont =>
  h = (nts (flr (mul <rnd 360)))
  s = (con (nts (add (mul <rnd 60) 40)) "%")
  l = (con (nts (mul (add (add (add <rnd <rnd) <rnd) <rnd) 25)) "%")
  (cont (con (con (con (con (con (con "hsl(" h) ",") s) ",") l) ")"))

renderIcon = seedData => size => scale =>
  makeIcon = (|
    foreColor = <createColor
    backColor = <createColor
    spotColor = <createColor
    colors = [backColor foreColor spotColor]

    genBox = idx => rand =>
      i = (mod idx (div size 2))
      j = (flr (div idx (div size 2)))
      type = (flr (mul rand 2.3))
      color = (get colors (nts type))    
      box = i => 
        {
          pos: [(mul i scale) (mul j scale)]
          size: [scale scale]
          background: color
          value: ""
        }
      [(box i) (box (sub (sub size i) 1))]
        
    imageData = <(generateRands (div (mul size size) 2) genBox)

    (end imageData))

  (runRand seedData makeIcon)

addresses = [
  "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359"
  "0x554f8e6938004575bd89cbef417aea5c18140d92"
  "0xcc6294200fa6e6eb5c3034ed6b0b80401f5b0ceb"
  "0xbb9bc244d798123fde783fcc1c72d3bb8c189413"
  "0x6090a6e47849629b7245dfa1ca21d94cd15878ef"
  "0x314159265dd8dbb310642f98f50c066173c1259b"
  "0xd1ccfbf0a0dc2a9ed8a496b07e81dd8ecd7cb00e"
  "0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb"
]


chrToNum = zb2rhfBJs8FuBmPT9VjZLPpg2MS7H1jGSFc5MWSP9kKwYD5Pq
stringToArray = zb2rheU6sxw6S9Ustj4F6EYgP8niDse1ukopDWfrH88xcrAA2
arrayMap = zb2rhgW1F8GpBDCtoXjEcqDBFXNiCDaPNt1fekX2Po8uHWiEV

addressToBlockies = address => 
  bytes = (arrayMap chrToNum (stringToArray address))
  (renderIcon bytes 8 8)

(addressToBlockies (get addresses "0"))

//seedData = [48 120 102 98 54 57 49 54 48 57 53 99 97 49 100 102 54 48 98 98 55 57 99 101 57 50 99 101 51 101 97 55 52 99 51 55 99 53 100 51 53 57]
