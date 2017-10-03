listToArray = zb2rhj3APjEyBffYfDUhef71pdkvq8N5HkixVN1hmCacPXJth

sep => str =>
  sepLen = (len sep)
  strLen = (len str)
  state = {
    list: val => end => end
    next: ""
  }
  result = (for 0 strLen state i => state =>
    char = (slc str i (add i 1))
    list = (get state "list")
    next = (get state "next")
    (if (cmp char sep)
      {
        list: val => end => (list val (val next end))
        next: ""
      }
      {
        list: list
        next: (con next char)
      }))
  list = val => end =>
    list = (get result "list")
    next = (get result "next")
    (list val (val next end))
  (listToArray list)
