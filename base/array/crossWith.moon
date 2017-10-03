generate = zb2rhchsqGDzj5UBppkaEa9wm1H5n6VvVgQkHq6ryvFdKXWh8
cons => nil => matrix =>
  w = (get matrix "length")
  h = (get (get matrix "0") "length")
  (generate 0 h i =>
    (for 0 w nil j =>
      (cons (get (get matrix (nts j)) (nts i)))))
