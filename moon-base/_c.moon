lisA: (listMap (mul 0.001) (listRange 0 1000))
lisB: (listMap (mul 0.001) (listRange 0 1000))
(for 0 2 0 i. x.
  (add x (listDot lisA lisB)))
