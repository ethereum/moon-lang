{
  args: {
    fst: "A"
    snd: "B"
    sep: 0.5
  }

  value: my =>
    min = a => b => (if (ltn a b) a b)
    w = (get (my "size") "0")
    h = (get (my "size") "1")
    sep = (my "sep")
    fst = (my "fst")
    snd = (my "snd")
  
    fstTitle = {
      size:[(mul w sep) h]
      font:{color:"rgb(130,124,124)"}
      value:fst
    }

    sndTitle = {
      pos:[(mul w sep) 0]
      size:[(mul (sub 1 w) sep) h]
      font:{color:"rgb(156,148,148)", weight:300}
      value:snd
    }

    [fstTitle sndTitle]
}
