Result = zb2rhoUyznYMMESvXzRNDHjzwcxjaCQUvXcNcsm6o28uiu3xC
success = (Result "success")
failure = (Result "failure" "Could not parse : 'a' as Int")
recover = (Result "recover")
map  = (Result "map")
flatten = (Result "flatten")
flatMap = (Result "flatMap")

{
  success1: (success 1)
  success2: (map (add 1) (success 1))
  success3: (flatten (success (success 3)))
  success4: (flatMap (x => (success (add x 2))) (success 2))

  failure1: failure
  failure2: (map (add 1) failure)
  failure3: (flatten failure)
  failure4: (flatMap (x => (success (add x 2))) failure)

  integer1: (recover 1 failure)
  integer2: (recover 5 (success 2))
}