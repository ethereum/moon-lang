bigQtrNum = zb2rhmNLxRXARDMEjT6DcBFMWenraake4u3vv6cWXG1FBssk1
bigGtnZero = zb2rhhWsyoJp669c7e2bMganHQR7gYFGU67eEiHUbeLLwKJxX

listSingle = zb2rhivi1RLszWdNEMezzWzhzrDqB6ionDyjRjFukKMDLoMFb
listConcat = zb2rheicGSCKD9rQ8LghijJww9sjEGDgUMANMX9dBZJB5vgdb
listEnd = zb2rhbQFhrUA2SqQVKweLeRoHomXzJwAsKLtKT2TjW7Eunk6x

// Uint16 -> Big -> List Uint16
// Converts a bigNum to any base N (max 2^16).
// Most significant digit first (as opposed to BigNum's format).
base =>
  getDigits @ big =>
    (if (bigGtnZero big)
      qtr = (bigQtrNum big base)
      rem = (get qtr "rem")
      quo = (get qtr "quo")
      (listConcat (getDigits quo) (listSingle rem))
      listEnd)
