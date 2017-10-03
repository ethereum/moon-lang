listToArray = zb2rhj3APjEyBffYfDUhef71pdkvq8N5HkixVN1hmCacPXJth

str =>
  l = (len str)
  (listToArray val => end =>
    (for 0 l end n => list =>
      i = (sub (sub l n) 1)
      (val (slc str i (add i 1)) list)))
