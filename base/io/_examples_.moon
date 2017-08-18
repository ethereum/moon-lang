io     = zb2rhdn7aJnH47c6oykLN2p5Jt93duP5s2CZt1sr2evw5FW9H
run    = (io "run")
prompt = (io "prompt")
print  = (io "print")
end    = (io "end")

askPowerLevel = repeat@ f =>
  | power =< (prompt "What is your power level? ")
    (if (gtn (stn power) 9000)
      | (print "No, it is not.")>
        (repeat f)
      | (print "Ah, that's cute!")>
        end)

(run (askPowerLevel {}))
