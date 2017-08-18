io = zb2rhaz1mri11t28zguorHncAG9SXZmn47Kh9ow1QjsfeKzbT
prompt = (io "prompt")
print = (io "print")

(io "do"
  go = askPowerLevel =>
    | power =< (io "prompt" "What is your power level? ")
      (if (gtn (stn power) 9000)
        | (io "print" "No, it is not.")>
          (askPowerLevel askPowerLevel)
        | (io "print" "Ah, that's cute!")>
          (io "end"))
  (go go))
