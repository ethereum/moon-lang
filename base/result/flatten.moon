success = ...
failure = ...

result =>
  (result
    fail => (failure fail)
    result => (result
      fail => (failure fail) 
      succ => (success succ)))