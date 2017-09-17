bigFromBase = zb2rhYk9mrwopYCLf34k2jNz3gqnAB26D5wAm3pkQJTfbUsLm
chrToNum = zb2rhfBJs8FuBmPT9VjZLPpg2MS7H1jGSFc5MWSP9kKwYD5Pq
listConcat = zb2rheicGSCKD9rQ8LghijJww9sjEGDgUMANMX9dBZJB5vgdb
listSingle = zb2rhivi1RLszWdNEMezzWzhzrDqB6ionDyjRjFukKMDLoMFb
listEnd = zb2rhbQFhrUA2SqQVKweLeRoHomXzJwAsKLtKT2TjW7Eunk6x

stringToNums = str =>
  (for 0 (len str) listEnd i => nums =>
    (listConcat nums (listSingle (chrToNum (slc str i (add i 1))))))

string =>
  prefix = (slc string 0 2)
  hex = (cmp prefix "0x")
  bin = (cmp prefix "0b")
  bas = (if hex 16 (if bin 2 10))
  str = (if (add hex bin) (slc string 2 (len string)) string)
  (bigFromBase bas (stringToNums str))
