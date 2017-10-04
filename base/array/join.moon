ifoldr = zb2rhcw9WTW6XGdppMfUnQGz2na5VoCJRmjWyFAHkXaRHgDxs

separator =>
  (ifoldr
    i => a => b =>
      sep = (if (eql i 0) "" separator)
      (con (con sep a) b)
    "")
