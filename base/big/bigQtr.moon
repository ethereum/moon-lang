bigCmp = zb2rheYfDrgCazTf5KETbxn3UniU4uTA9WTbX7rvXXpn58Ugh
bigMul = zb2rhmmjgCisMdEevm8iM53Rg1kWraiTsbyLuQwTajy1ZHyV6
bigSub = zb2rhYicog3wophhiMHETgWFzxz3srMk9MuSqjVhpv2mY6ZFe

// Big -> Big -> Uint16
findDigit = a => b =>
  state = {add: (pow 2 16) mul: (pow 2 16)}
  result = (for 0 17 state i => state =>
    add0 = (get state "add")
    mul0 = (get state "mul")
    mult = (bigMul b cons => nil => (cons mul0 nil))
    add1 = (div add0 2)
    mul1 = (bigCmp mult a (sub) (a=>b=>a) (add) mul0 add1)
    {mul:mul1 add:add1})
  (flr (get result "mul"))
 
a => b =>
  (a
    digit => state =>
      rem = c => n => (c digit (get state "rem" c n))
      dig = (findDigit rem b)
      quo = c => n => (c dig (get state "quo" c n))
      dif = (bigMul b (c => n => (c dig n)))
      {rem:(bigSub rem dif) quo:quo}
    {rem:c=>n=>n quo:c=>n=>n})
