Big         = zb2rhkTU5jmEXQrpJJvyWxA4nerZQABKbBAYd28vkp7ftTHWE
badd        = (Big "add")
bcmp        = (Big "cmp")
bdiv        = (Big "div")
bdivNum     = (Big "divNum")
beql        = (Big "eql")
bfromBase   = (Big "fromBase")
bgtn        = (Big "gtn")
bgtnZero    = (Big "gtnZero")
bltn        = (Big "ltn")
bmod        = (Big "mod")
bmodNum     = (Big "modNum")
bmul        = (Big "mul")
bqtr        = (Big "qtr")
bqtrNum     = (Big "qtrNum")
bsub        = (Big "sub")
btoBase     = (Big "toBase")
btoBin      = (Big "toBin")
btoDec      = (Big "toDec")
btoHex      = (Big "toHex")
btoString   = (Big "toString")
bzero       = (Big "zero")
bfromBin    = (Big "fromBin")
bfromDec    = (Big "fromDec")
bfromHex    = (Big "fromHex")
bfromString = (Big "fromString")
big         = bfromString
dec         = btoDec

a = (big "111122223333444455556666777788889999")
b = (big "1000000000000000")
c = (big "2")

{
  add: (dec (badd b c))
  mul: (dec (bmul a b))
  sub: (dec (bsub b c))
  div: (dec (bdiv a b))
  mod: (dec (bmod a c))
}

