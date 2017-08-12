depth. gtn. lis.
  
  merge: a. b.
    go: go@ r. aas. bbs.
      case_as_bs: a. as. b. bs.
        (if (gtn a b)
          (go (slistCons b r) (slistCons a as) bs)
          (go (slistCons a r) as (slistCons b bs)))
      case_as_nil: a. as.
        (go (slistCons a r) as slistNil)
      case_nil_bs: b. bs.
        (go (slistCons b r) slistNil bs)
      case_nil_nil:
        (slistReverse r)
      (aas a. as.
        (bbs (case_as_bs a as) (case_as_nil a as))
        (bbs case_nil_bs case_nil_nil))

    (go slistNil a b)

  split: split@ d. lis.
    case_0: Lazy.
      case_xs: x. xs. t. (t (slistCons x slistNil) xs)
      case_nil: t. (t (slistCons 0 slistNil) slistNil)
      (lis case_xs case_nil)
    case_N: Lazy.
      (split (sub d 1) lis lef. lis.
      (split (sub d 1) lis rig. lis.
      t. (t (merge lef rig) lis)))
    (if (eql d 0) (case_0 x.x) (case_N x.x))

  (split depth lis res. lis. res)
