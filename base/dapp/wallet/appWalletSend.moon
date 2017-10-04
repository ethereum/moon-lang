title = zb2rhgVxRuCMyiunDuRaMtFCFEfqNU3CRqz1SzSa2EpCACRfD
label = zb2rhcoC7ABP6T3q2AhqmUY47SXCc7d8fGHYkGL9UWioaamBU
input = zb2rhXu3yqPyEx5nBKqATrLY8ZYLLqh5HjXQa71TzEzpWBPAa
formatAmount = zb2rhgj5ZNgE8uiu2NWB7dmb8HcdVHi5X5a7DgmJWJPuUEkFJ
addressInput = zb2rhb1RYphGD1XFXR3wYxoXUY9pLQZrVtKncyKEJmCQ2VQex

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

      updateState = key => val =>
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
          onHear: from => do => (do "setState" (updateAddress from) then => (do "stop"))
          name: addressName
          value: label
          set: {
            label: addressLabel
            thing: addressInput
          }
        }

      fromBox = (addressBox 95 (updateState "from") "from" "FROM")

      toBox = (addressBox 191 (updateState "to") "to" "SEND TO")

      amountBox = {
        pos: [60 324]
        size: [160 66]
        onHear: amount => do => (do "setState" (updateState "amount" amount) then => (do "stop"))
        font: labelText
        value: label
        set: {
          label: "AMOUNT"
          type: "number"
          disabled: (get state "sendAll")
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
                      amount = (slc (nts (stn (get state "amount"))) 0 10)
                      (con (con amount " ") "ETHER")
                  }
                ]
            }
        }
      }

      sendAllBox = {
        pos: [60 422]
        size: [105 20]
        value:
          [
            {
              pos: [0 0]
              size: [20 20]
              background: "rgb(241, 241, 241)"
              font: {
                align: "center"
                color: "rgb(140,140,140)"
              }
              cursor: "pointer"
              onClick: do =>
                newState = (updateState "sendAll" (sub 1 (get state "sendAll")))
                (do "setState" newState then => (do "stop"))
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
            size: [280 54]
            cursor: "pointer"
            background: "rgb(88,145,220)"
            radius: 2
            font:{size:22}
            borders:{bottom:{size:3 style:"solid" color:"rgb(60,151,212)"}}
            onClick: do =>
              tx = {
                from: (get state "from")
                to: (get state "to")
                value: (get state "amount")
              }
              (do "setState" (updateState "result" "") then =>
                (do "eth" ["sendTransaction" tx] result =>
                  (do "setState" (updateState "result" result) then =>
                    (do "stop"))))
            value: {
              pos: [0 10]
              size: [280 36]
              font: {
                color: "rgb(250,250,250)"
                align: "center"
                size: 26
              }
              value: 
                amount = (if (get state "sendAll") "ALL" (formatAmount (stn (get state "amount"))))
                (con "SEND " (con amount " ETHER"))
            }
          }
          {
            pos: [60 110]
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
