// The `Do` constructor, as described on _docs_.md.

method =>
  (if (cmp method "stop")
    do => (do "stop")
    (if (cmp method "return")
      result => do => (do "return" result)
      arg => cont => do => (do method arg then => (cont then do))))


