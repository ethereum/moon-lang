listEnd = zb2rhbQFhrUA2SqQVKweLeRoHomXzJwAsKLtKT2TjW7Eunk6x
listPush = zb2rhm7iouD3mDjvkxH3xRepqqAPcLHsaLQVHJWXVCpFPhgMP 

// List (Statement t) -> Statement (List t)
//   Given an list of statements that produce `t`, returns a statement that runs
//   those statements, collects the results, and produces an list of `t`.
actions => cont =>

  foldVal = action => rest => list =>
    val = <action
    (rest (listPush val list))

  foldEnd = list => (cont list)

  (actions foldVal foldEnd listEnd)
