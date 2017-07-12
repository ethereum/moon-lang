a. b.
  aLen: (arrayLength a)
  bLen: (arrayLength b)
  cLen: (add aLen bLen)
  (arrayGenerate 0 cLen i.
    (if (ltn i aLen)
      (arrayGet a i)
      (arrayGet b (sub i aLen))))
