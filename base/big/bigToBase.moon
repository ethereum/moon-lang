bigQtr = zb2rhijkwV5H4zWV2JcEN6ZUMPsGkaUqLBEfJ19SjAVJPFF63
bigGtn = zb2rhXKeedDmWEnTU43CQN2kspBaumzNigt2LESzTCn8RaQuA

f = base => a => cons => nil =>
  zero = c => n => (c 0 n)
  go = self @ a =>
    (if (bigGtn a zero)
      qtr = (bigQtr a base)
      (cons
        (get qtr "rem" a => b => a 0)
        (self (get qtr "quo")))
      nil)
  (go a)


Big = zb2rhfCCxE8jsua1CRigFVKZaGztxoY1PfNf7v89tCKWgW5W8
hex = (Big "hex")
big = (Big "big")

(f (big "0xa") (big "0x10000000000000000000000000000000000000000000000000000000000") a => b => s => (b (con (nts a) s)) s => s "")
