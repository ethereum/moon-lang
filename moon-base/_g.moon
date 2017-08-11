atl: arrayToList
lta: listToArray
aRange: from. til. (lta (listRange from til))
aSum: a. (listSum (atl a))
aFlatMap: f. a. (lta (listFlatMap x.(atl (f x)) (atl a))) 
(aSum (aFlatMap x.[x x x] (aRange 0 20)))
