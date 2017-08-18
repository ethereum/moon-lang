ifoldr = zb2rhXLdKusfYqBUMf1PTKp29ZZdEgV6GWftDBFBrr7EssWFj
separator =>
  (ifoldr
    i => a => b =>
      sep = (if (eql i 0) "" separator)
      (con (con sep a) b)
    "")
