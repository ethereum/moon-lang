failure = zb2rhcJzepPeuU1t1ffKs5gf33jZNcqaTXU5T89q1NSpLdPMs
success = zb2rhWiKkBV3i9rWkEenNLnjyG1rGaRYALNXMkBs9SWf5utYJ

fun => result =>
  (result
    fail => (failure fail)
    succ => (success (fun succ)))
    