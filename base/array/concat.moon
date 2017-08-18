generate = zb2rhgaF7EwthQmhaMMqTA5XZZJQyKbCzgRqKEKYHvC6ZXYJV
len = zb2rhj31DmWEQi2c9stdR1r8wfFboPeFCEdXNysWKikEx3QHy
a => b =>
  aLen = (len a)
  bLen = (len b)
  cLen = (add aLen bLen)
  (generate 0 cLen i =>
    (if (ltn i aLen)
      (get a (nts i))
      (get b (nts (sub i aLen)))))
