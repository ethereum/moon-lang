bigCmp = zb2rhb6YKkXTWP2SCqP9kq5hdGNvkmjZT4d42YLF9VNu34yXC
bigMul = zb2rhnbB1UWmrC8dhYbJZ4aunoWc3o9JJR1W2jBHNpAjrnF2S
bigSub = zb2rhecvjCY6eL7ixvBWQnpjECGYEoHNZGWKLA7KfCQrwMEin

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
