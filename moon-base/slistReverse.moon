xs. 
  go: go@ r. lis.
    case_xs: x. xs. (go (slistCons x r) xs)
    case_nil: r
    (lis case_xs case_nil)
  (go slistNil xs)
