stringToArray = zb2rheU6sxw6S9Ustj4F6EYgP8niDse1ukopDWfrH88xcrAA2
arrayMap = zb2rhgW1F8GpBDCtoXjEcqDBFXNiCDaPNt1fekX2Po8uHWiEV

address => 
  toSeedByte = chr =>
    (if (cmp chr "0") 48
    (if (cmp chr "1") 49
    (if (cmp chr "2") 50
    (if (cmp chr "3") 51
    (if (cmp chr "4") 52
    (if (cmp chr "5") 53
    (if (cmp chr "6") 54
    (if (cmp chr "7") 55
    (if (cmp chr "8") 56
    (if (cmp chr "9") 57
    (if (cmp chr "x") 120
    (if (cmp chr "a") 97
    (if (cmp chr "b") 98
    (if (cmp chr "c") 99
    (if (cmp chr "d") 100
    (if (cmp chr "e") 101
    (if (cmp chr "f") 102
    (if (cmp chr "A") 97
    (if (cmp chr "B") 98
    (if (cmp chr "C") 99
    (if (cmp chr "D") 100
    (if (cmp chr "E") 101
    (if (cmp chr "F") 102
    48)))))))))))))))))))))))
  (arrayMap toSeedByte (stringToArray address))
