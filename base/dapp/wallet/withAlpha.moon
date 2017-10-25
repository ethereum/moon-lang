color => alpha =>
  (con
    (con
      (con
        (con
          "rgba("
          (slc color 4 (sub (len color) 1))
        )
        ","
      )
      (nts alpha)
    )
    ")"
  )
