// Test this with `moon runIO _examples_`

do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX

askPowerLevel = loop@ lazy =>
  | power =< (do "prompt" "What is your power level? ")
    (if (gtn (stn power) 9000)
      | (do "print" "No, it is not.")>
        (loop 0)
      | (do "print" "Ah, that's cute!")>
        (do "stop"))

(askPowerLevel 0)
