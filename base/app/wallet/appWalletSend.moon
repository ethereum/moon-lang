title = zb2rhgVxRuCMyiunDuRaMtFCFEfqNU3CRqz1SzSa2EpCACRfD
label = zb2rhcoC7ABP6T3q2AhqmUY47SXCc7d8fGHYkGL9UWioaamBU
input = zb2rhj5aJtA5SmuhvSpofhmEgdusQoNopMSSAkZ4oaNh5gGU3
addressInput = zb2rhmonUevMWWPgmqHPJ2jhrCZv2XLHnL6WzQFgxj4fAChrJ

sendApp = my =>
  w = (get (my "size") "0")
  h = (get (my "size") "1")
  {
    name: "ethereum-wallet-send"
    state: {
      from: ""
      to: ""
      amount: ""
      result: ""
      sendAll: 0
    }
    pos: [0 0]
    size: [w h]
    font:{family:"helvetica"}
    background:"rgb(250,250,250)"
    value: my =>
      state = (my "state")
      size = (my "size")
      w = (get size "0")
      h = (get size "1")

      update = key => val =>
        refresh = k => (if (cmp key k) val (get state k))
        {
          from: (refresh "from")
          to: (refresh "to")
          amount: (refresh "amount")
          result: (refresh "result")
          sendAll: (refresh "sendAll")
        }

      titleBar = {
        pos: [60 43]
        size: [232 32]
        value: title
        set: {sep: 0.32 fst: "Send" snd: "Transaction"}
      }

      labelText = {weight: "bold" color:"rgb(130,124,124)"}

      addressBox = y => updateAddress => addressName => addressLabel =>
        {
          pos: [60 y]
          size: [470 66]
          font: labelText
          onHear: from => do => end => (do "setState" (updateAddress from) then => (end 0))
          name: addressName
          value: label
          set: {
            label: addressLabel
            thing: addressInput
          }
        }

      fromBox = (addressBox 95 (update "from") "from" "FROM")

      toBox = (addressBox 191 (update "to") "to" "SEND TO")

      amountBox = {
        pos: [60 324]
        size: [160 66]
        onHear: amount => do => end => (do "setState" (update "amount" amount) then => (end 0))
        font: labelText
        value: label
        set: {
          label: "AMOUNT"
          type: "number"
          thing: input
        }
      }

      unitBox = {
        pos: [(add 60 (add w 8)) 280]
        size: [(sub w 8) 66]
        value: label
        set: {
          label: ""
          thing: 
            {
              font:{color:"rgb(120,120,120)"}
              value: my =>
                w = (get (my "size") "0")
                h = (get (my "size") "1")
                y = 6
                h2 = (sub h (mul y 2))
                w2 = (div w 2)
                [
                  {
                    pos:[0 y]
                    size:[w2 h2]
                    value:"Ξ ETHER"
                  }
                  {
                    pos:[w2 y]
                    size:[w2 h2]
                    font:{align:"right"}
                    value: 
                      (con (con (slc (nts (stn (get state "amount"))) 0 10) " ") "ETHER")
                  }
                ]
            }
        }
      }

      sendAllBox = {
        pos: [60 422]
        size: [105 20]
        name: "ethere-wallet-send-all"
        state: 0
        value:
          [
            {
              pos: [0 0]
              size: [20 20]
              background: "rgb(241, 241, 241)"
              cursor: "pointer"
              onClick: do => end => (do "setState" (update "sendAll" (sub 1 (get state "sendAll"))) then => (end 0))
              value: (if (get state "sendAll") "X" "")
            }
            {
              pos: [35 0]
              size: [70 20]
              font: {
                color: "rgb(105, 153, 223)"
                size: 18
                weight: "bold"
              }
              value: "send all"
            }
          ]
      }

      sendBox = {
        pos: [0 475]
        size: [w (sub h 475)]
        background: "rgb(240,240,240)"
        value: [
          {
            pos: [60 40]
            size: [255 54]
            cursor: "pointer"
            background: "rgb(88,145,220)"
            radius: 2
            font:{size:22}
            borders:{bottom:{size:3 style:"solid" color:"rgb(60,151,212)"}}
            onClick: do => end =>
              tx = {
                from: (get state "from")
                to: (get state "to")
                value: (get state "amount")
              }
              (do "setState" (update "result" "") then =>
                (do "eth" ["sendTransaction" tx] result =>
                  (do "setState" (update "result" result)
                    then => (end 0))))
            value: {
              pos: [0 10]
              size: [255 36]
              font: {
                color: "rgb(250,250,250)"
                align: "center"
                size: 26
              }
              value: (con "SEND " (con (slc (get state "amount") 0 1) " ETHER"))
            }
          }
          {
            pos: [156 110]
            size: [(sub w 156) 16]
            value: (get state "result")
          }
        ]
      }

      [
        titleBar
        fromBox
        toBox
        amountBox
        unitBox
        sendAllBox
        sendBox
      ]
  }

sendApp
