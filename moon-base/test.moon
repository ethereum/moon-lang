{
  "a": (arraySum [1,2,3,4])

  "c": |
    sub: <(fork ["A dog", "A ninja"]),
    vrb: <(fork ["has eaten", "attacked"])
    obj: <(fork ["my homework", "the enemy"])
    [(arrayJoin " " [sub, vrb, obj])]

  "d": 
    dot: ax. ay. az. bx. by. bz.
      (listSum
        (listZipWith x.y.(mul x y)
          (arrayToList [ax,ay,az])
          (arrayToList [bx,by,bz])))

    (dot 4 0 0 4 0 0)
}
