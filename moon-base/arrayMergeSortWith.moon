gtn. array.

  toSlist: array.
    (arrayToList array slistCons slistNil)

  fromSlist: lis.
    toList: lis. cons. nil.
      go: go@ lis. (lis h. t. (cons h (go t)) nil)
      (go lis)
    (listToArray (toList lis))

  depth: (flr (log 2 (get array "length")))

  (fromSlist (slistMergeSorterWith depth gtn (toSlist array)))
