case = zb2rhbksBjR3yFP98YrEGss6Yv7wVCgNbYtWiwz9nGRSAoiAa
match = zb2rhoexKPhLaQGMSVjrSsRaz56U8RZYkUBUJKPDPNLqYWHw8

side => length => value => list =>
  state = {
    values: (match list)
    result: val => end => end
  }
  result = (for 0 length state i => state =>
    values = (get state "values")
    result = (get state "result")
    (case values {
      val: x => xs =>
        {
          values: xs
          result: val => end => (if side
            (result val (val x end))
            (val x (result val end)))
        }
      end:
        {
          values: val => end => end
          result: val => end => (if side
            (result val (val value end))
            (val value (result val end)))
        }
    })
  )
  (get result "result")
