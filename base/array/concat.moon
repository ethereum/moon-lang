arrayGenerate = zb2rhchsqGDzj5UBppkaEa9wm1H5n6VvVgQkHq6ryvFdKXWh8
arrayLength = zb2rhj31DmWEQi2c9stdR1r8wfFboPeFCEdXNysWKikEx3QHy
a => b =>
  aLength = (arrayLength a)
  bLength = (arrayLength b)
  cLength = (add aLength bLength)
  (arrayGenerate 0 cLength i =>
    (if (ltn i aLength)
      (get a (nts i))
      (get b (nts (sub i aLength)))))
