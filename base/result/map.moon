failure = ...
success = ...

fun => result =>
  (result
    fail => (failure fail)
    succ => (success (fun succ)))
    