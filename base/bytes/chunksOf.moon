bytesLength = zb2rhbRAVvyLUE9tCysrnWvP7guviTgXQWzcK41KocGrhnvnH
bytesSlice = zb2rhg1FpG1nrxVEGvjp1gfU2tCP9sRmXXL77HjL2qnCfjUmv
listToArray = zb2rhj3APjEyBffYfDUhef71pdkvq8N5HkixVN1hmCacPXJth

n => bytes =>
  l = (bytesLength bytes)
  empty = val => end => end
  list = (for 0 (div l n) empty i => list =>
    chunk = (bytesSlice bytes (mul i n) (mul (add i 1) n))
    val => end => (list val (val chunk end)))
  (listToArray list)
