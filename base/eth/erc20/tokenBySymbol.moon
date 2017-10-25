tokenList = zb2rharZc7GhmUrL3oaZbDaqrpSh1Z6Efc4NVzaCPdPNkZ7Po
arrayFoldr = zb2rhbTuYiZm5fGUHUhd3sQNRDhEW6FVjXLp8UyWk5hE9nQ5F

symbol =>
  match = token => (cmp (get token "symbol") symbol)
  (arrayFoldr
    token => result => (if (match token) token result)
    (get tokenList "0")
    tokenList)
