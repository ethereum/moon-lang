num => bits =>
  (flr (div (mod num #(pow 2 32)) (pow 2 bits)))
