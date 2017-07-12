separator.
  (arrayIfoldr
    i. a. b.
      sep: (if (eql i 0) "" separator)
      (con (con sep a) b)
    "")
