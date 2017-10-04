//0.01234 -> 0.01
//0.12345 -> 0.12
//1.23456 -> 1.23
//12.3456 -> 12.3
//123.456 -> 123
//1234.56 -> 1.2k 
//12345.6 -> 12k
//1234567 -> 123k

num =>
  u = digits => (slc (nts num) 0 digits)
  k = digits => (con (slc (nts (div num 1000)) 0 digits) "k")
  (if (ltn num 100)
    (u 4)
    (if (ltn num 1000)
      (u 3)
      (if (ltn num 10000)
        (k 3) 
        (if (ltn num 100000)
          (k 2)
          (if (ltn num 1000000)
            (k 3)
            ">1m")))))
