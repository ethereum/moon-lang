title = zb2rhgVxRuCMyiunDuRaMtFCFEfqNU3CRqz1SzSa2EpCACRfD
label = zb2rhcoC7ABP6T3q2AhqmUY47SXCc7d8fGHYkGL9UWioaamBU
input = zb2rhXu3yqPyEx5nBKqATrLY8ZYLLqh5HjXQa71TzEzpWBPAa
formatAmount = zb2rhgj5ZNgE8uiu2NWB7dmb8HcdVHi5X5a7DgmJWJPuUEkFJ
addressInput = zb2rhbPZQztX9vDwXKAQpmRXjFmcCch24BNhZy8QoMC355tPN
do = zb2rhkLJtRQwHz9e5GjiQkBtjL2SzZZByogr1uNZFyzJGA9dX

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
          onHear: from => 
            (do "setState" (updateAddress from))>
            (do "stop")
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
        name: "amount-box"
        pos: [60 324]
        size: [160 66]
        onHear: amount => 
          (do "setState" (updateState "amount" amount))>
          (do "stop")
        font: labelText
        value: label
        set: {
          label: "AMOUNT"
          type: "number"
          disabled: (get state "sendAll")
          thing: input
        }
      }

      tokenBox = {
        name: "token-box"
        pos: [250 324]
        size: [160 66]
        font: labelText
        value: label
        set: {
          label: ""
          type: "text"
          thing: input
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
              onClick: |
                newState = (updateState "sendAll" (sub 1 (get state "sendAll")))
                (do "setState" newState)>
                (do "stop")
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

      sendButton = {
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
            onClick: |
              tx = {
                from: (get state "from")
                to: (get state "to")
                value: (get state "amount")
              }
              (do "setState" (updateState "result" ""))>
              result = <(do "eth" ["sendTransaction" tx])
              (do "setState" (updateState "result" result))>
              (do "stop")
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
        tokenBox
        sendAllBox
        sendButton
      ]
  }

sendApp
