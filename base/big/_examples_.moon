Big = zb2rhbsd5hP78n8FFzPjW2pDWE7ynQ6zb6Zb5ZAesgoTrJMd3
bmul = (Big "mul")
badd = (Big "add")
hex = (Big "toHex")
big = (Big "fromHex")

a = (big "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef")
b = (big "0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff")

{
  add: (hex (badd a b))
  mul: (hex (bmul a b))
}
