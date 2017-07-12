fib: rec@ n.
  (if (gtn n 1)
    (add (rec (sub n 1)) (rec (sub n 2)))
    n))

(fib 40)
