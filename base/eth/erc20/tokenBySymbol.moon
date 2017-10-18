tokenList = zb2rhiiq8LhauWFmAQtMNmyaDbWKYtBaxc7wGg1hAESY5Vnp6
arrayFoldr = zb2rhbTuYiZm5fGUHUhd3sQNRDhEW6FVjXLp8UyWk5hE9nQ5F

symbol =>
  match = token => (cmp (get token "symbol") symbol)
  (arrayFoldr
    token => result => (if (match token) token result)
    (get tokenList "0")
    tokenList)
