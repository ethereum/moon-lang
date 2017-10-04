bytesLength = zb2rhbRAVvyLUE9tCysrnWvP7guviTgXQWzcK41KocGrhnvnH
toU8 = zb2rhkxTPQszUKVmTAb7TGA3jWpi6guRFTZ8LgZiQ23AKneo7

val => end => bytes =>
  l = (bytesLength bytes)
  res = val => end => end
  list = (for 0 l res i => res =>
    j = (add 2 (mul i 2))
    k = (add j 2)
    val => end => (res val (val (toU8 (con "0x" (slc bytes j k))) end)))
  (list val end)
