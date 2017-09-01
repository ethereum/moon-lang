List = zb2rhb1bXTJEohRcB5kgAb4zinkrunuzicKLbnM2rQ6rRbTur
cons = (List "cons")
nil = (List "nil")
a = (cons 1 (cons 2 (cons 3 (cons 4 nil))))
b = (cons 5 (cons 6 (cons 7 (cons 8 nil))))
{
  range: (List "range" 0 4)
  sum: (List "sum" a)
  filter: (List "filter" x => (gtn x 2) a)
  concat: (List "concat" a b)
  zipWith: (List "zipWith" (add) a b)
  sum: (List "sum" a)
  mul: (List "mul" a)
  reverse: (List "reverse" a)
  len: (List "len" a)
  match: (List "match" a h => t => h 0)
}
