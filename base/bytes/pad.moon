toChars = zb2rhaMdQ8hJqoDWED5Lu2wgnhB31FyjAXPfAq4m4EgMtwyUj
fromChars = zb2rhayYGSvpotezGtNkRDYQAmG519AdQu4evveFofiMZBA7T
length = zb2rhbRAVvyLUE9tCysrnWvP7guviTgXQWzcK41KocGrhnvnH

side => bytesLength => byte => bytes =>
  chars = (toChars bytes)
  byteChars = (slc (toChars byte) 0 2)
  padded = (for 0 (sub bytesLength (length bytes)) chars i => chars =>
    (if side
      (con chars byteChars)
      (con byteChars chars)))
  (fromChars padded)
