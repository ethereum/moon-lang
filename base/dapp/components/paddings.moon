top => right => bottom => left => child =>
  my =>
    t = top
    r = right
    b = bottom
    l = left
    w = (get (my "size") "0")
    h = (get (my "size") "1")
    {
      pos: [l t]
      size: [(sub w (add l r)) (sub h (add t b))]
      child: child 
    }
