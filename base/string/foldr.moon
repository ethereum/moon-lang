val => end => string =>
  l = (len string)
  res = val => end => end
  list = (for 0 l res i => res =>
    val => end => (res val (val (slc string i (add i 1)) end)))
  (list val end)
