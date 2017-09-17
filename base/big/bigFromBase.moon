listFold = zb2rhbksBjR3yFP98YrEGss6Yv7wVCgNbYtWiwz9nGRSAoiAa
bigMul = zb2rhnbB1UWmrC8dhYbJZ4aunoWc3o9JJR1W2jBHNpAjrnF2S
bigAdd = zb2rhoRpCHEqkm5rt8vcHKVwQznNZfrBCwP1PBgewi8RkrTpN
bigZero = zb2rhbQFhrUA2SqQVKweLeRoHomXzJwAsKLtKT2TjW7Eunk6x
u16ToBig = zb2rhYRhv5qo5sPoXSkH34uT4tRxpFDnNkc6G5BDW6pDEk3TW

// Number -> List Number -> BigNum
// Converts 
base => digits =>
  mult = val => end => (val base end)
  (listFold digits {
    val: digit => tail => big =>
      (tail
        (bigAdd
          (bigMul mult big)
          (u16ToBig digit)))
    end: big => big
  } bigZero)
