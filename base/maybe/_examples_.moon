Maybe = zb2rhcdVaM4fZsh6ZYrQ96BVnZ6DuhW7Xuw5jgMJdZHRbpbmp
some = (Maybe "some")
none = (Maybe "none")
recover = (Maybe "recover")
map  = (Maybe "map")
flatten = (Maybe "flatten")
flatMap = (Maybe "flatMap")

{
  some1: (some 1)
  some2: (map (add 1) (some 1))
  some3: (flatten (some (some 3)))
  some4: (flatMap (x => (some (add x 2))) (some 2))

  none1: none
  none2: (map (add 1) none)
  none3: (flatten none)
  none4: (flatMap (x => (some (add x 2))) none)

  integer1: (recover 1 none)
  integer2: (recover 5 (some 2))
}