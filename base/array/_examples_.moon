Array = zb2rhYmsjmQuJivUtDRARcobLbApVQZE1CwqhfnbBxmYuGpXx
a = [1 2 3 4]
b = [5 6 7 8]
{
  get: (Array "get" a "0")
  concat: (Array "concat" a b)
  dot: (Array "dot" [3 4 0] [3 4 0])
  flatMap: (Array "flatMap" (Array "reverse") [[1 2] [3 4] [5 6]])
  foldr: (Array "foldr" (add) 0 a)
  join: (Array "join" "-" ["foo" "bar" "tic" "tac"])
  map: (Array "map" (add 1) a)
  range: (Array "range" 0 6)
  reverse: (Array "reverse" a)
  sum: (Array "sum" a)
  toList: (Array "toList" a)
  zipWith: (Array "zipWith" (add) a b)
}
