List = zb2rhn9hxhbQp3UYpciYJSJzePFMibeWZaQXJsDV3wGkLmAXX
val = (List "val")
end = (List "end")
a = (val 1 (val 2 (val 3 (val 4 end))))
b = (val 5 (val 6 (val 7 (val 8 end))))
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
