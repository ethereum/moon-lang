{
  expansions:
    A: a. (add a a)
    B: a. b. (add #(A a) (A b))
    C: a. b. #(B a b)
    (eql (C (A 1) (B 1 2)) 16)
}
