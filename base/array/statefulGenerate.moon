from => til => initialState => fn =>
  (gen append => empty =>
    pair = {
      array: (append "length" (sub til from) empty)
      state: initialState
    }
    result = (for from til pair i => pair =>
      state = (get pair "state")
      array = (get pair "array")
      nexts = (fn state)
      {
        state: (get nexts "state")
        array: (append (nts i) (get nexts "value") array)
      })
    (get result "array"))
