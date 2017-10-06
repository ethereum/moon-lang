sequence = zb2rhZgqcdZbigz6FP1sCiX7tYTHhiTrNjGvi3Cmg9SuHn36Y
toList = zb2rhndupPgo24A1s5wZQY2Mvi6a2Kd4SbFxdTTmciR34ZhCZ
fromList = zb2rhj3APjEyBffYfDUhef71pdkvq8N5HkixVN1hmCacPXJth

// [(Statement a)] -> Statement [a]
//   Given an array of statements that produce `t`, returns a statement that runs
//   those statements, collects the results, and produces an array of `t`.
statementsArray => cont =>
  statements = (toList statementsArray)
  results = <(sequence statements)
  (cont (fromList results))
