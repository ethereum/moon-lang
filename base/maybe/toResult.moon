Result = zb2rhoUyznYMMESvXzRNDHjzwcxjaCQUvXcNcsm6o28uiu3xC
failure = (Result "failure")
success = (Result "success")

message => maybe =>
  (maybe
    (failure message)
    x => (success x))