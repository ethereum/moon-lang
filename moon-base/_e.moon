len: 1000
arrA: (arrayMap (mul 0.001) (arrayRange 0 len))
arrB: (arrayMap (mul 0.001) (arrayRange 0 len))
(for 0 len 0 #i. x.
  (add x (arrayDot arrA arrB)))
